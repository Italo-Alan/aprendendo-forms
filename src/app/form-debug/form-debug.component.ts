import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-debug',
  templateUrl: './form-debug.component.html',
  styleUrls: ['./form-debug.component.css']
})
export class FormDebugComponent {
  //Input property para passar do formulário para outro componente
  @Input() form: any;
}
