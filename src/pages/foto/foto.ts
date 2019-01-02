import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Loading } from 'ionic-angular';
import { IncidenciaProvider } from '../../providers/incidencia/incidencia';

@Component({
  selector: 'page-foto',
  templateUrl: 'foto.html',
})
export class FotoPage {

  base64: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public incidenciaPrv: IncidenciaProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
    this.get(this.navParams.data.id);
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

  get(id){
    this.presentLoading();
    this.incidenciaPrv.getPhoto(id).subscribe(data => {
      this.base64 = data;
      this.loading.dismiss();
    }, error => {
      this.showError();
      this.loading.dismiss();
    });
  }

  ionViewDidLoad() {}

}
