import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { MaterialModule } from 'src/app/material/material.module';
import { DateTimePipe } from '../../pipes/date-time.pipe';
import { DateFormatPipe } from '../../pipes/date.pipe';
import { HotelDetailsComponent } from '../hotel-details/hotel-details.component';
import { HotelComponent } from './hotel.component';

const hotelReviews = [
  {
    id: 2,
    message:
      '“Massive room and extremely comfortable. Location perfect, right beside the old town and all the nightlife. Free parking just a minute walk away.”',
    created_at: '2017-04-13T18:10:56.240421Z',
    likes: 3,
    dislikes: 0,
    positive: true,
    author: {
      id: 1,
      first_name: 'Marko',
      last_name: 'Kovacina',
    },
  },
];

const mockHotelService = {
  getHotelReviews(id: number): Observable<any> {
    return of(hotelReviews);
  },
};

describe('HotelComponent', () => {
  let component: HotelComponent;
  let fixture: ComponentFixture<HotelComponent>;
  const hotelService = jasmine.createSpyObj('hotelService', [
    'getAllHotels',
    'getHotelReviews',
    'getHotelDetails',
    'addHotelToFavorite',
    'saveHotel',
    'getFavoriteHotels',
  ]);
  const authService = jasmine.createSpyObj('AuthService', ['register']);
  const router = jasmine.createSpyObj('Router', ['navigate']);
  const notifier = jasmine.createSpyObj('NotifierService', ['notify']);

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
      declarations: [HotelDetailsComponent, HotelComponent, DateFormatPipe, DateTimePipe],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: NotifierService, useValue: notifier },
        { provide: hotelService, useValue: mockHotelService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelComponent);
    component = fixture.componentInstance;
    // httpTestingController = TestBed.get(HttpTestingController);
    // fixture.detectChanges();
  });

  it('should create hotel component', () => {
    expect(component).toBeTruthy();
  });

  it('should load all hotels', () => {
    const routerSpy: jasmine.Spy = router.navigate(['/dashboard']);
    component.loadAllHotels();
    fixture.whenStable().then(() => {
      expect(routerSpy).toHaveBeenCalled();
    });
  });

  it('Get Hotel Reviews for hotel with id 2', () => {
    const getReviewsSpy: jasmine.Spy = hotelService.getHotelReviews(2);
    component.showReviews(2);
    // fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(getReviewsSpy).toHaveBeenCalled();
      expect(getReviewsSpy).toHaveBeenCalledWith(of(hotelReviews));
    });
  });
});
