import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { of, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { MaterialModule } from '../material/material.module';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const authService = jasmine.createSpyObj('AuthService', ['login']);
  const router = jasmine.createSpyObj('Router', ['navigate']);
  const notifier = jasmine.createSpyObj('NotifierService', ['notify']);
  let btn: HTMLButtonElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: NotifierService, useValue: notifier },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    btn = fixture.nativeElement.querySelector('button');
    fixture.detectChanges();
  });

  it('should create login component', () => {
    expect(component).toBeTruthy();
  });

  it('should login the user successfully and navigate him to /dashboard', async(() => {
    component.credentials = { username: 'Username', password: '123' };
    fixture.detectChanges();
    const loginSpy: jasmine.Spy = authService.login.and.returnValue(
      of({
        username: 'Username',
        email: 'email@test.com',
      })
    );
    const routerSpy: jasmine.Spy = router.navigate.and.callThrough();
    btn.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(loginSpy).toHaveBeenCalled();
      expect(routerSpy.calls.mostRecent().args[0].toString()).toBe('/dashboard');
    });
  }));

  it('should show error for required fields', async(() => {
    component.credentials = { username: 'Username', password: '' };
    fixture.detectChanges();
    const notifierSpy: jasmine.Spy = notifier.notify.and.callThrough();
    btn.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(notifierSpy).toHaveBeenCalledWith('error', 'All fields required');
    });
  }));

  it('should show error for not existing username/password', async(() => {
    const loginSpy: jasmine.Spy = authService.login.and.returnValue(
      throwError({ error: 'ERROR' })
    );
    const notifierSpy: jasmine.Spy = notifier.notify.and.returnValue({
      error: 'User not found',
    });
    component.credentials = {
      username: 'Username!@#$%',
      password: '123',
    };
    btn.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(loginSpy).toHaveBeenCalled();
      expect(notifierSpy).toHaveBeenCalledWith('error', undefined);
    });
  }));
});
