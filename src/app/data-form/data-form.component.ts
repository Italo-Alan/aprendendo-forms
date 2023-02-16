import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DropdownService } from './../shared/services/dropdown.service';
import { EstadoBr } from '../shared/models/estado-br';


@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent {
  [x: string]: any;
  formulario!: FormGroup;
  estados!: EstadoBr[];
  // estados!: Observable<EstadoBr>;
  tecnologias!: any[];
  newsletterOpcoes!: any[];
  termos!: any[];

  frameworks = ['HTML', 'CSS', 'PHP', 'C', 'C#', 'C++', 'Java', 'Javascript', 'Angular', 'React'];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService
  ){}

  ngOnInit(){
    /*Forma mais verbosa de se criar um formulário
    this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null)
    });
    */

    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsletterOpcoes = this.dropdownService.getNewsletter();

    this.dropdownService.getEstadosBr()
    .subscribe((dados: EstadoBr[]) => {
      console.log(dados)
      this.estados = dados;
    });

    // this.estados = this.dropDownService.getEstadosBr().pipe(map((resp: any) => resp));


    this.formulario = this.formBuilder.group({
      nome: [null, [
        Validators.required,
        Validators.minLength(3)
      ]],
      email: [null, [
        Validators.required,
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
      ]],
      confirmarEmail: [null, [this.equalsTo('email')]],
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
      estado: [null, Validators.required],
      tecnologias: [null, Validators.required],
      newsletter: [null, Validators.required],
      //Podemos usar o Validators.pattern para validar checkbos
      // termos: [null, Validators.pattern('true')]
      termos: [null, Validators.requiredTrue],
      frameworks: this.buildFrameworks()
    })
  }

  equalsTo(outroCampo: string){
    const validator = (formControl: FormControl | any) => {
      if(outroCampo == null){
        throw new Error('É necessário informar um campo.');
      }

      if(!formControl.root || !(<FormGroup>formControl.root).controls){
        return null;
      }

      const campo = (<FormGroup>formControl.root).get(outroCampo);

      if(!campo){
        throw new Error('É necessário informar um campo válido.');
      }

      if(campo.value !== formControl.value){
        return { equalsTo: outroCampo};
      }

      return null;
    }
    return validator;
  }

  buildFrameworks(){
    const values = this.frameworks.map( valor => new FormControl(false));
    return this.formBuilder.array(values, this.requiredMinCheckbox(1));

    // this.formBiulder.array([
    //   new FormControl(false),
    //   new FormControl(false),
    //   new FormControl(false),
    //   new FormControl(false)
    // ]
    // )
    // return
  }

  requiredMinCheckbox( min = 1 ){
    const validator = (formArray: FormArray | any) => {
      // const values =  formArray.controls;
      // let totalChecked = 0;
      // for(let i = 0; i<values.length; i++){
      //   if( values [i].value){
      //     totalChecked += 1;
      //   }
      // }
      const totalChecked = formArray.controls
        .map( (v: { value: any; }) => v.value)
        .reduce((total : number, atual : number) => atual ? total + atual : total, 0);
      return totalChecked >= min ? null : { required: true};
    };

    return validator;
  }

  onSubmit(){
    console.log(this.formulario)
    console.log(this.formulario.value);

    let valueSubmit = Object.assign({}, this.formulario.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
      .map((v: any, i: number) => v ? this.frameworks[i] : null)
        .filter((v: null) => v == true)
    })

    if(this.formulario.valid){
      this.http.post('https://httpbin.org/post',
        JSON.stringify(valueSubmit))
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
