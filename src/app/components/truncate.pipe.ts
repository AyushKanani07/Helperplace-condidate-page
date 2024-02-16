import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
//   transform(value: string, words: number): string {
//     if (!value) return '';

//     const wordArray = value.split(' ');
//     if (wordArray.length > words) {
//       return wordArray.slice(0, words).join(' ') + '...';
//     } else {
//       return value;
//     }
//   }

  transform(value: string, maxLength: number): string {
    if (!value) return '';

    if (value.length > maxLength) {
      return value.substring(0, maxLength) + '...';
    } else {
      return value;
    }
  }
}