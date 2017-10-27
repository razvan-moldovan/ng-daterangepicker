import { Component, OnInit } from '@angular/core';
import { NgDateRangePickerOptions } from '../ng-daterangepicker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit  {
  value: string;
  options: NgDateRangePickerOptions;

  ngOnInit() {
    this.options = {
      theme: 'default',
      range: 'tw',
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
      startOfWeek: 0,
      dateSeparator: '_'
    };
  }
}
