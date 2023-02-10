import { Component } from '@angular/core';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent {

  user: any = {
    name: 'Italo',
    email: 'teste@teste.com'
  }


  onSubmit(form: any){
    console.log(form)
    console.log(form.value);
    console.log(this.user);
  }
}
