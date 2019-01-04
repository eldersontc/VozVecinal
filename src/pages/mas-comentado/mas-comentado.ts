import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { ComentarioProvider, IComentario } from '../../providers/comentario/comentario';

@Component({
  selector: 'page-mas-comentado',
  templateUrl: 'mas-comentado.html',
})
export class MasComentadoPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public comentarioPrv: ComentarioProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
    this.get();
  }

  ionViewDidLoad() { }

  loading: Loading;

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Enviando...'
    });
    this.loading.present();
  }

  showError() {
    const alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Revisa tu conexión a internet.',
      buttons: ['OK']
    });
    alert.present();
  }

  data: IComentario[] = [];
  calificacion: number = 1;

  get() {
    this.presentLoading();
    this.comentarioPrv.get().subscribe(data => {
      this.loading.dismiss();
      if (data.length > 0) {
        this.data = data;
        this.calificacion = data[0].calificacion;
      }
    }, error => {
      this.loading.dismiss();
      this.showError();
    })
  }

}
