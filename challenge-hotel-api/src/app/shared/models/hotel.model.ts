import { User } from './user.model';

export interface Hotel {
  id: number;
  name: string;
  city: string;
  country: string;
  image?: string;
  stars: number;
  date?: string;
  description: string;
  price: number;
  likes?: number;
  dislikes?: number;
  user?: User[];
  location: string;
}
