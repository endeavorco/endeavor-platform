import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FooterComponent } from './footer.component';
import { BackendApiService } from '../../services/backend-api.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BackendApiServiceMock } from '../../mocks/services/backend-api-service-mock';

describe('FooterComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule, 
        FormsModule
      ],
      declarations: [
        FooterComponent
      ],
      providers: [{ provide: BackendApiService, useClass: BackendApiServiceMock }]
    });
  });
  it(`formSubmitted = true when submit and form valid`, () => {
    const fixture = TestBed.createComponent(FooterComponent).componentInstance;
    fixture.form.controls['email'].setValue('email@gmail.com');
    fixture.onSubmit();
    expect(fixture.formSubmitted).toEqual(true);
  });
  it(`formSubmitted = true when submit and form invalid`, () => {
    const fixture = TestBed.createComponent(FooterComponent).componentInstance;
    fixture.onSubmit();
    expect(fixture.formSubmitted).toEqual(true);
  });
  it(`isSubmitConfirmed = true when submit and form valid`, () => {
    const fixture = TestBed.createComponent(FooterComponent).componentInstance;
    fixture.form.controls['email'].setValue('email@gmail.com');
    fixture.onSubmit();
    expect(fixture.isSubmitConfirmed).toEqual(true);
  });
  it(`isSubmitConfirmed = false when submit and form invalid`, () => {
    const fixture = TestBed.createComponent(FooterComponent).componentInstance;
    fixture.onSubmit();
    expect(fixture.isSubmitConfirmed).toEqual(false);
  });
  it(`backend subscribeEmail not called when submit and form invalid`, () => {
    const fixture = TestBed.createComponent(FooterComponent);
    let fixtureInstance = fixture.componentInstance;
    let backendApiService = fixture.debugElement.injector.get(BackendApiService);
    let spy = spyOn(backendApiService, 'subscribeEmail').and.callThrough();
    fixtureInstance.onSubmit();
    expect(spy).not.toHaveBeenCalled();
  });
  it(`backend subscribeEmail called when submit and form valid`, () => {
    const fixture = TestBed.createComponent(FooterComponent);
    let fixtureInstance = fixture.componentInstance;
    let backendApiService = fixture.debugElement.injector.get(BackendApiService);
    fixtureInstance.form.controls['email'].setValue('email@gmail.com');
    let spy = spyOn(backendApiService, 'subscribeEmail').and.callThrough();
    fixtureInstance.onSubmit();
    expect(spy).toHaveBeenCalled();
  });
});
