import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { of, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { MaterialModule } from '../material/material.module';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  const authService = jasmine.createSpyObj('AuthService', ['register']);
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
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: NotifierService, useValue: notifier },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    btn = fixture.nativeElement.querySelector('button');
    fixture.detectChanges();
  });

  it('should create register component', () => {
    expect(component).toBeTruthy();
  });

  it('should register the user successfully and navigate him to /login', async(() => {
    component.credentials = {
      first_name: 'First_name',
      last_name: 'Last_name',
      username: 'Username',
      email: 'email@test.com',
      password: '123',
    };
    fixture.detectChanges();
    const registerSpy: jasmine.Spy = authService.register.and.returnValue(
      of({
        username: 'Username',
        first_name: 'First_name',
        last_name: 'Last_name',
        email: 'email@test.com',
      })
    );
    const routerSpy: jasmine.Spy = router.navigate.and.callThrough();
    btn.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(registerSpy).toHaveBeenCalled();
      expect(routerSpy.calls.mostRecent().args[0].toString()).toBe('/login');
    });
  }));

  it('should show error for required fields', async(() => {
    component.credentials = {
      first_name: '',
      last_name: '',
      username: 'Username',
      email: 'email@test.com',
      password: '123',
    };
    btn.click();
    fixture.detectChanges();
    const notifierSpy: jasmine.Spy = notifier.notify.and.callThrough();
    fixture.whenStable().then(() => {
      expect(notifierSpy).toHaveBeenCalledWith('error', 'All fields required');
    });
  }));

  it('should show error for invalid username format', async(() => {
    const registerSpy: jasmine.Spy = authService.register.and.returnValue(
      throwError({ error: 'ERROR' })
    );
    const notifierSpy: jasmine.Spy = notifier.notify.and.returnValue({
      error: 'Invalid username',
    });
    component.credentials = {
      first_name: 'First_name',
      last_name: 'Last_name',
      username: 'Username!@#$%',
      email: 'email@test.com',
      password: '123',
    };
    btn.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(registerSpy).toHaveBeenCalled();
      expect(notifierSpy).toHaveBeenCalledWith('error', undefined);
    });
  }));
});
