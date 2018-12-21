import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IncidenciaProvider {

  constructor(public http: HttpClient) {}

  private apiURL = 'https://190.234.66.232:88/api/incidencia';

  create(params: IIncidencia): Observable<boolean> {
      return this.http.post<boolean>(this.apiURL, params);
  }

}

export interface IIncidencia {
  id?: number;
  fechaHora?: Date;
  latitud?: number;
  longitud?: number;
  base64?: string;
  foto?: boolean;
  fabricante?: string;
  modelo?: string;
  plataforma?: string;
  version?: string;
  serial?: string;
  UUID?: string;
}