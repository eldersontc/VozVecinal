import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UsuarioProvider {

  constructor(public http: HttpClient) { }

  private apiURL = 'http://190.234.66.232:88/api/usuario/';

  auth(params: IUsuario): Observable<IUsuario> {
    return this.http.post<IUsuario>(this.apiURL + 'auth/', params);
  }

  get(): Observable<IUsuario[]> {
    return this.http.get<IUsuario[]>(this.apiURL);
  }

  create(params: IUsuario): Observable<boolean> {
    return this.http.post<boolean>(this.apiURL, params);
  }

  update(params: IUsuario): Observable<boolean> {
    return this.http.put<boolean>(this.apiURL + params.id, params);
  }

  delete(params: number): Observable<boolean> {
    return this.http.delete<boolean>(this.apiURL + params);
  }

}

export interface IUsuario {
  id?: number;
  alias?: string;
  password?: string;
  perfil?: string;
}