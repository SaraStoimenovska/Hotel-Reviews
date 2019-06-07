import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotifierModule } from 'angular-notifier';
import { BehaviorSubject, of } from 'rxjs';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from './material/material.module';

class AuthServiceStub {
  isAuthenticated: BehaviorSubject<boolean>;
  constructor() {
    this.isAuthenticated = new BehaviorSubject(false);
  }
  next(value: boolean) {
    return this.isAuthenticated.next(value);
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const authServiceStub = new AuthServiceStub();
  // const authService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NotifierModule.withConfig({}),
      ],
      declarations: [AppComponent, HeaderComponent],
      providers: [{ provide: AuthServiceStub, useValue: authServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    // fixture.detectChanges();
  });

  it('should create the app', () => {
    spyOn(authServiceStub.isAuthenticated, 'subscribe').and.returnValue(of(true));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });
  });

  it('should set loggedIn to true', () => {
    spyOn(authServiceStub.isAuthenticated, 'subscribe').and.returnValue(of(true));
    const isLoggedInSpy = spyOn(component, 'isLoggedIn').and.returnValue(of(true));
    fixture.detectChanges();
    authServiceStub.isAuthenticated.subscribe(value => {
      fixture.whenStable().then(() => {
        expect(isLoggedInSpy).toBeTruthy();
      });
    });
  });
});
