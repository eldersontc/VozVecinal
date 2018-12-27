import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ActionSheetController, LoadingController, AlertController, Loading } from 'ionic-angular';
import { GoogleMap, GoogleMaps, GoogleMapsEvent, Marker } from '@ionic-native/google-maps';
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

  ionViewDidLoad() {
    this.verifyGPS();
  }

  enableGps: boolean = false;

  verifyGPS() {
    this.diagnostic.isLocationEnabled().then(data => {
      this.enableGps = data;
      this.makeMap();
      if (!data) {
        this.requestGPS();
      }
    });
  }

  marker: Marker;

  moveCamera() {
    this.map.getMyLocation().then(data => {
      this.map.moveCamera({
        target: data.latLng,
        zoom: 18,
      });
      if (this.marker) {
        this.marker.setPosition(data.latLng);
      } else {
        this.marker = this.map.addMarkerSync({
          map: this.map,
          icon: 'red',
          animation: 'DROP',
          position: data.latLng,
          draggable: true
        });
      }
    });
  }

  requestGPS() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
          this.enableGps = true;
          this.map.setMyLocationButtonEnabled(true);
          this.moveCamera();
        });
      }
    });
  }

  makeMap() {
    this.map = this.googlemaps.create('map_canvas',
      {
        mapType: 'MAP_TYPE_TERRAIN',
        controls: {
          compass: true,
          myLocation: true,
          myLocationButton: this.enableGps,
          zoom: true
        }
      });

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      if (this.enableGps) {
        this.moveCamera();
      }
    });

    this.map.on(GoogleMapsEvent.MY_LOCATION_BUTTON_CLICK).subscribe(() => {
      this.moveCamera();
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
      title: 'Enviado',
      subTitle: 'Gracias por contribuir en la limpieza del distrito.',
      buttons: ['OK']
    });
    alert.present();
  }

  showError() {
    const alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Revisa tu conexión a internet.',
      buttons: ['OK']
    });
    alert.present();
  }

  create(foto: any = undefined) {
    this.presentLoading("Enviando...");
    this.incidenciaPrv.create({
      latitud: this.marker.getPosition().lat,
      longitud: this.marker.getPosition().lng,
      base64: foto,
      foto: foto ? true : false,
      fabricante: this.device.manufacturer,
      modelo: this.device.model,
      plataforma: this.device.platform,
      version: this.device.version,
      serial: this.device.serial,
      UUID: this.device.uuid
    }).subscribe(() => {
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
          icon: !this.platform.is('ios') ? 'pin' : null,
          handler: () => {
            this.create();
          }
        }, {
          text: 'Foto',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            this.takePhoto();
          }
        }, {
          text: 'Cancelar',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => { }
        }
      ]
    });
    actionSheet.present();
  }

  onShowOptions(e) {
    this.presentActionSheet();
  }

  takePhoto() {
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
    }).then(data => {
      this.create(data);
    });
  }

}