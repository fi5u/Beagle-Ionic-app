import {App, Config, IonicApp, Platform} from 'ionic-angular';
import {GettingStartedPage} from './pages/getting-started/getting-started';
import {ListPage} from './pages/list/list';
import {WebsitesPage} from './pages/websites/websites';
import {WebsiteStorageService} from './storage/website-storage';
import {Keyboard} from 'ionic-native';
//import {enableProdMode} from 'angular2/core';
//enableProdMode();

@App({
    templateUrl: 'build/app.html',
    config: {
        developmentMode: 'prod', // dev / prod
        pathAuto: {
            dev: 'http://dev.beagle/utils/autotemplate.php',
            prod: 'https://utils.d24studio.com/beagle/autotemplate.php'
        },
        searchPlaceholder: '[?]'
    }, // http://ionicframework.com/docs/v2/api/config/Config/
    providers: [WebsiteStorageService]
})
class MyApp {
    rootPage: any = WebsitesPage;
    pages: Array<{title: string, component: any}>

    constructor(private app: IonicApp, private platform: Platform, private websiteStorage: WebsiteStorageService) {
        this.initializeApp();
        websiteStorage.initializeStorage();

        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Getting Started', component: GettingStartedPage },
            { title: 'List', component: ListPage },
            { title: 'Websites', component: WebsitesPage }
        ];
    }

    initializeApp() {
        this.platform.ready().then(() => {
            Keyboard.hideKeyboardAccessoryBar(true);
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        let nav = this.app.getComponent('nav');
        nav.setRoot(page.component);
    }
}
