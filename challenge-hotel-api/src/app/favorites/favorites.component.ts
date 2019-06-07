import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { HotelService } from '../shared/services/hotel.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  hotels$: Observable<any>[];

  constructor(
    private hotelService: HotelService,
    private notifierService: NotifierService
  ) {}

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.hotelService.getFavoriteHotels().subscribe(
      (response: any) => {
        this.hotels$ = response;
      },
      error => {
        this.notifierService.notify('error', 'Could not load hotels, please try again');
      }
    );
  }
}
