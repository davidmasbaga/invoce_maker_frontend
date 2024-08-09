import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ContactDataService } from '../../../../services/contact-data.service';
import { Subject, take, takeUntil } from 'rxjs';
import { InvoiceManagementService } from '../../../../services/invoice-management.service';
import { FlowbiteService } from '../../../../services/flowbite.service'
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-add-new-invoice',
  templateUrl: './add-new-invoice.component.html',
  styleUrls: ['./add-new-invoice.component.css']
})
export class AddNewInvoiceComponent implements OnInit, OnDestroy {
  invoiceForm: FormGroup;
  contacts : any[] | undefined

private destroy$:Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder,
    public contactDataService: ContactDataService,
    public invoiceManagementService: InvoiceManagementService,
    private cd: ChangeDetectorRef,
    public flowbiteService: FlowbiteService
  ) {

    this.invoiceForm = this.fb.group({
      contact: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
      date: ['', Validators.required],
      expiration: ['', Validators.required],
      concepts: this.fb.array([]),
      taxes: [],
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {

    initFlowbite()
    this.flowbiteService.loadFlowbite(flowbite => {
      // Your custom code here
      // console.log('Flowbite loaded', flowbite);
    });

    this.invoiceManagementService.getTaxes()
    this.invoiceManagementService.taxes$?.subscribe(res=>console.log(res))
    this.addConcept();
    this.contactDataService.getContactsByUserId().pipe(
      take(1),
      takeUntil(this.destroy$)

    ).subscribe(contacts => {
       this.contacts = contacts
       this.cd.detectChanges()
       })
  }

  get concepts() {
    return this.invoiceForm.get('concepts') as FormArray;
  }

  addConcept(): void {
    this.concepts.push(this.fb.group({
      concept: ['', Validators.required],
      description: ['', Validators.required],
      units: ['', Validators.required],
      amount: ['', Validators.required],
      taxes: ['', Validators.required],
      total: ['', Validators.required]
    }));
  }

  removeConcept(index: number): void {
    this.concepts.removeAt(index);
  }

  onSubmit(): void {
    if (this.invoiceForm.valid) {
      // Procesar los datos del formulario
      console.log(this.invoiceForm.value);
    }
  }
}
