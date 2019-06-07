import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth-interceptor';
import { AuthService } from './auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material/material.module';
import { RegisterComponent } from './register/register.component';
import { HotelDetailsComponent } from './shared/components/hotel-details/hotel-details.component';
import { DateTimePipe } from './shared/pipes/date-time.pipe';
import { DateFormatPipe } from './shared/pipes/date.pipe';
import { ImagePipe } from './shared/pipes/image.pipe';
import { HotelService } from './shared/services/hotel.service';
import { HotelComponent } from './shared/components/hotel/hotel.component';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: { position: 'middle', distance: 12 },
    vertical: { position: 'top', distance: 12, gap: 10 },
  },
  theme: 'material',
  behaviour: {
    autoHide: 3000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4,
  },
  animations: {
    enabled: true,
    show: { preset: 'slide', speed: 300, easing: 'ease' },
    hide: { preset: 'fade', speed: 300, easing: 'ease', offset: 50 },
    shift: { speed: 300, easing: 'ease' },
    overlap: 150,
  },
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    HeaderComponent,
    FavoritesComponent,
    DateTimePipe,
    DateFormatPipe,
    HotelDetailsComponent,
    ImagePipe,
    HotelComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    NotifierModule.withConfig(customNotifierOptions),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD8yUPHwmnLEoiwew4fcBohSJBYXpSrwc8',
    }),
  ],
  providers: [
    AuthService,
    HotelService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
