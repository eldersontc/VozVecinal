import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ActionSheetController, LoadingController, AlertController, Loading } from 'ionic-angular';
import { GoogleMap, GoogleMaps, GoogleMapOptions, GoogleMapsEvent, LatLng } from '@ionic-native/google-maps';
import { Camera } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { IncidenciaProvider } from '../../providers/incidencia/incidencia';

@Component({
  selector: 'page-incidencia',
  templateUrl: 'incidencia.html',
})
export class IncidenciaPage {

  map: GoogleMap;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    public googlemaps: GoogleMaps,
    public camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public device: Device,
    public diagnostic: Diagnostic,
    public locationAccuracy: LocationAccuracy,
    public incidenciaPrv: IncidenciaProvider) {
  }

  ionViewDidLoad(){
    this.validarGps();
  }

  enableGps: boolean = false;

  validarGps(){
    this.diagnostic.isLocationEnabled().then(resultado =>{
      this.enableGps = resultado;
      this.crearMapa();
      if(!resultado){
        this.solicitarGps();
      }
    }).catch(error => {
      console.log(error);
    });
  }

  solicitarGps(){
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            this.enableGps = true;
            this.map.setMyLocationButtonEnabled(true);
            this.moveCamera();
          },
          error => {
            console.log('Error requesting location permissions')
          }
        );
      }
    
    });
  }

  crearMapa(){
    let opcionesMapa: GoogleMapOptions = {
      mapType: 'MAP_TYPE_TERRAIN',
      controls: {
        compass: true,
        myLocation: true,
        myLocationButton: this.enableGps,
        zoom: true
      }
    };

    this.map = this.googlemaps.create('map_canvas', opcionesMapa);
    this.map.one(GoogleMapsEvent.MAP_READY).then(resultado => {
        if(this.enableGps){
          this.moveCamera();
        }
      }
    ).catch(error =>{
        console.log(error);
      }
    );
  }

  moveCamera(){
    this.map.getMyLocation().then(respuesta => {
      this.map.moveCamera({
        target: respuesta.latLng,
        zoom: 18,
      });
    }).catch(error => {
      console.log(error);
    });
  }

  loading: Loading;

  presentLoading(message: string) {
    this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();
  }

  showConfirm() {
    const alert = this.alertCtrl.create({
      title: 'Enviado!',
      subTitle: 'Gracias por contribuir a mantener limpio nuestro distrito.',
      buttons: ['OK']
    });
    alert.present();
  }

  showError() {
    const alert = this.alertCtrl.create({
      title: 'Ups!',
      subTitle: 'Ocurrió un error al enviar tu reporte.',
      buttons: ['OK']
    });
    alert.present();
  }

  prepareCreate(foto: string = ''){
    this.presentLoading("Enviando...");
    this.map.getMyLocation().then(respuesta => {
        this.crearIncidencia(foto, respuesta.latLng);
      }
    ).catch(error => {
        this.loading.dismiss();
        console.log(error);
      }
    );
  }

  crearIncidencia(foto: string = '', latLng: LatLng){
    this.incidenciaPrv.create({
      latitud: latLng.lat,
      longitud: latLng.lng,
      base64: foto,
      foto: foto ? true: false,
      fabricante: this.device.manufacturer,
      modelo: this.device.model,
      plataforma: this.device.platform,
      version: this.device.version,
      serial: this.device.serial,
      UUID: this.device.uuid
    }).subscribe(data =>{
      this.loading.dismiss();
      this.showConfirm();
    }, error => {
      this.loading.dismiss();
      this.showError();
    })
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Elegir como',
      buttons: [
        {
          text: 'Ubicación',
          icon: !this.platform.is('ios') ? 'navigate' : null,
          handler: () => {
            this.prepareCreate();
          }
        },{
          text: 'Foto',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.capturarFoto();
          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {}
        }
      ]
    });
    actionSheet.present();
  }

  onShowOptions(e){
    this.presentActionSheet();
  }

  capturarFoto(){
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: false,
      encodingType: this.camera.EncodingType.JPEG,
      targetHeight: 1024,
      targetWidth: 1024,
      correctOrientation: true,
      saveToPhotoAlbum: true
    }).then(resultado => {
      this.prepareCreate(resultado);
    }).catch(error =>{
      console.log(error);
    });
  }

}