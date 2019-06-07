import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datePipe',
})
export class DateFormatPipe extends DatePipe implements PipeTransform {
  private dateFormat = 'dd/MM/yyyy';

  transform(value: any, args?: any): any {
    return super.transform(value, this.dateFormat);
  }
}
