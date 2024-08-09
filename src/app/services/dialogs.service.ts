import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GenericDialog } from '../shared/material/dialogs/dialogs.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(data: any, config?: any): MatDialogRef<GenericDialog> {
    return this.dialog.open(GenericDialog, {
      width: '250px',
      data,
      ...config,
    });
  }
}
