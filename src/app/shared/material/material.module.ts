import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIcon, MatIconModule} from '@angular/material/icon'
import {MatTabsModule} from '@angular/material/tabs';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSnackBarModule } from '@angular/material/snack-bar';
import { GenericDialog } from './dialogs/dialogs.component';




@NgModule({
  declarations: [
      GenericDialog
    ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    MatBadgeModule,
    MatSnackBarModule
  ],
  exports: [MatIconModule, MatTabsModule, MatBadgeModule, MatSnackBarModule, GenericDialog]
})
export class MaterialModule { }
