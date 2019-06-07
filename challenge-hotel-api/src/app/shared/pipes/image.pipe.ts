import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'imagePipe',
})
export class ImagePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return `${environment.apiUrl}${value}`;
  }
}
