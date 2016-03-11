import {Page, ViewController} from 'ionic-angular';
import {Validators, FormBuilder, Control} from 'angular2/common';
import {BglValidators} from '../../../utils/validators';
import {HttpPrefixDirective} from '../../../utils/directives/http-prefix.directive';

@Page({
    templateUrl: 'build/pages/websites/modals/website-modal.html',
    directives: [HttpPrefixDirective],
    providers: [BglValidators]
})
export class WebsiteModal {
    form: any;
    viewCtrl: any;
    item: any;
    itemOriginal: any;
    advancedSection: { isOpen: boolean };

    constructor(viewCtrl: ViewController, fb: FormBuilder, bglValidators: BglValidators) {
        this.viewCtrl = viewCtrl;
        this.item = viewCtrl.data;
        this.itemOriginal = JSON.parse(JSON.stringify(this.item));

        this.form = fb.group({
            //'editType': ['', Validators.required],
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

        for (var field in defaultFields) {
            // Only apply the default if no value already
            if (!this.item[defaultFields[field].fieldKey]) {
                this.item[defaultFields[field].fieldKey] = defaultFields[field].fieldVal;
            }
        }
    }

    cancelModal() {
        let thisItem = this.item;
        // Loop through items and reassign to original values
        for (var key in thisItem) {
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
}