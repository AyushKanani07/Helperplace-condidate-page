import { NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {MatRadioModule} from '@angular/material/radio';
import { TruncatePipe } from '../components/truncate.pipe';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSliderModule} from '@angular/material/slider';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';





@NgModule({
  declarations: [],
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatSnackBarModule, MatMenuModule, MatFormFieldModule, MatSliderModule, MatInputModule, MatButtonModule, MatIconModule, MatNativeDateModule, MatDatepickerModule, MatCardModule, MatSelectModule, MatDividerModule, MatRadioModule, NgFor, TruncatePipe
  ],
  exports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatSnackBarModule, MatMenuModule, MatFormFieldModule, MatSliderModule, MatInputModule, MatButtonModule, MatIconModule, MatNativeDateModule, MatDatepickerModule, MatCardModule, MatSelectModule, MatDividerModule, MatRadioModule, NgFor, TruncatePipe
  ]
})
export class SharedModule { }
