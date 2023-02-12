import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Form } from '@angular/forms';
import { pipe } from 'rxjs/internal/util/pipe';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent {

  constructor(private http: HttpClient){}

  user: any = {
    name: null,
    email: null,
    cep: null,
    numero: null,
    complemento: null,
    rua: null,
    bairro: null,
    cidade: null,
    estado: null
  }


  onSubmit(form: any){
    console.log(form)
    console.log(form.value);

    //
    //
    //
    //
    /*
      Passamos o endereço do servidor
      E a informação enviada para o servidor
      Usamos a biblioteca JSON, que é usada para receber e enviar, recebendo com parse e enviando com stringfy
      Mapeamos a resposta do servidor

      Podemos testar o envio dos dados caso não tenhamos um servidor por meio REST TEST, abaixo temos o exemplo, e agora com esse endpoint recebemos o status 200.
      */
    this.http.post('https://httpbin.org/post', JSON.stringify(form.value))
      .pipe(map(res => res))
      .subscribe(dados => console.log(dados));
  }

  verificaValidTouched(campo: { valid: any; touched: any; }){
    return !campo.valid && campo.touched;
  };

  verificaValidRight(campo: any){
    return campo.valid;
  }

  aplicaCssRight(campo: any){
    return{
      'is-valid': this.verificaValidRight(campo),
      'valid-feedback': this.verificaValidRight(campo)
    }
  }

  aplicaCssErro(campo: any, form: any){
    return {
      'is-invalid': this.verificaValidTouched(campo),
      'invalid-feedback': this.verificaValidTouched(campo)
    };
  };

  buscaCep(cep: any | null, form: any){
    cep = cep.replace(/\D/g, '');

    if (cep != "" || cep.length === 8) {
      const validacep = /^[0-9]{8}$/;

      if(validacep.test(cep)) {
        this.http.get(`//viacep.com.br/ws/${cep}/json/`)
        .pipe(map((dados: any) => dados))
        .subscribe(
          dados => this.populaDadosForm(dados, form)
        );

      }
    }
  }

  populaDadosForm(dados: any, formulario: any){
    formulario.setValue({
      nome: formulario.value.nome,
      email: formulario.value.email,
      endereco: {
        cep: dados.cep,
        numero: '',
        complemento: '',
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    })

    // Funciona da mesma forma, mas precisamos colocar apenas as partes que sofrerão mudança.
    // Não está funcionando corretamente ***
    // formulario.form.pathcValue({
    //   endereco: {
    //     cep: dados.cep,
    //     rua: dados.logradouro,
    //     bairro: dados.bairro,
    //     cidade: dados.localidade,
    //     estado: dados.uf
    //   }
    // })

    console.log(formulario)
  }

  resetaForm(form: any){
    form.setValue({
      nome: form.value.nome,
      email: form.value.email,
      endereco: {
        numero: null,
        complemento: null,
        rua: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    })
  }

}

