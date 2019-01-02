import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, AlertController, Loading } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IncidenciaPage } from '../pages/incidencia/incidencia';
import { ComentarioPage } from '../pages/comentario/comentario';
import { AcercaDePage } from '../pages/acerca-de/acerca-de';
import { UsuarioProvider } from '../providers/usuario/usuario';
import { ListUsuarioPage } from '../pages/list-usuario/list-usuario';
import { PuntosBasuraPage } from '../pages/puntos-basura/puntos-basura';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any, icon: string }>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public usuarioPrv: UsuarioProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
    this.initializeApp();
  }

  rol: string = undefined;
  login: boolean = false;

  ciudadano() {
    this.rol = 'CIUDADANO';
    this.pages = [
      { title: 'Basura en la vía pública', component: IncidenciaPage, icon: 'pin' },
      { title: 'Dejar un comentario', component: ComentarioPage, icon: 'chatbubbles' },
      { title: 'Acerca de', component: AcercaDePage, icon: 'information-circle' }
    ];
    this.openPage(this.pages[0]);
  }

  autoridad() {
    this.rol = 'AUTORIDAD';
  }

  loading: Loading;

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Autenticando...'
    });
    this.loading.present();
  }

  showError() {
    const alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Usuario o Password incorrecto.',
      buttons: ['OK']
    });
    alert.present();
  }

  usuario: string;
  password: string;

  ingresar() {
    this.presentLoading();
    this.usuarioPrv.auth({
      alias: this.usuario,
      password: this.password
    }).subscribe(data => {
      if (data.perfil == 'ADMINISTRADOR') {
        this.pages = [
          { title: 'Puntos de basura', component: PuntosBasuraPage, icon: 'pin' },
          { title: 'Usuarios', component: ListUsuarioPage, icon: 'people' },
          { title: 'Acerca de', component: AcercaDePage, icon: 'information-circle' }
        ];
      } else {
        this.pages = [
          { title: 'Puntos de basura', component: PuntosBasuraPage, icon: 'pin' },
          { title: 'Acerca de', component: AcercaDePage, icon: 'information-circle' }
        ];
      }
      this.login = true;
      this.rol = data.perfil;
      this.openPage(this.pages[0]);
      this.usuario = '';
      this.password = '';
      this.loading.dismiss();
    }, error => {
      this.showError();
      this.loading.dismiss();
    });

  }

  regresar() {
    this.rol = undefined;
    this.usuario = '';
    this.password = '';
  }

  logout() {
    this.rol = undefined;
    this.login = false;
    this.pages = [];
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
