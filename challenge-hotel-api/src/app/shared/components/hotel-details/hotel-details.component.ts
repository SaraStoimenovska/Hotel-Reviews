import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { HotelService } from 'src/app/shared/services/hotel.service';

@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.scss'],
})
export class HotelDetailsComponent implements OnInit {
  hotelDetails$: any;
  allowEdit = false;
  @ViewChild('hotelLatitude') hotelLatitude: ElementRef;
  @ViewChild('hotelLongitude') hotelLongitude: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private notifierService: NotifierService,
    private hotelService: HotelService,
    private router: Router
  ) {}

  ngOnInit() {
    const eventID = this.route.snapshot.params['id'];
    this.loadDetails(eventID);
  }

  loadDetails(id: number) {
    this.hotelService.getHotelDetails(id).subscribe(
      (response: any) => {
        this.hotelDetails$ = response;
      },
      error => {
        this.notifierService.notify(
          'error',
          'Could not load hotel details, please try again'
        );
      }
    );
  }

  convertStringToFloat(value) {
    return parseFloat(value);
  }

  editHotel() {
    this.allowEdit = !this.allowEdit;
  }

  cancel() {
    const eventID = this.route.snapshot.params['id'];
    this.loadDetails(eventID);
    this.allowEdit = !this.allowEdit;
  }

  saveHotel() {
    let lat = this.hotelLatitude.nativeElement.value;
    let lon = this.hotelLongitude.nativeElement.value;

    if (this.hotelDetails$.name === '') {
      this.notifierService.notify('error', 'Hotel name required');
      return;
    }
    if (this.hotelDetails$.city === '') {
      this.notifierService.notify('error', 'City required');
      return;
    }
    if (this.hotelDetails$.country === '') {
      this.notifierService.notify('error', 'Country required');
      return;
    }
    if (this.hotelDetails$.description === '') {
      this.notifierService.notify('error', 'Hotel description required');
      return;
    }
    if (!this.hotelDetails$.price) {
      this.hotelDetails$.price = 0;
    }
    if (!this.hotelDetails$.stars) {
      this.hotelDetails$.stars = 0;
    }
    if (!this.hotelDetails$.likes) {
      this.hotelDetails$.likes = 0;
    }
    if (!this.hotelDetails$.dislikes) {
      this.hotelDetails$.dislikes = 0;
    }
    if (!lat) {
      lat = 1;
      this.hotelLatitude.nativeElement.value = 1;
    }
    if (!lon) {
      lon = 2;
      this.hotelLongitude.nativeElement.value = 2;
    }
    this.hotelDetails$.location = lat.toString() + ',' + lon.toString();

    // had to delete the image because there was error with the backend
    // didn't know in which format it should be
    delete this.hotelDetails$['image'];

    this.hotelService.saveHotel(this.hotelDetails$).subscribe(
      (response: any) => {
        this.hotelDetails$ = response;
        this.editHotel();
        this.addRemoveHotelToFavorite(this.hotelDetails$.id);
        this.router.navigate(['../', this.hotelDetails$.id], { relativeTo: this.route });
        /*
          Strange behavior:
          PUT is not allowed
          when I try to update a record, the response contains new hotel id
          could not find a way to handle it
        */
      },
      error => {
        console.log(error);
        this.notifierService.notify('error', 'Error when updating hotel');
      }
    );
  }

  addRemoveHotelToFavorite(id: number) {
    this.hotelService.addHotelToFavorite(id, true).subscribe();
  }
}
