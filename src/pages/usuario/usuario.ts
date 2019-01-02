import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Loading } from 'ionic-angular';
import { IUsuario, UsuarioProvider } from '../../providers/usuario/usuario';
import { ListUsuarioPage } from '../list-usuario/list-usuario';

@Component({
  selector: 'page-usuario',
  templateUrl: 'usuario.html',
})
export class UsuarioPage {

  usuario: IUsuario = { perfil: 'ADMINISTRADOR' };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public usuarioPrv: UsuarioProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
    if (navParams.data.usuario) {
      this.usuario = navParams.data.usuario;
    }
  }

  ionViewDidLoad() { }

  loading: Loading;

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Procesando...'
    });
    this.loading.present();
  }

  showError() {
    const alert = this.alertCtrl.create({
      title: 'Problema de conexión',
      subTitle: 'Ocurrió un error en la conexión.',
      buttons: ['OK']
    });
    alert.present();
  }

  back() {
    this.navCtrl.setRoot(ListUsuarioPage);
  }

  save() {
    this.presentLoading();
    if (this.usuario.id > 0) {
      this.usuarioPrv.update(this.usuario).subscribe(data => {
        this.loading.dismiss();
        this.back();
      }, error => {
        this.showError();
        this.loading.dismiss();
      });
    } else {
      this.usuarioPrv.create(this.usuario).subscribe(data => {
        this.loading.dismiss();
        this.back();
      }, error => {
        this.showError();
        this.loading.dismiss();
      });
    }
  }

}
