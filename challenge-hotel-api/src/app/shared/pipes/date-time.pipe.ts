import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTimePipe',
})
export class DateTimePipe extends DatePipe implements PipeTransform {
  private dateTimeFormat = 'dd/MM/yyyy HH:mm';
  // "2017-04-13T18:12:46.860839Z

  transform(value: any, args?: any): any {
    value = value.split('.')[0].replace('T', ' ');
    return super.transform(value, this.dateTimeFormat);
  }
}
