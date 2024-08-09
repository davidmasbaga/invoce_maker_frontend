import { ChangeDetectorRef, Component } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import { ContactDataService } from '../../../services/contact-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  contacts: any;

  constructor(
   private contactDataService: ContactDataService,
   private cdr: ChangeDetectorRef,
  ) {
    this.contactDataService.getContactsByUserId().subscribe((data: any[]) => {
      this.contacts = data;
      this.cdr.detectChanges();
    });

  }

}
