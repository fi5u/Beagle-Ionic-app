import {App, IonicApp, Platform, Storage, SqlStorage} from 'ionic-angular';
import {GettingStartedPage} from './pages/getting-started/getting-started';
import {ListPage} from './pages/list/list';
import {WebsitesPage} from './pages/websites/websites';
import {TrackingService} from './utils/services/tracking';
import {WebsiteStorageService} from './utils/services/website-storage';
import {SettingsStorageService} from './utils/services/settings-storage';
import {Keyboard} from 'ionic-native';

//import {enableProdMode} from 'angular2/core';
//enableProdMode();

@App({
    templateUrl: 'build/app.html',
    config: {
        developmentMode: 'dev', // dev / prod
        pathAuto: {
            dev: 'http://dev.beagle/utils/autotemplate.php',
            prod: 'https://utils.d24studio.com/beagle/autotemplate.php'
        },
        pathTracking: {
            dev: 'http://dev.beagle/utils/tracking.php',
            prod: 'https://utils.d24studio.com/beagle/tracking.php'
        },
        searchPlaceholder: '[?]'
    }, // http://ionicframework.com/docs/v2/api/config/Config/
    providers: [WebsiteStorageService, SettingsStorageService, TrackingService]
})
class MyApp {
    rootPage: any = WebsitesPage;
    pages: Array<{title: string, component: any}>
    data: Array<{id: number, name: string, value: string}>;

    constructor(
        private app: IonicApp,
        private platform: Platform,
        private settingsStorage: SettingsStorageService,
        private tracking: TrackingService,
        private websiteStorage: WebsiteStorageService
        ) {
        this.initializeApp();
        this.pages = [
            { title: 'Getting Started', component: GettingStartedPage },
            { title: 'List', component: ListPage },
            { title: 'Websites', component: WebsitesPage }
        ];
        this.tracking.saveProperty('last activity', new Date().toISOString());
    }

    initializeApp() {
        this.websiteStorage.initializeStorage();
        this.settingsStorage.initializeSettingsStorage();
        this.platform.ready().then(() => {
            Keyboard.hideKeyboardAccessoryBar(true);
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        let nav = this.app.getComponent('nav');
        nav.setRoot(page.component);
        this.tracking.saveEvent('navigate', { page: page.title });
    }
}
