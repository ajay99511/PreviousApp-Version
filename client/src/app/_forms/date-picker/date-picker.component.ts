import { NgIf } from '@angular/common';
import { Component, inject, input, Self } from '@angular/core';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [NgIf,ReactiveFormsModule,BsDatepickerModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent implements ControlValueAccessor {
  label = input<string>('');
  maxDate = input<Date>();
  bsConfig?:Partial<BsDatepickerConfig>;
  writeValue(obj: any): void {
   
  }
  registerOnChange(fn: any): void {
    
  }
  registerOnTouched(fn: any): void {

  }
  constructor(@Self() public ngControl : NgControl)
  {
    this.ngControl.valueAccessor = this;
    this.bsConfig = {
      containerClass:'theme-red',
      dateInputFormat: 'DD MMMM YYYY'
    }

  }
  get control():FormControl
  {
    return this.ngControl.control as FormControl
  }

}
