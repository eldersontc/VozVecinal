import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Loading } from 'ionic-angular';
import { UsuarioProvider, IUsuario } from '../../providers/usuario/usuario';
import { UsuarioPage } from '../usuario/usuario';

@Component({
  selector: 'page-list-usuario',
  templateUrl: 'list-usuario.html',
})
export class ListUsuarioPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public usuarioPrv: UsuarioProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.get();
  }

  loading: Loading;

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Cargando...'
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

  data: IUsuario[] = [];

  get(){
    this.presentLoading();
    this.usuarioPrv.get().subscribe(data => {
      this.data = data;
      this.loading.dismiss();
    }, error => {
      this.showError();
      this.loading.dismiss();
    });
  }

  edit(d: IUsuario){
    this.navCtrl.push(UsuarioPage, { usuario: d });
  }

  add(){
    this.navCtrl.push(UsuarioPage);
  }

  usuario: IUsuario;  

  showConfirm(d: IUsuario) {
    this.usuario = d;
    const confirm = this.alertCtrl.create({
      title: 'Eliminar',
      message: '¿Desea continuar?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => { }
        },
        {
          text: 'OK',
          handler: () => {
            this.delete();
          }
        }
      ]
    });
    confirm.present();
  }

  delete() {
    this.presentLoading();
    this.usuarioPrv.delete(this.usuario.id).subscribe(data => {
      this.loading.dismiss();
      this.get();
    }, error => {
      this.showError();
      this.loading.dismiss();
    });
  }

}
