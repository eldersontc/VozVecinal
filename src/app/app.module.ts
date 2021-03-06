import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { GoogleMaps } from '@ionic-native/google-maps';
import { Camera } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { HttpClientModule } from '@angular/common/http';

import { ComentarioPage } from '../pages/comentario/comentario';
import { AcercaDePage } from '../pages/acerca-de/acerca-de';
import { IncidenciaProvider } from '../providers/incidencia/incidencia';
import { ComentarioProvider } from '../providers/comentario/comentario';
import { UsuarioProvider } from '../providers/usuario/usuario';
import { UsuarioPage } from '../pages/usuario/usuario';
import { PuntosBasuraPage } from '../pages/puntos-basura/puntos-basura';
import { ElegirRolPage } from '../pages/elegir-rol/elegir-rol';
import { LoginPage } from '../pages/login/login';
import { GlobalProvider } from '../providers/global/global';
import { ReportarBasuraPage } from '../pages/reportar-basura/reportar-basura';
import { UsuarioDetallePage } from '../pages/usuario-detalle/usuario-detalle';
import { FotoBasuraPage } from '../pages/foto-basura/foto-basura';
import { MasComentadoPage } from '../pages/mas-comentado/mas-comentado';

@NgModule({
  declarations: [
    MyApp,
    ReportarBasuraPage,
    ComentarioPage,
    AcercaDePage,
    UsuarioDetallePage,
    UsuarioPage,
    FotoBasuraPage,
    PuntosBasuraPage,
    ElegirRolPage,
    LoginPage,
    MasComentadoPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ReportarBasuraPage,
    ComentarioPage,
    AcercaDePage,
    UsuarioDetallePage,
    UsuarioPage,
    FotoBasuraPage,
    PuntosBasuraPage,
    ElegirRolPage,
    LoginPage,
    MasComentadoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Camera,
    Device,
    Diagnostic,
    LocationAccuracy,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    IncidenciaProvider,
    ComentarioProvider,
    UsuarioProvider,
    GlobalProvider
  ]
})
export class AppModule {}
