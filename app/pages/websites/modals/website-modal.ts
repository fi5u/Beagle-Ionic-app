import {Page, ViewController} from 'ionic-angular';
import {Control, FormBuilder, Validators} from 'angular2/common';
import {Keyboard} from 'ionic-native';
import {AutoUrlService} from '../services/auto-url.service';
import {BglValidators} from '../../../utils/validators';
import {HttpPrefixDirective} from '../../../utils/directives/http-prefix.directive';
import {TrackingService} from '../../../utils/services/tracking';

@Page({
    templateUrl: 'build/pages/websites/modals/website-modal.html',
    directives: [HttpPrefixDirective],
    providers: [BglValidators, AutoUrlService]
})
export class WebsiteModal {
    autoForm: any;
    customForm: any;
    item: any;
    itemOriginal: any;
    searchInProgress: boolean;
    advancedSection: { isOpen: boolean };
    showError: boolean;
    error: string;
    errorTimeout: any;
    searchTimeout: any;

    constructor(
        private viewCtrl: ViewController,
        private fb: FormBuilder,
        private bglValidators: BglValidators,
        private tracking: TrackingService,
        private autoUrlService: AutoUrlService
        ) {
        this.viewCtrl = viewCtrl;
        this.item = viewCtrl.data;
        this.itemOriginal = JSON.parse(JSON.stringify(this.item));
        this.searchInProgress = false;
        this.showError = false;

        this.autoForm = fb.group({
            'autoUrl': ['', Validators.compose([Validators.required, bglValidators.weburl])]
        });

        this.customForm = fb.group({
            'title': ['', Validators.required],
            'url': ['', Validators.compose([Validators.required, bglValidators.weburl, bglValidators.urlTemplate])],
            'spaceSymbol': ['', Validators.required]
        });

        this.advancedSection = {
            isOpen: false
        }
        this.setDefaults();
    }

    setDefaults() {
        let defaultFields = [
            {
                fieldKey: 'spaceSymbol',
                fieldVal: '+'
            }
        ];

        for(var field in defaultFields) {
            // Only apply the default if no value already
            if (!this.item[defaultFields[field].fieldKey]) {
                this.item[defaultFields[field].fieldKey] = defaultFields[field].fieldVal;
            }
        }
    }

    cancelModal() {
        let thisItem = this.item;
        // Loop through items and reassign to original values
        for(var key in thisItem) {
            if (thisItem.hasOwnProperty(key)) {
                thisItem[key] = this.itemOriginal[key];
            }
        }
        this.viewCtrl.dismiss();
    }

    saveData() {
        this.viewCtrl.dismiss(this.item);
    }

    advancedSectionToggle(open) {
        this.advancedSection.isOpen = !this.advancedSection.isOpen || open ? true : false;
    }

    fetchAutoUrl(url) {
        Keyboard.close();
        window.setTimeout(() => {
            this.searchInProgress = true;
        });
        this.searchTimeout = setTimeout(() => {
            if(this.searchInProgress) {
                this.searchInProgress = false;
                this.error = this.getErrorMsg('timedout');
                this.shouldShowError();
            }
        }, 12000);
        this.autoUrlService.fetchUrl(url).subscribe(
            data => {
                if(!this.searchInProgress) {
                    return false;
                }
                if(data.status === 'success') {
                    const template = this.autoUrlService.getUrlTemplate(data);
                    Object.assign(this.item, template);
                    this.saveData();
                }
                else {
                    this.error = this.getErrorMsg(data.status);
                    this.shouldShowError();
                    this.tracking.saveEvent('auto url', { action: 'fetch error', error: data.status });
                }
            },
            err => {
                console.log(err);
            },
            () => {
                this.searchInProgress = false;
            }
        );
    }

    shouldShowError() {
        this.showError = true;

        this.errorTimeout = setTimeout(() => {
            this.showError = false;
        }, 5000);
    }

    getErrorMsg(errCode) {
        if(errCode === 'nobody') { return 'There was an error with the page. Try again or use the custom form.'; }
        if(errCode === 'ntwerr') { return 'We couldn’t connect to the page. Check that the address is correct and try again. Alternatively, use the custom form.'; }
        if(errCode === 'timedout') { return 'It took too long. Try again or use the custom form.'; }
        if(errCode === 'btnnf') { return 'Couldn’t find a search box on the page. Try again or use the custom form.'; }
        return errCode;
    }

    hideError() {
        clearTimeout(this.errorTimeout);
        this.showError = false;
    }
}