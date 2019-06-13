import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { BackendApiService } from '../../services/backend-api.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [
    trigger('hideForm', [
      state('true', style({
        opacity: 0,
      })),
      state('false', style({
        opacity: 1,
      })),
      transition('*=>true', animate('500ms')),
      transition('*=>false', animate('500ms'))
    ])
  ]
})
export class SignUpComponent implements OnInit {
  form: FormGroup;
  isSubmitConfirmed: boolean = false;
  isSubmitError: boolean = false;

  constructor(private fb: FormBuilder, private backendApiService: BackendApiService) { 
    this.form = this.fb.group({
      email: new FormControl('', { validators: [Validators.compose([Validators.required, Validators.email])], updateOn: 'blur' } ),
      fullname: new FormControl(''),
      phone: new FormControl(''),
    });
  }

  ngOnInit() {
    
  }

  onSubmit() {
    this.form.markAsTouched();
    if (this.form.invalid) { return; }

    let email = this.form.get('email').value;
    let fullName = this.form.get('fullname').value;
    let firstName = 'empty';
    let lastName = 'empty';
    if (fullName) {
      fullName = fullName.toString().split(' ');
      firstName = fullName.length > 1 ? fullName[0] : 'empty';
      lastName = fullName.length > 1 ? fullName[1] : fullName[0];
    }
    let phone = this.form.get('phone').value;
    this.backendApiService.subscribeEmail(email, firstName, lastName, phone).then(
      req => {
        if (req) {
          this.isSubmitConfirmed = req['result'] === 'success';
          this.isSubmitError = !this.isSubmitConfirmed;
        }
      },
      error => { this.isSubmitConfirmed = true; }
    );
  }
}