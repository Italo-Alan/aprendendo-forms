import { Injectable } from '@angular/core';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { EstadoBr } from '../models/estado-br';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(
    private http: HttpClient
  ) { }

  getEstadosBr(){
    return this.http.get<EstadoBr[]>('assets/dados/estadosbr.json').pipe();
  }

  getTecnologias(){
    return [
      { nome: 'java', desc: 'Java'},
      { nome: 'javascript', desc: 'Javascript'},
      { nome: 'angular', desc: 'Angular'},
      { nome: 'react', desc: 'React'}
    ]
  }

  getNewsletter(){
    return [
      { valor: 's', desc: 'Sim'},
      { valor: 'n', desc: 'Não'},
    ]
  }
}
