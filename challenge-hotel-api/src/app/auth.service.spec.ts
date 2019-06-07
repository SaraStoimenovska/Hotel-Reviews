import { HttpClient } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpClientSpy: { get: jasmine.Spy; post: jasmine.Spy };
  let routerSpy: { navigate: jasmine.Spy };

  beforeEach(async(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  }));

  beforeEach(() => {
    authService = TestBed.get(AuthService);
  });

  it('should login successfully and save the user into the localStorage', async(() => {
    let mockResponse = {
      token: '123',
      username: 'username',
      first_name: 'name',
      last_name: 'last_name',
      user_id: '1',
      email: 'test@Test.com',
    };
    httpClientSpy.post.and.returnValue(of(mockResponse));
    authService.login({ username: 'username', password: 'pass' }).subscribe(value => {
      expect(authService.token).toBe(mockResponse.token);
      expect(authService.email).toBe(mockResponse.email);
      expect(authService.id).toBe(mockResponse.user_id);
      expect(authService.isAuthenticated.value).toBeTruthy();
      expect(localStorage.getItem('Token')).toBe(mockResponse.token);
      expect(localStorage.getItem('Email')).toBe(mockResponse.email);
      expect(localStorage.getItem('Id')).toBe(mockResponse.user_id);
    });
  }));

  it('should save token to localStorage', () => {
    spyOn(authService, 'saveToken').and.callThrough();
    authService.saveToken('123');
    expect(localStorage.getItem('Token')).toBe('123');
  });

  it('should get token from localStorage', () => {
    authService.token = undefined;
    spyOn(authService, 'getToken').and.callThrough();

    expect(authService.getToken()).toBe(localStorage.getItem('Token'));
  });

  it('should save user email to localStorage', () => {
    spyOn(authService, 'saveUserEmail').and.callThrough();
    authService.saveUserEmail('email@test.com');
    expect(localStorage.getItem('Email')).toBe('email@test.com');
  });

  it('should get user email from localStorage', () => {
    authService.email = undefined;
    spyOn(authService, 'getUserEmail').and.callThrough();
    expect(authService.getUserEmail()).toBe(localStorage.getItem('Email'));
  });

  it('should save user id to localStorage', () => {
    spyOn(authService, 'saveUserId').and.callThrough();
    authService.saveUserId('1');
    expect(localStorage.getItem('Id')).toBe('1');
  });

  it('should get user id from localStorage', () => {
    authService.id = undefined;
    spyOn(authService, 'getUserId').and.callThrough();
    expect(authService.getUserId()).toBe(parseInt(localStorage.getItem('Id')));
  });

  it('should logout the user and remove him from localStorage', () => {
    routerSpy.navigate.and.callThrough();
    authService.logout();
    expect(localStorage.getItem('Token')).toBeNull();
    expect(localStorage.getItem('Email')).toBeNull();
    expect(localStorage.getItem('Id')).toBeNull();
    expect(authService.token).toBe('');
    expect(authService.email).toBe('');
    expect(authService.id).toBe('');
    expect(authService.isAuthenticated.value).toBeFalsy();
    expect(routerSpy.navigate.calls.first().args[0].toString()).toBe('/login');
  });
});
