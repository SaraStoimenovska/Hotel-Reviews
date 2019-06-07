import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink, RouterLinkWithHref } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from '../auth.service';
import { MaterialModule } from '../material/material.module';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const authService = jasmine.createSpyObj('AuthService', ['getUserEmail', 'logout']);
  let linkDe: DebugElement[];
  let linkHrefDe: DebugElement[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
      ],
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    linkDe = fixture.debugElement.queryAll(By.directive(RouterLink));
    linkHrefDe = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
    fixture.detectChanges();
  });

  it('should create header component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a router outlet', () => {
    expect(linkDe).not.toBeNull();
  });

  it('should have a link to dashboard page', () => {
    const index = linkHrefDe.findIndex(
      linkDe => linkDe.properties['href'] === '/dashboard'
    );
    expect(index).toBeGreaterThan(-1);
  });

  it('should have a link to favorites page', () => {
    const index = linkHrefDe.findIndex(
      linkDe => linkDe.properties['href'] === '/favorites'
    );
    expect(index).toBeGreaterThan(-1);
  });

  it('should logout user on click Logout button', () => {
    const logoutSpy: jasmine.Spy = authService.logout.and.returnValue(of({}));
    const de = fixture.debugElement.queryAll(By.css('.mat-button'))[2];
    de.triggerEventHandler('click', null);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(logoutSpy).toHaveBeenCalled();
    });
  });
});
