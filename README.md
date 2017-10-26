Angular DateRange Picker
---

This date range picker was heavily inspired by PayPal's datepicker as seen on website.

Demo: http://ng-daterangepicker.jankuri.com

### Installation

```sh
npm install ng-daterangepicker --save
```

or

```sh
yarn add ng-daterangepicker --save
```

### Example

```ts
import { NgDateRangePickerModule } from 'ng-daterangepicker';

// app.module.ts
@NgModule({
  ...
  imports: [ ..., NgDateRangePickerModule, ... ],
  ...
})
export class AppModule { }
```

```ts
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { NgDateRangePickerOptions } from 'ng-daterangepicker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  options: NgDateRangePickerOptions;

  ngOnInit() {
    this.options = {
	  theme: 'default',
	  range: 'tm',
	  dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
	  presetNames: {
          thisDay: 'Today',
          lastDay: 'Yesterday',
          thisWeek: 'This Week',
          lastWeek: 'Last Week',
          thisMonth: 'This Month',
          lastMonth: 'Last Month',
          thisYear: 'This Year',
          lastYear: 'Last Year',
          from: 'Start',
          to: 'End'
         },
	  dateFormat: 'yMd',
	  outputFormat: 'DD/MM/YYYY',
	  startOfWeek: 1,
	  dateSeparator: '_',
	};
  }
}
```

```html
<!-- app.component.html -->
<ng-daterangepicker [(ngModel)]="value" [options]="options"></ng-daterangepicker>
```

### Configuration

```ts
export interface NgDateRangePickerOptions {
  theme: 'default' | 'green' | 'teal' | 'cyan' | 'grape' | 'red' | 'gray' | 'orange';
  range: 'td' | 'ld' | 'lw' | 'tw' | 'tm' | 'lm' | 'ty' | 'ly';
  dayNames: string[];
  presetNames: string[];
  dateFormat: string;
  outputFormat: string;
  startOfWeek: number;
  dateSeparator: string;
}
```

### Running the demo

```sh
git clone https://github.com/jkuri/ng-daterangepicker.git --depth 1
cd ng-daterangepicker
npm start
```

### Licence

MIT
