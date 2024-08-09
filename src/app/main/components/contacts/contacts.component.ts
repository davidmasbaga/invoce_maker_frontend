import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ContactDataService } from '../../../services/contact-data.service';
import { DialogService } from '../../../services/dialogs.service';
import { MatDialogRef } from '@angular/material/dialog'; // Import MatDialogRef
import { Subject, take, takeUntil } from 'rxjs';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent implements OnInit, OnDestroy {
  contacts: any[] = [];
  dataLoaded: boolean = false;

private destroy$: Subject<void> = new Subject<void>();

  constructor(
    public contactDataService: ContactDataService,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService

  ) { }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this.contactDataService.getContactsByUserId().pipe(
      take(1),
      takeUntil(this.destroy$)
    ).subscribe((data: any[]) => {

setTimeout(() => {
  this.contacts = data;
  this.dataLoaded = true;
  this.cdr.detectChanges();
}, 1000);



      this.cdr.detectChanges();
    });

  }



  confirmDeleteContact(contact: any) {

const userId = localStorage.getItem('userId');


if(userId) {

  const data = {
    icon: 'error',
    color: '',
    message: `¿Seguro que desea eliminar a ${contact.name} ${contact.lastname} de tu lista de contactos?`,
    accept: 'Sí, estoy seguro',
    cancel: 'Cancelar'
  };

  const dialogRef: MatDialogRef<any, any> = this.dialogService.openDialog(data, { width: '500px' });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.deleteContact(contact._id);
    }
  });


}


  }


  deleteContact(contactId: string) {
    this.contactDataService.deleteContact(contactId).pipe(
      take(1),
      takeUntil(this.destroy$))
      .subscribe((data: any) => {
      this.contacts = this.contacts.filter((contact) => contact._id !== contactId);
      this.cdr.detectChanges()
    }
    )
  }



  openDialog() {
    const data = {
      icon: 'error',
      color: '',
      message: 'Seguro que desea eliminar el contacto?',
      accept: 'Sí estoy seguro',
      cancel: 'Que va!',
    }


    this.dialogService.openDialog(data, { width: '500px' });
  }



}
