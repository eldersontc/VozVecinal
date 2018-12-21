import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { ComentarioProvider } from '../../providers/comentario/comentario';

@Component({
  selector: 'page-comentario',
  templateUrl: 'comentario.html',
})
export class ComentarioPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public comentarioPrv: ComentarioProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public device: Device) {
  }

  descripcion: string;
  calificacion: number = 0;

  ionViewDidLoad() {}

  loading: Loading;

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Enviando...'
    });
    this.loading.present();
  }

  showConfirm() {
    const alert = this.alertCtrl.create({
      title: 'Enviado!',
      subTitle: 'Gracias por darnos tu opinión.',
      buttons: ['OK']
    });
    alert.present();
  }

  showError() {
    const alert = this.alertCtrl.create({
      title: 'Ups!',
      subTitle: 'Ocurrió un error al enviar opinión.',
      buttons: ['OK']
    });
    alert.present();
  }

  enviar(){
    this.presentLoading();
    this.comentarioPrv.create({
      descripcion: this.descripcion,
      calificacion: this.calificacion,
      fabricante: this.device.manufacturer,
      modelo: this.device.model,
      plataforma: this.device.platform,
      version: this.device.version,
      serial: this.device.serial,
      UUID: this.device.uuid
    }).subscribe(data =>{
      this.loading.dismiss();
      this.showConfirm();
      this.descripcion = '';
      this.calificacion = 0;
    }, error => {
      this.loading.dismiss();
      this.showError();
    })
  }

}