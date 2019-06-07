import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Hotel } from '../models/hotel.model';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  constructor(private http: HttpClient, private router: Router) {}

  getAllHotels() {
    return this.http.get(`${environment.apiUrl}/hotel_api/`);
  }

  getHotelReviews(id: number) {
    return this.http.get(`${environment.apiUrl}/hotel_api/get_hotel_reviews/${id}`);
  }

  getHotelDetails(id: number) {
    return this.http.get(`${environment.apiUrl}/hotel_api/${id}`);
  }

  addHotelToFavorite(id: number, isFavorite: boolean) {
    return this.http.post(`${environment.apiUrl}/favorites/add_remove`, {
      hotel_id: `${id}`,
      is_favorite: `${!isFavorite}`,
    });
  }

  saveHotel(hotel: Hotel) {
    return this.http.post(`${environment.apiUrl}/hotel_api/`, hotel);
  }

  getFavoriteHotels() {
    return this.http.get(`${environment.apiUrl}/favorites`);
  }
}
