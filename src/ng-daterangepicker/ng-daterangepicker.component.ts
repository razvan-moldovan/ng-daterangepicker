import { Component, OnInit, HostListener, ElementRef, forwardRef, Input, OnChanges, SimpleChange } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as dateFns from 'date-fns';

export interface NgDateRangePickerOptions {
  theme: 'default' | 'green' | 'teal' | 'cyan' | 'grape' | 'red' | 'gray' | 'orange';
  range: 'td' | 'ld' | 'lw' | 'tw' | 'tm' | 'lm' | 'ty' | 'ly';
  dayNames: string[];
  presetNames: any;
  dateFormat: string;
  outputFormat: string;
  startOfWeek: number;
  dateSeparator: string;
}

export interface IDay {
  date: Date;
  day: number;
  weekday: number;
  today: boolean;
  firstMonthDay: boolean;
  lastMonthDay: boolean;
  visible: boolean;
  from: boolean;
  to: boolean;
  isWithinRange: boolean;
}

export let DATERANGEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgDateRangePickerComponent),
  multi: true
};

@Component({
  selector: 'ng-daterangepicker',
  templateUrl: 'ng-daterangepicker.component.html',
  styleUrls: ['ng-daterangepicker.sass'],
  providers: [ DATERANGEPICKER_VALUE_ACCESSOR ]
})
export class NgDateRangePickerComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() options: NgDateRangePickerOptions;

  @Input('dateRange') modelValue: string;

  opened: false | 'from' | 'to';
  date: Date;
  dateFrom: Date;
  dateTo: Date;
  dayNames: string[];
  days: IDay[];
  range: 'td' | 'ld' | 'lw' | 'tw' | 'tm' | 'lm' | 'ty' | 'ly';
  defaultOptions: NgDateRangePickerOptions = {
    theme: 'default',
    range: 'tm',
    dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    // presetNames: ['Current Month', 'Previous Month', 'Current Week', 'Previous Week', 'Current Year', 'Previous Year', 'Start', 'End'],
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
    dateSeparator: '-'
  };

  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  constructor(private elementRef: ElementRef) { }

  get value(): string {
    return this.modelValue;
  }

  set value(value: string) {
    if (!value) { return; }
    this.modelValue = value;
    this.onChangeCallback(value);
  }

  writeValue(value: string) {
    if (!value) { return; }
    this.modelValue = value;
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  ngOnInit() {
    this.opened = false;
    this.date = dateFns.startOfDay(new Date());
    this.options = this.options || this.defaultOptions;
    this.initNames();
    this.selectRange(this.options.range);
  }

  ngOnChanges(changes: {[propName: string]: SimpleChange}) {
    this.options = this.options || this.defaultOptions;
    if (changes && changes.hasOwnProperty('modelValue') && changes.modelValue.currentValue) {
      let range = changes.modelValue.currentValue.split(this.options.dateSeparator);
      this.dateFrom = new Date(range[0]);
      this.dateTo = new Date(range[1]);
    }
  }

  initNames(): void {
    this.dayNames = this.options.dayNames;
  }

  generateCalendar(): void {
    this.days = [];
    let start: Date = dateFns.startOfMonth(this.date);
    let end: Date = dateFns.endOfMonth(this.date);

    let days: IDay[] = dateFns.eachDay(start, end).map(d => {
      return {
        date: d,
        day: dateFns.getDate(d),
        weekday: dateFns.getDay(d),
        today: dateFns.isToday(d),
        firstMonthDay: dateFns.isFirstDayOfMonth(d),
        lastMonthDay: dateFns.isLastDayOfMonth(d),
        visible: true,
        from: dateFns.isSameDay(this.dateFrom, d),
        to: dateFns.isSameDay(this.dateTo, d),
        isWithinRange: dateFns.isWithinRange(d, this.dateFrom, this.dateTo)
      };
    });

    let prevMonthDayNum = dateFns.getDay(start) - 1;
    let prevMonthDays: IDay[] = [];
    if (prevMonthDayNum > 0) {
      prevMonthDays = Array.from(Array(prevMonthDayNum).keys()).map(i => {
        let d = dateFns.subDays(start, prevMonthDayNum - i);
        return {
          date: d,
          day: dateFns.getDate(d),
          weekday: dateFns.getDay(d),
          firstMonthDay: dateFns.isFirstDayOfMonth(d),
          lastMonthDay: dateFns.isLastDayOfMonth(d),
          today: false,
          visible: false,
          from: false,
          to: false,
          isWithinRange: false
        };
      });
    }

    this.days = prevMonthDays.concat(days);
    this.value = `${dateFns.format(this.dateFrom, this.options.outputFormat)}${this.options.dateSeparator}${dateFns.format(this.dateTo, this.options.outputFormat)}`;
  }

  toggleCalendar(e: MouseEvent, selection: 'from' | 'to'): void {
    if (this.opened && this.opened !== selection) {
      this.opened = selection;
    } else {
      this.opened = this.opened ? false : selection;
    }
  }

  closeCalendar(e: MouseEvent): void {
    this.opened = false;
  }

  selectDate(e: MouseEvent, index: number): void {
    e.preventDefault();
    let selectedDate: Date = this.days[index].date;
    if ((this.opened === 'from' && dateFns.isAfter(selectedDate, this.dateTo)) ||
      (this.opened === 'to' && dateFns.isBefore(selectedDate, this.dateFrom))) {
      return;
    }

    if (this.opened === 'from') {
      this.dateFrom = selectedDate;
      this.opened = 'to';
    } else if (this.opened === 'to') {
      this.dateTo = selectedDate;
      this.opened = 'from';
    }

    this.generateCalendar();
  }

  prevMonth(): void {
    this.date = dateFns.subMonths(this.date, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.date = dateFns.addMonths(this.date, 1);
    this.generateCalendar();
  }

  selectRange(range: 'td' | 'ld' | 'lw' | 'tw' | 'tm' | 'lm' | 'ty' | 'ly'): void {
    this.range = range;
    let today = dateFns.startOfDay(new Date());
    // set current year, this is overwritten only in 'Last year' selection
    dateFns.setYear(today, today.getFullYear());

    switch (range) {
      case 'td':
        this.date = today;
        this.dateFrom = today;
        this.dateTo = today;
        break;
      case 'ld':
        let yesterday = dateFns.subDays(today, 1);
        this.date = yesterday;
        this.dateFrom = yesterday;
        this.dateTo = yesterday;
        break;
      case 'tw':
        this.date = dateFns.setMonth(today, today.getMonth());
        this.dateFrom = dateFns.startOfWeek(today, {weekStartsOn: this.options.startOfWeek});
        // this.dateTo = dateFns.endOfWeek(today, {weekStartsOn: this.options.startOfWeek});
        this.dateTo = dateFns.endOfDay(today);
        break;
      case 'lw':
        today = dateFns.subWeeks(today, 1);
        this.date = today;
        this.dateFrom = dateFns.startOfWeek(today, {weekStartsOn: this.options.startOfWeek});
        this.dateTo = dateFns.endOfWeek(today, {weekStartsOn: this.options.startOfWeek});
        break;
      case 'tm':
        this.date = dateFns.setMonth(today, today.getMonth());
        this.dateFrom = dateFns.startOfMonth(today);
        // this.dateTo = dateFns.endOfMonth(today);
        this.dateTo = dateFns.endOfDay(today);
        break;
      case 'lm':
        this.date = today = dateFns.subMonths(today, 1);
        this.dateFrom = dateFns.startOfMonth(today);
        this.dateTo = dateFns.endOfMonth(today);
        break;
      case 'ty':
        this.date = dateFns.setYear(today, today.getFullYear());
        this.dateFrom = dateFns.startOfYear(today);
        // this.dateTo = dateFns.endOfYear(today);
        this.dateTo = dateFns.endOfDay(today);
        break;
      case 'ly':
        this.date = today = dateFns.subYears(today, 1);
        this.dateFrom = dateFns.startOfYear(today);
        this.dateTo = dateFns.endOfYear(today);
        break;
      // case 'custom':
      //   this.date = today = dateFns.subYears(today, 1);
      //   this.dateFrom = dateFns.startOfYear(today);
      //   this.dateTo = dateFns.endOfYear(today);
      //   break;
    }
    this.generateCalendar();
  }

  @HostListener('document:click', ['$event'])
  handleBlurClick(e: MouseEvent) {
    let target = e.srcElement || e.target;
    if (!this.elementRef.nativeElement.contains(e.target) && !(<Element>target).classList.contains('day-num')) {
      this.opened = false;
    }
  }
}
