import {App, IonicApp, Platform} from 'ionic-angular';
import {GettingStartedPage} from './pages/getting-started/getting-started';
import {ListPage} from './pages/list/list';
import {WebsitesPage} from './pages/websites/websites';
import {WebsiteStorageService} from './storage/website-storage';

@App({
    templateUrl: 'build/app.html',
    config: {
        isProduction: false,
        pathAutoLocal: 'http://dev.beagle/utils/autotemplate.php',
        pathAutoRemote: 'https://utils.d24studio.com/beagle/autotemplate.php'
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
      // The platform is now ready. Note: if this callback fails to fire, follow
      // the Troubleshooting guide for a number of possible solutions:
      //
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // First, let's hide the keyboard accessory bar (only works natively) since
      // that's a better default:
      //
      // Keyboard.setAccessoryBarVisible(false);
      //
      // For example, we might change the StatusBar color. This one below is
      // good for dark backgrounds and light text:
      // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    let nav = this.app.getComponent('nav');
    nav.setRoot(page.component);
  }
}
