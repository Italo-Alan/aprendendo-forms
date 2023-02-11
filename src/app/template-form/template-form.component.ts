import { Component } from '@angular/core';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent {

  user: any = {
    name: 'Italo',
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
    console.log(this.user);
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

  aplicaCssErro(campo: any){
    return {
      'is-invalid': this.verificaValidTouched(campo),
      'invalid-feedback': this.verificaValidTouched(campo)
    };
  };
}
