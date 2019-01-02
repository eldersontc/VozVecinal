import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { IncidenciaPage } from '../incidencia/incidencia';
import { ComentarioPage } from '../comentario/comentario';
import { AcercaDePage } from '../acerca-de/acerca-de';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-elegir-rol',
  templateUrl: 'elegir-rol.html',
})
export class ElegirRolPage {

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public events: Events) {
  }

  ionViewDidLoad() {}

  ciudadano() {
    this.events.publish('user:setOptions', {
      rol: 'CIUDADANO',
      opciones: [
        { title: 'Basura en la vía pública', component: IncidenciaPage, icon: 'pin' },
        { title: 'Dejar un comentario', component: ComentarioPage, icon: 'chatbubbles' },
        { title: 'Acerca de', component: AcercaDePage, icon: 'information-circle' }
      ]
    });
  }

  autoridad() {
    this.navCtrl.push(LoginPage);
  }

}
