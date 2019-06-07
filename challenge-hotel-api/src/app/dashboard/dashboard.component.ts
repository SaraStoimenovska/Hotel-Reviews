import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { Observable } from 'rxjs';
import { HotelService } from '../shared/services/hotel.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  hotels$: Observable<any>[];
  loading = false;

  constructor(
    private hotelService: HotelService,
    private notifierService: NotifierService
  ) {}

  ngOnInit() {
    this.loading = false;
  }

  loadHotels() {
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
}
