import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent {
  [x: string]: any;
  formulario!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient
  ){}

  ngOnInit(){
    /*Forma mais verbosa de se criar um formulário
    this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null)
    });
    */

    this.formulario = this.formBuilder.group({
      nome: [null, [
        Validators.required,
        Validators.minLength(3)
      ]],
      email: [null, [
        Validators.required,
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
      ]],
      cep: [null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8)
      ]],
      comple: [null, [
        Validators.required,
        Validators.minLength(4)
      ]],
      numero: [null, [Validators.required]],
      rua: [null, Validators.required],
      bairro: [null, Validators.required],
      cidade: [null, Validators.required],
      estado: [null, Validators.required]
    })
  }

  onSubmit(){
    console.log(this.formulario)
    console.log(this.formulario.value);

    if(this.formulario.valid){
      this.http.post('https://httpbin.org/post',
        JSON.stringify(this.formulario.value))
      .pipe(map(res => res))
      .subscribe(dados => {
        console.log(dados)
        console.log(this.formulario)
        this.resetForm();
      },
      (error: any) => alert(`erro: ${error}`));
    }else{
      this.verificaValidacaoForm(this.formulario);
    }
  }

  buscaCep(){
    let cep = this.formulario.get('cep')?.value;
    cep = cep.replace(/\D/g, '');

    if (cep != "" || cep.length === 8) {
      const validacep = /^[0-9]{8}$/;

      if(validacep.test(cep)) {
        this.http.get(`//viacep.com.br/ws/${cep}/json/`)
        .pipe(map((dados: any) => dados))
        .subscribe(
          dados => {
            console.log(dados)
            this.populaDadosForm(dados)
          }
        );
      }
    }
  }

  verificaValidacaoForm(formGroup: FormGroup){
    Object.keys(this.formulario.controls).forEach( (campo) => {
      console.log(campo);

      const controle = this.formulario.get(campo);
      controle?.markAllAsTouched();
      //Até aqui se o formulário não tiver agrupamento até esse trecho é o suficiente.

      //Nesse trecho aqui verificamos se caso tenha algum aninhamento no form para também fazer a validação dos campos
      if(controle instanceof FormGroup){
        this.verificaValidacaoForm(controle);
      }
    });
  }

  populaDadosForm(dados: { logradouro: any; complemento: any; bairro: any; localidade: any; uf: any; }){
    this.formulario.patchValue({
      rua: dados.logradouro,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf
    })

    //Se quisermos trocar algum dos campos após a pesquisa podemos fazer nesse ponto do código
      // this.formulario.get('nome')?.setValue('Qualquer nome');
  }

  resetForm(){
    this.formulario.reset();
  }

  verificaValidTouched(campo: string){
    return !this.formulario.controls[campo].valid && this.formulario.controls[campo].touched;
  }



  aplicaCssErro(campo: string){
    return {
      'has-error': this.verificaValidTouched(campo),
      'is-invalid': this.verificaValidTouched(campo)
    }
  }


  /* Lógica para validar o campo com valid
  verificaValidTouchedTrue(campo: string){
    return this.formulario.controls[campo].valid && this.formulario.controls[campo].touched;
  }

  aplicaCss(campo: string){
    return {
      // 'has-error': this.verificaValidTouchedTrue(campo),
      'is-valid': this.verificaValidTouchedTrue(campo)
    }
  }
  */
}
