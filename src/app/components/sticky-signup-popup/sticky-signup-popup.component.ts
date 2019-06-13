import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SubscribeBusService } from '../../state.management/subscribeBus';
import { BackendApiService } from '../../services/backend-api.service';

@Component({
  selector: 'app-sticky-signup-popup',
  templateUrl: './sticky-signup-popup.component.html',
  styleUrls: ['./sticky-signup-popup.component.scss']
})
export class StickySignupPopupComponent implements OnInit {

  signUpForm;
  isOpen: boolean = false;
  formSubmitted: boolean = false;
  showEmailLabel: boolean = true;
  showNamelLabel: boolean = true;
  isBottomReached: boolean = false;

  constructor(
    private fb: FormBuilder,
    private backendApiService: BackendApiService,
    private subscribeBusService: SubscribeBusService
  ) { }

  ngOnInit() {
    this.signUpForm = this.fb.group({
      email: new FormControl('', { validators: [Validators.compose([Validators.required, Validators.email])], updateOn: 'blur' }),
      name: new FormControl('', { validators: [Validators.compose([Validators.required])], updateOn: 'blur' }),
    });
    
    this.signUpForm.controls['email'].valueChanges.subscribe(
      (selectedValue) => {
        selectedValue.length > 0 ? this.showEmailLabel = false : this.showEmailLabel = true;
      }
    );
    this.signUpForm.controls['name'].valueChanges.subscribe(
      (selectedValue) => {
        selectedValue.length > 0 ? this.showNamelLabel = false : this.showNamelLabel = true;
      }
    );

    this.subscribeBusService.openSignUpPopup.subscribe((item) => {
      this.isOpen = item.isSignupOpen;
      this.isBottomReached = item.isBottomReached;
    });
  }

  hidePopup(){
    this.subscribeBusService.openSignUpPopup.next({ isSignupOpen: false, isBottomReached: false });
  }

  onSubmit() {
    this.formSubmitted = true;
    // this.backendApiService.subscribeEmail(
    //   this.signUpForm.controls['email'].value,
    //   this.signUpForm.controls['name'].value
    //   ).then(
    //   req => {
    //     if (req) {
    //       console.log('signup successful');
    //     }
    //   },
    //   error => {
    //     console.log('signup err');
    //   }
    // );
  }

}
