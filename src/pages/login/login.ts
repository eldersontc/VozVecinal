import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Loading, Events } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { PuntosBasuraPage } from '../puntos-basura/puntos-basura';
import { ListUsuarioPage } from '../list-usuario/list-usuario';
import { AcercaDePage } from '../acerca-de/acerca-de';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public usuarioPrv: UsuarioProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public events: Events) {
  }

  ionViewDidLoad() { }

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
        this.events.publish('user:setOptions', {
          rol: data.perfil,
          opciones: [
            { title: 'Puntos de basura', component: PuntosBasuraPage, icon: 'pin' },
            { title: 'Usuarios', component: ListUsuarioPage, icon: 'people' },
            { title: 'Acerca de', component: AcercaDePage, icon: 'information-circle' }
          ]
        });
      } else {
        this.events.publish('user:setOptions', {
          rol: data.perfil,
          opciones: [
            { title: 'Puntos de basura', component: PuntosBasuraPage, icon: 'pin' },
            { title: 'Acerca de', component: AcercaDePage, icon: 'information-circle' }
          ]
        });
      }
      this.usuario = '';
      this.password = '';
      this.loading.dismiss();
    }, error => {
      this.showError();
      this.loading.dismiss();
    });

  }

}
