import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Injectable,
  Injector,
  InjectionToken,
  NgModule,
  ErrorHandler,
  enableProdMode
} from '@angular/core';
import { GtagModule } from 'angular-gtag';
import { from } from 'rxjs';

//SERVICES
import { ShopifyService } from './services/shopify.service';
import { ParseService } from './services/parse.service';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { CacheService } from './services/cache.service';
import { BackendApiService } from './services/backend-api.service';
import { ConfigService } from './services/config.service';

//PUBLIC PAGES
import { NoContentComponent } from './pages/404/no-content.component';
import { AboutComponent } from './pages/about/about.component';
import { CollectionPageComponent } from './pages/collection-page/collection-page.component';
import { FaqComponent } from './pages/faq/faq.component';
import { HomeComponent } from './pages/home/home.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { PostEventComponent } from './pages/post-event/post-event-page.component';
import { PrivacyExtComponent } from './pages/privacy-ext/privacy-ext.component';
import { PurchaseComponent } from './pages/purchase/purchase.component';
import { RoutingPageComponent } from './pages/routing-page/routing-page.component';
import { TermsComponent } from './pages/terms/terms.component';

//PUBLIC COMPONENTS
import { FooterComponent } from './components/footer/footer.component';
import { HeroBannerComponent } from './components/hero-banner/hero-banner.component';
import { HeroVideoComponent } from './components/hero-video/hero-video.component';
import { HurryupPopupComponent } from './components/hurryup-popup/hurryup-popup.component';
import { LoaderTransparentComponent } from './components/loader-transparent/loader-transparent.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { MenuComponent } from './components/menu/menu.component';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { ProductGalleryComponent } from './components/product-gallery/product-gallery.component';
import { ProductHeroBannerComponent } from './components/product-hero-banner/product-hero-banner.component';
import { ProductsSectionComponent } from './components/products-section/products-section.component';
import { RatingStarsComponent } from './components/rating-stars/rating-stars.component';
import { SignUpComponent } from './components/signup/signup.component';
import { SliderComponent } from './components/slider/slider.component';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared.module';

if(environment.production) {
  enableProdMode();
}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FooterComponent,
    NoContentComponent,
    HomeComponent,
    AboutComponent,
    TermsComponent,
    HurryupPopupComponent,
    PrivacyExtComponent,
    FaqComponent,
    PurchaseComponent,
    SignUpComponent,
    ProductHeroBannerComponent,
    ListPageComponent,
    MobileMenuComponent,
    CollectionPageComponent,
    RoutingPageComponent,
    MainHeaderComponent,
    PostEventComponent,
    LoaderTransparentComponent,
    ProductGalleryComponent,
    HeroBannerComponent,
    ProductsSectionComponent,
    SliderComponent,
    HeroVideoComponent,
    RatingStarsComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserModule,
    GtagModule.forRoot({ trackingId: environment.ga_identifier, trackPageviews: true }),
    CommonModule,

    SharedModule
  ],
  providers: [
    ShopifyService,
    ParseService, 
    GoogleAnalyticsService,
    CacheService,
    BackendApiService,
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
