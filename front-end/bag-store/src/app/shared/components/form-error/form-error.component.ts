import { Component, Input, input, OnInit } from '@angular/core';
import { SHARED_MODULES } from '../../shared';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss'],
  imports: [...SHARED_MODULES],
})
export class FormErrorComponent implements OnInit {
  // Pass the FieldTree node (e.g., personalInfoForm.dateOfBirth)
  fieldRef = input.required<any>();
  constructor() {}

  ngOnInit() {}
}
