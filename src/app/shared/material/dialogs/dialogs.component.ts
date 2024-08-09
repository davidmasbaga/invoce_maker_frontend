import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-generic-dialog',
  templateUrl: 'dialogs.component.html',
  styleUrls: ['dialogs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericDialog {
  constructor(
    public dialogRef: MatDialogRef<GenericDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }


}
