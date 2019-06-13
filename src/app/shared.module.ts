import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// SHARED MODULES
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// SHARED COMPONENTS
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { StickySignupComponent } from './components/sticky-signup/sticky-signup.component';
import { StickySignupPopupComponent } from './components/sticky-signup-popup/sticky-signup-popup.component';
import { VideoComponent } from './components/video/video.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
    declarations: [
        LoadingSpinnerComponent,
        StickySignupComponent,
        StickySignupPopupComponent,
        VideoComponent,
        ModalComponent
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        LoadingSpinnerComponent,
        StickySignupComponent,
        StickySignupPopupComponent,
        VideoComponent,
        ModalComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule
    ]
})
export class SharedModule { }