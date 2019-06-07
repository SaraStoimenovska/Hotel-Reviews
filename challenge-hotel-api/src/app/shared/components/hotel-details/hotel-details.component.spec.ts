import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthService } from 'src/app/auth.service';
import { MaterialModule } from 'src/app/material/material.module';
import { DateTimePipe } from '../../pipes/date-time.pipe';
import { DateFormatPipe } from '../../pipes/date.pipe';
import { HotelDetailsComponent } from './hotel-details.component';

export class ActivatedRouteStub {
  private snapshot = {
    params: {
      id: '',
    },
  };
}

describe('HotelDetailsComponent', () => {
  let component: HotelDetailsComponent;
  let fixture: ComponentFixture<HotelDetailsComponent>;
  const authService = jasmine.createSpyObj('AuthService', ['register']);
  const router = jasmine.createSpyObj('Router', ['navigate']);
  const notifier = jasmine.createSpyObj('NotifierService', ['notify']);
  // const activatedRoute = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
  const mockActivatedRoute = new ActivatedRouteStub();
  let btn: HTMLButtonElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        AgmCoreModule,
      ],
      declarations: [HotelDetailsComponent, DateFormatPipe, DateTimePipe],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: NotifierService, useValue: notifier },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create hotel details component', () => {
    expect(component).toBeTruthy();
  });

  it('should allow editing hotel', () => {
    component.allowEdit = false;
    spyOn(component, 'editHotel').and.callThrough();
    component.editHotel();
    fixture.whenStable().then(() => {
      expect(component.allowEdit).toBeTruthy();
    });
  });

  it('should add hotel', () => {
    component.allowEdit = false;
    spyOn(component, 'editHotel').and.callThrough();
    component.editHotel();
    fixture.whenStable().then(() => {
      expect(component.allowEdit).toBeTruthy();
    });
  });
});
