import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { environment } from 'src/environments/environment';
import { ImagePipe } from '../../pipes/image.pipe';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss'],
  providers: [ImagePipe],
})
export class HotelComponent implements OnInit {
  @Input() hotels$: Observable<any>[];
  reviews$: Observable<any>[];
  loading = false;
  loadReviews = false;

  constructor(
    private hotelService: HotelService,
    private notifierService: NotifierService,
    private router: Router,
    private authService: AuthService,
    private imagePipe: ImagePipe
  ) {}

  ngOnInit() {
    this.loading = false;
    this.loadReviews = false;
    if (this.router.url === '/dashboard') {
      this.loadAllHotels();
    } else {
      this.loadFavoriteHotels();
    }
  }

  loadAllHotels() {
    this.loading = true;
    this.hotelService.getAllHotels().subscribe(
      (response: any) => {
        this.hotels$ = response;
      },
      error => {
        this.notifierService.notify('error', 'Could not load hotels, please try again');
      }
    );
  }

  loadFavoriteHotels() {
    this.hotelService.getFavoriteHotels().subscribe(
      (response: any) => {
        this.hotels$ = response;
      },
      error => {
        this.notifierService.notify(
          'error',
          'Could not load favorite hotels, please try again'
        );
      }
    );
  }

  showReviews(id: number) {
    this.hotelService.getHotelReviews(id).subscribe(
      (response: any) => {
        this.reviews$ = response;
        if (this.reviews$.length > 0) {
          this.loadReviews = true;
        }
      },
      error => {
        this.notifierService.notify('error', 'Could not load reviews, please try again');
      }
    );
  }

  onNavigate(id: number) {
    if (this.router.url === '/dashboard') {
      window.open(this.router.url + '/' + id, '_blank', 'width=500,height=600');
    } else {
      window.open(this.router.url + '/' + id, '_blank');
    }
  }

  addRemoveHotelToFavorite(id: number, isFavorite: boolean) {
    this.hotelService.addHotelToFavorite(id, isFavorite).subscribe(
      (response: any) => {
        isFavorite
          ? this.notifierService.notify('warning', 'Removed from favorite')
          : this.notifierService.notify('success', 'Added to favorite');
        if (this.router.url === '/dashboard') {
          this.loadAllHotels();
        } else {
          this.loadFavoriteHotels();
        }
      },
      error => {
        this.notifierService.notify('error', 'Could not add/remove to/from favorite');
      }
    );
  }

  getImage(imageScr: string) {
    if (imageScr.includes(environment.apiUrl)) {
      return imageScr;
    } else {
      return this.imagePipe.transform(imageScr);
    }
  }
}
