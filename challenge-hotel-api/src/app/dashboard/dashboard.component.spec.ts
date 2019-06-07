import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { empty, of, throwError } from 'rxjs';
import { MaterialModule } from '../material/material.module';
import { HotelComponent } from '../shared/components/hotel/hotel.component';
import { DateTimePipe } from '../shared/pipes/date-time.pipe';
import { DateFormatPipe } from '../shared/pipes/date.pipe';
import { HotelService } from '../shared/services/hotel.service';
import { DashboardComponent } from './dashboard.component';

const hotels = [
  {
    id: 79,
    name: 'Hotel Stone Bridge',
    city: 'Skopje',
    country: 'Macedonia',
    image: '/media/images/no-img.jpg',
    stars: 5,
    date: '2019-04-16 16:21:03',
    description:
      'To feel and experience the city in a special and unique way is exclusive offer only by the Hotel Stone Bridge. If people say that the city of Skopje have always represented a crossroad on the Balkans, a place where many nations and cultures meet and mingled, a place where the traditions and the customs had been and are still treasured, a place of trade and production and a place that offered the world grand cultural and historical heritage.',
    price: 80,
    likes: 0,
    dislikes: 0,
    user: [81],
    location: '41.9973512,21.4344979',
  },
];

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  const hotelService = jasmine.createSpyObj('hotelService', ['getAllHotels']);
  const router = jasmine.createSpyObj('Router', ['navigate']);
  const notifier = jasmine.createSpyObj('NotifierService', ['notify']);
  let getHotelsSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      declarations: [DashboardComponent, HotelComponent, DateTimePipe, DateFormatPipe],
      providers: [
        { provide: HotelService, useValue: hotelService },
        { provide: Router, useValue: router },
        { provide: NotifierService, useValue: notifier },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    getHotelsSpy = hotelService.getAllHotels.and.returnValue(empty());
    fixture.detectChanges();
  });

  it('should create dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should get all hotels', () => {
    getHotelsSpy = hotelService.getAllHotels.and.returnValue(of(hotels));
    component.loadHotels();
    fixture.whenStable().then(() => {
      expect(getHotelsSpy).toHaveBeenCalled();
    });
  });

  it('should show error on getting all hotels', () => {
    getHotelsSpy = hotelService.getAllHotels.and.returnValue(
      throwError({ error: 'ERROR' })
    );
    const notifierSpy: jasmine.Spy = notifier.notify.and.callThrough();
    component.loadHotels();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(getHotelsSpy).toHaveBeenCalled();
      expect(notifierSpy).toHaveBeenCalledWith(
        'error',
        'Could not load hotels, please try again'
      );
    });
  });
});
