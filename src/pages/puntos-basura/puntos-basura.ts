import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { GoogleMapsEvent, GoogleMaps, GoogleMap, Marker } from '@ionic-native/google-maps';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { IncidenciaProvider, IIncidencia } from '../../providers/incidencia/incidencia';
import { FotoPage } from '../foto/foto';

@Component({
  selector: 'page-puntos-basura',
  templateUrl: 'puntos-basura.html',
})
export class PuntosBasuraPage {

  map: GoogleMap;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public googlemaps: GoogleMaps,
    public diagnostic: Diagnostic,
    public locationAccuracy: LocationAccuracy,
    public alertCtrl: AlertController,
    public incidenciaPrv: IncidenciaProvider) {
      platform.ready().then(() => {
        this.verifyLocation();
      });
  }

  ionViewDidLoad() {}

  verifyLocation(){
    this.diagnostic.isLocationAuthorized().then((data) => {
      //alert('VL ' + JSON.stringify(data));
      if (data){
        this.verifyGPS();
      } else {
        this.requestLocation();
      }
    }).catch(error => {
      //alert('error VL ' + JSON.stringify(error));
    });
  }

  requestLocation(){
    this.diagnostic.requestLocationAuthorization().then((data) => {
      //alert('RL' + JSON.stringify(data));
      if (data == 'GRANTED') {
        this.verifyGPS();
      }
    }).catch(error => {
      //alert('error RL ' + JSON.stringify(error));
    });
  }

  enableGps: boolean = false;

  verifyGPS() {
    this.diagnostic.isLocationEnabled().then(data => {
      //alert('VG' + JSON.stringify(data));
      if (data){
        this.enableGps = true
        this.makeMap();
      } else {
        this.requestGPS();
      }
    }).catch(error => {
      //alert('error VG ' + JSON.stringify(error));
    });
  }

  requestGPS() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      //alert('RG ' + canRequest);
      if (canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
          this.enableGps = true;
          this.makeMap();
        }).catch(error => {
          //alert('error ELA ' + JSON.stringify(error));
        });
      }
    }).catch(error => {
      //alert('error RG ' + JSON.stringify(error));
    });
  }

  moveCamera() {
    this.map.getMyLocation().then(data => {
      this.map.moveCamera({
        target: data.latLng,
        zoom: 14,
      });
    });
  }

  showError() {
    const alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Revisa tu conexión a internet.',
      buttons: ['OK']
    });
    alert.present();
  }

  get(){
    this.incidenciaPrv.get().subscribe(data => {
      this.addMarkets(data);
    }, error => {
      this.showError();
    });
  }

  private locations: Array<any> = [];

  addMarkets(data: IIncidencia[]){

    for(let d of data){
      this.locations.push({name: d.id, position: {lat: +d.latitud, lng: +d.longitud}});
    }

    this.map.addMarkerCluster({
      markers: this.locations,
      icons: [
        {
          min: 2,
          max: 9,
          url: "./assets/markercluster/small.png",
          label: {
            color: "white"
          }
        },
        {
          min: 10,
          url: "./assets/markercluster/large.png",
          label: {
            color: "white"
          }
        }
      ]
    }).then((markerCluster) => {
      markerCluster.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
        let marker: Marker = params[1];
        let id: number = marker.get("name");
        if (id > 0){
          this.navCtrl.push(FotoPage, { id: id });
        } else{
          marker.setTitle('Foto no disponible');
          marker.showInfoWindow();
        }
      });
    });

  }

  makeMap() {
    this.map = this.googlemaps.create('map_canvas',
      {
        mapType: 'MAP_TYPE_TERRAIN',
        controls: {
          compass: true,
          myLocation: true,
          myLocationButton: true,
          zoom: true
        }
      });

    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.moveCamera();
      this.get();
    });

    this.map.on(GoogleMapsEvent.MY_LOCATION_BUTTON_CLICK).subscribe(() => {
      //this.moveCamera();
    });
  }

}
