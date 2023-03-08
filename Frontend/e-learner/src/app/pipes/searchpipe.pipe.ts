import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchpipe'
})
export class SearchpipePipe implements PipeTransform {

  transform(items: any[], searchText: any): any[] {
    if (items && searchText) {
      return items.filter(item => {
        let s = '';
        Object.getOwnPropertyNames(item).forEach((i) => {
          s += item[i];
        });
        return s.toLowerCase().includes(searchText.toLowerCase());
      });
    }
    return items;
  }

}
