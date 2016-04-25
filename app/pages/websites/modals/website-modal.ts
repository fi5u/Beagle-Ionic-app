import {Page, ViewController} from 'ionic-angular';
import {Control, FormBuilder, Validators} from 'angular2/common';
import {AutoUrlService} from '../services/auto-url.service';
import {BglValidators} from '../../../utils/validators';
import {HttpPrefixDirective} from '../../../utils/directives/http-prefix.directive';
import {Keyboard} from 'ionic-native';

@Page({
    templateUrl: 'build/pages/websites/modals/website-modal.html',
    directives: [HttpPrefixDirective],
    providers: [BglValidators, AutoUrlService]
})
export class WebsiteModal {
    autoForm: any;
    customForm: any;
    viewCtrl: any;
    item: any;
    itemOriginal: any;
    searchInProgress: boolean;
    advancedSection: { isOpen: boolean };
    autoUrlService: any;

    constructor(viewCtrl: ViewController, fb: FormBuilder, bglValidators: BglValidators, autoUrlService: AutoUrlService) {
        this.viewCtrl = viewCtrl;
        this.item = viewCtrl.data;
        this.autoUrlService = autoUrlService;
        this.itemOriginal = JSON.parse(JSON.stringify(this.item));
        this.searchInProgress = false;

        this.autoForm = fb.group({
            'autoUrl': ['', Validators.compose([Validators.required, bglValidators.weburl])]
        });

        this.customForm = fb.group({
            'title': ['', Validators.required],
            'url': ['', Validators.compose([Validators.required, bglValidators.weburl])],
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
        this.autoUrlService.fetchUrl(url).subscribe(
            data => {
                if(data.status === 'success') {
                    const template = this.autoUrlService.getUrlTemplate(data);
                    Object.assign(this.item, template);
                    this.saveData();
                }
                else {
                    console.log('Failed: ' + data.status);
                }
            },
            err => {
                console.log(err);
            },
            () => {
                this.searchInProgress = false;
                console.log('Auto fetch URL complete');
            }
        );
    }
}