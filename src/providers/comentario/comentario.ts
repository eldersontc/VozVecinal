import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ComentarioProvider {

  constructor(public http: HttpClient) {}

  private apiURL = 'https://190.234.66.232:88/api/comentario';

  create(params: IComentario): Observable<boolean> {
      return this.http.post<boolean>(this.apiURL, params);
  }

}

export interface IComentario {
  id?: number;
  descripcion?: string;
  calificacion?: number;
  fabricante?: string;
  modelo?: string;
  plataforma?: string;
  version?: string;
  serial?: string;
  UUID?: string;
}