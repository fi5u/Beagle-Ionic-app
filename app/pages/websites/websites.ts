import {Events, IonicApp, Modal, NavController, NavParams, Page, Platform} from 'ionic-angular';
import {WebsiteModal} from './modals/website-modal';
import {AutoFocusDirective} from '../../utils/directives/auto-focus.directive';
import {WebsiteStorageService} from '../../storage/website-storage';

@Page({
    templateUrl: 'build/pages/websites/websites.html',
    directives: [AutoFocusDirective],
    providers: [WebsiteStorageService]
})
export class WebsitesPage {
    itemSelected: boolean[];
    itemQuery: string[];
    items: Array<{ id: number, title: string, url: string, spaceSymbol: string }>;
    list: any;

    constructor(private app: IonicApp, private nav: NavController, private events: Events, private platform: Platform, public websiteStorage: WebsiteStorageService) {
        this.app = app;
        this.nav = nav;
        this.items = [];
        this.itemSelected = [];
        this.itemQuery = [];
        this.websiteStorage = websiteStorage;

        events.subscribe('website:added', (website) => {
            this.items.push(website[0]);
        });

        events.subscribe('website:deleted', (thisid) => {
            const itemIndex = this.items.findIndex((item) => item.id === thisid[0]);
            this.items.splice(itemIndex, 1);
        });

        events.subscribe('websites:all', (websites) => {
            this.populateWebsites(websites[0]);
        });

        platform.ready().then(() => {
            this.getWebsites();
        });
    }

    ngAfterViewInit() {
        this.list = this.app.getComponent('websites');
    }

    getWebsites() {
        this.websiteStorage.getItems();
    }

    populateWebsites(websites) {
        for (let website in websites) {
            this.items.push(websites[website]);
        }
    }

    addWebsite() {
        const itemModal = Modal.create(WebsiteModal, {});
        itemModal.onDismiss(data => {
            if (data) {
                this.websiteStorage.setItem(data);
            }
        });
        this.nav.present(itemModal);
    }

    editWebsite(item) {
        const editItemModal = Modal.create(WebsiteModal, item);
        editItemModal.onDismiss(data => {
            if (data) {
                this.websiteStorage.updateItem(data);
            }
            this.list.closeSlidingItems();
        });
        this.nav.present(editItemModal);
    }

    deleteWebsite(id) {
        this.websiteStorage.deleteItem(id);
    }

    itemTapped(event, item, i) {
        if (!this.itemSelected[i]) { this.itemSelected = []; }
        this.itemSelected[i] = this.itemSelected[i] ? false : true;
        this.list.enableSlidingItems(!this.itemSelected[i]);
    }

    queryInput(event) {
        // Prevent space from closing box
        event.preventDefault();
    }

    sendQuery(event, i) {
        let query = this.itemQuery[i].trim().replace(' ', this.items[i].spaceSymbol || '+');
        let url = this.items[i].url + '?' + query;
        event.stopPropagation();
        console.log('Clicked: ' + i + ' - ' + this.itemQuery[i]);
        window.open(url, '_system', 'location=yes,enableViewportScale=yes');
    }
}