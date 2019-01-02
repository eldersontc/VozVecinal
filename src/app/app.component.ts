import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AcercaDePage } from '../pages/acerca-de/acerca-de';
import { ElegirRolPage } from '../pages/elegir-rol/elegir-rol';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ElegirRolPage;

  pages: Array<{ title: string, component: any, icon: string }>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events) {
    this.initializeApp();
    this.pages = [
      { title: 'Acerca de', component: AcercaDePage, icon: 'information-circle' }
    ];
    events.subscribe('user:setOptions', (data) => {
      this.rol = data.rol;
      this.setOptions(data.opciones);
    });
  }

  setOptions(data){
    this.pages = data;
    this.openPage(this.pages[0]);
  }

  rol: string = undefined;

  logout() {
    this.rol = undefined;
    this.pages = [
      { title: 'Acerca de', component: AcercaDePage, icon: 'information-circle' }
    ];
    this.nav.setRoot(ElegirRolPage);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      if (this.platform.is('android')) {
        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString('#427fe9');
      }
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
