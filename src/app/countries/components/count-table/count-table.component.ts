import { Component, Input } from '@angular/core';
import { Country } from '../../interfaces/country';

@Component({
  selector: 'countries-count-table',
  templateUrl: './count-table.component.html',
  styles: [
    `
    img{
      width: 35px
    }
    `
  ]
})
export class CountTableComponent {

  @Input()
  public countries: Country[] = []

}
