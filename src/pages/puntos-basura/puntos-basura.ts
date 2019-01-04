import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, RadioGroup, Loading, LoadingController, FabContainer } from 'ionic-angular';
import { GoogleMapsEvent, GoogleMaps, GoogleMap, Marker, Poly, Polygon, ILatLng, BaseArrayClass } from '@ionic-native/google-maps';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { IncidenciaProvider, IIncidencia } from '../../providers/incidencia/incidencia';
import { FotoPage } from '../foto/foto';
import { GlobalProvider } from '../../providers/global/global';

@Component({
  selector: 'page-puntos-basura',
  templateUrl: 'puntos-basura.html',
})
export class PuntosBasuraPage {

  map: GoogleMap;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public googlemaps: GoogleMaps,
    public diagnostic: Diagnostic,
    public locationAccuracy: LocationAccuracy,
    public alertCtrl: AlertController,
    public incidenciaPrv: IncidenciaProvider,
    private zone: NgZone,
    public global: GlobalProvider) {
    platform.ready().then(() => {
      this.verifyLocation();
    });
  }

  ionViewDidLoad() { }

  verifyLocation() {
    this.diagnostic.isLocationAuthorized().then((data) => {
      //alert('VL ' + JSON.stringify(data));
      if (data) {
        this.verifyGPS();
      } else {
        this.requestLocation();
      }
    }).catch(error => {
      //alert('error VL ' + JSON.stringify(error));
    });
  }

  requestLocation() {
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
      if (data) {
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

  loading: Loading;

  presentLoading(msg: string) {
    this.loading = this.loadingCtrl.create({
      content: msg
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

  get() {
    this.presentLoading('Cargando...');
    this.incidenciaPrv.get().subscribe(data => {
      this.loading.dismiss();
      this.locations = [];
      for (let d of data) {
        this.locations.push({
          name: d.id,
          position: {
            lat: +d.latitud,
            lng: +d.longitud
          },
          icon: "assets/imgs/basura.png"
        });
      }
      this.addMarkets();
    }, error => {
      this.loading.dismiss();
      this.showError();
    });
  }

  locations: Array<any> = [];

  addMarkets() {

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
        if (!this.makePolygon) {
          let marker: Marker = params[1];
          let id: number = marker.get("name");
          if (id > 0) {
            this.navCtrl.push(FotoPage, { id: id });
          } else {
            marker.setTitle('Foto no disponible');
            marker.showInfoWindow();
          }
        }
      });
    });

  }

  makePolygon = false;

  showOptions() {
    this.makePolygon = !this.makePolygon;
    if (!this.makePolygon) {
      this.cancelPolygon();
      this.addMarkets();
    }
  }

  points: ILatLng[] = []

  polygon: Polygon;

  createPolygon() {
    this.polygon = this.map.addPolygonSync({
      'points': this.points,
      'strokeColor': '#FF0041',
      'fillColor': '#E77B96',
      'strokeWidth': 5
    });
    this.points = [];
  }

  cancelPolygon() {
    this.polygon = undefined;
    this.points = [];
    this.makePolygon = false;
    this.map.clear();
  }

  showConfirm(fab: FabContainer) {
    this.fab = fab;
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

  fab: FabContainer;

  delete() {
    let points: BaseArrayClass<ILatLng> = this.polygon.getPoints();
    let data: IIncidencia[] = [];
    for (let l of this.locations) {
      if (Poly.containsLocation(l.position, points.getArray())) {
        data.push({
          id: this.global.idUsuario,
          latitud: l.position.lat,
          longitud: l.position.lng
        });
      }
    }
    this.presentLoading('Eliminando...');
    this.incidenciaPrv.delete(data).subscribe(() => {
      this.loading.dismiss();
      this.fab.close();
      this.cancelPolygon();
      this.get();
    }, error => {
      this.loading.dismiss();
      this.showError();
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

    this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((params) => {
      if (this.makePolygon && !this.polygon) {
        this.zone.run(() => {
          this.points.push(params[0]);
        });
        var idx = this.points.length - 1;
        let marker: Marker = this.map.addMarkerSync({
          icon: "assets/imgs/pin.png",
          animation: 'DROP',
          position: params[0],
          draggable: true
        });
        marker.on(GoogleMapsEvent.MARKER_DRAG).subscribe((params) => {
          if (this.polygon) {
            let points: BaseArrayClass<ILatLng> = this.polygon.getPoints();
            points.setAt(idx, params[0]);
          } else {
            this.points[idx] = params[0];
          }
        });
      }
    });
  }

}
