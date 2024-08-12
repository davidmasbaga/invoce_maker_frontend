import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ContactDataService } from '../../../../services/contact-data.service';
import { debounceTime, Subject, take, takeUntil, tap } from 'rxjs';
import { InvoiceManagementService } from '../../../../services/invoice-management.service';
import { FlowbiteService } from '../../../../services/flowbite.service'
import { initFlowbite } from 'flowbite';
import { InvoiceDataServiceService } from '../../../../services/invoice-data.service';
import { ActivatedRoute } from '@angular/router';

import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-add-new-invoice',
  templateUrl: './add-new-invoice.component.html',
  styleUrls: ['./add-new-invoice.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNewInvoiceComponent implements OnInit, OnDestroy {
  invoiceForm: FormGroup;
  contacts: any[] | undefined;
  taxes: any[] = [];
  invoiceTotals: any = {};
  invoiceId: string | null = '';

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder,
    public contactDataService: ContactDataService,
    public invoiceManagementService: InvoiceManagementService,
    public invoiceDataService: InvoiceDataServiceService,
    private cd: ChangeDetectorRef,
    public flowbiteService: FlowbiteService,
    private route: ActivatedRoute
  ) {

    this.invoiceForm = this.fb.group({
      contactId: ['', Validators.required],
      documentNumber: ['', Validators.required],
      date: ['', Validators.required],
      expiration: ['', Validators.required],
      concepts: this.fb.array([]),
    });
  }



  ngOnInit(): void {

    initFlowbite()
    this.flowbiteService.loadFlowbite(flowbite => {

    });

    this.route.paramMap.subscribe(params => {
      this.invoiceId = params.get('id');
      if (this.invoiceId) {
        this.loadInvoice(this.invoiceId);
      }
    });

    this.invoiceManagementService.getTaxes()
    this.invoiceManagementService.taxes$?.pipe(
      takeUntil(this.destroy$)
    ).subscribe(taxes => {
      this.taxes = taxes;
    });

    this.addConcept();
    this.contactDataService.getContactsByUserId().pipe(
      take(1),
      takeUntil(this.destroy$)

    ).subscribe(contacts => {

      setTimeout(() => {this.contacts = contacts
        this.cd.detectChanges()}, 2000)

    })


   this.invoiceForm.valueChanges
    .pipe(debounceTime(2000))
    .subscribe(() => {
      if (this.invoiceId && this.invoiceForm.value.contactId) {
        const invoiceData = this.invoiceForm.value;
        // Verificar que concepts existe y es un array
        const concepts = invoiceData?.concepts || [];
        if (Array.isArray(concepts)) {
          concepts.forEach((concept: any) => {
            concept.units = Number(concept.units);
            concept.amount = Number(concept.amount);
          });

          this.invoiceDataService.finalizeInvoice(this.invoiceId, invoiceData)
            .pipe(tap( ()=> this.refreshInvoice()), take(1))
            .subscribe();

        }
      }
    });

  this.subscribeToConceptChanges();






  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }



  get concepts() {
    return this.invoiceForm.get('concepts') as FormArray;
  }

  addConcept(): void {
    const conceptForm = this.fb.group({

      concept: ['', Validators.required],
      description: ['', Validators.required],
      units: ['1', Validators.required,],
      amount: ['', Validators.required],
      taxes: ['', Validators.required],
      total: ['', Validators.required]
    });


    conceptForm.get('units')?.valueChanges.subscribe(() => this.calculateAndSetTotal(this.concepts.length - 1));
    conceptForm.get('amount')?.valueChanges.subscribe(() => this.calculateAndSetTotal(this.concepts.length - 1));
    conceptForm.get('taxes')?.valueChanges.subscribe(() => this.calculateAndSetTotal(this.concepts.length - 1));



    this.concepts.push(conceptForm);
    this.subscribeToConceptChanges()
    this.cd.detectChanges()
  }


  subscribeToConceptChanges(): void {
    this.concepts.controls.forEach((control, index) => {
      control.get('units')?.valueChanges.subscribe(() => this.calculateAndSetTotal(index));
      control.get('amount')?.valueChanges.subscribe(() => this.calculateAndSetTotal(index));
      control.get('taxes')?.valueChanges.subscribe(() => this.calculateAndSetTotal(index));
    });
    this.cd.detectChanges()
  }

  removeConcept(index: number): void {
    this.concepts.removeAt(index);

  }


  onSubmit(): void {
    if (this.invoiceForm.valid) {
      const invoiceData = this.invoiceForm.value;

      if (invoiceData.contactId) {
        // Verificar que concepts existe y es un array
        const concepts = invoiceData?.concepts || [];
        if (Array.isArray(concepts)) {
          concepts.forEach((concept: any) => {
            concept.units = Number(concept.units);
            concept.amount = Number(concept.amount);
          });

          const payload = {
            contactId: invoiceData.contactId,
            documentNumber: invoiceData.documentNumber,
            date: invoiceData.date,
            expiration: invoiceData.expiration,
            concepts: concepts.map((concept: any) => {
              return {
                concept: concept.concept,
                description: concept.description,
                units: concept.units,
                amount: concept.amount,
                taxes: concept.taxes,
                total: concept.total
              };
            })
          };

          if (this.invoiceId) {
            this.invoiceDataService.finalizeInvoice(this.invoiceId, payload)
              .subscribe(
                response => {
                  console.log('Invoice finalized:', response);
                },
                error => {
                  console.error('Error finalizing invoice:', error);
                }
              );
          } else {
            this.invoiceDataService.createDraftInvoice()
              .pipe(take(1))
              .subscribe(
                response => {
                  this.invoiceId = response.invoiceId;
                  console.log('Draft invoice created:', response);
                },
                error => {
                  console.error('Error creating draft invoice:', error);
                }
              );
          }
        }
      }
    }
  }


  loadInvoice(invoiceId: string): void {
    this.invoiceManagementService.getInvoiceById(invoiceId)
    this.invoiceManagementService.invoice$?.pipe(
      takeUntil(this.destroy$)
    )

    .subscribe(invoice => {

      this.invoiceForm.patchValue({
        contactId: invoice.contact,
        documentNumber: invoice.documentNumber,
        date: invoice.date,
        expiration: invoice.expiration
      });

      this.concepts.clear();

      if (Array.isArray(invoice.concepts)) {
        invoice.concepts.forEach((concept: any) => {
          const conceptForm = this.fb.group({
            concept: [concept.concept, Validators.required],
            description: [concept.description, Validators.required],
            units: [concept.units, Validators.required],
            amount: [concept.amount, Validators.required],
            taxes: [concept.taxes, Validators.required],
            total: [concept.total, Validators.required]
          });

          this.concepts.push(conceptForm);
        });
      }

      this.subscribeToConceptChanges();
      this.cd.detectChanges();
    });


  }

  calculateTotalPerConcept(index: number): number {
    const concept = this.concepts.at(index);
    const units = concept.get('units')?.value || 0;
    const amount = concept.get('amount')?.value || 0;
    const selectedTaxes = concept.get('taxes')?.value || [];
    let total = units * amount;

    // Sumar todos los porcentajes de impuestos
    let totalTaxPercentage = 0;
    selectedTaxes.forEach((taxId: any) => {
      const tax = this.taxes.find(t => t._id === taxId);
      if (tax && tax.percentage) {
        totalTaxPercentage += tax.percentage;
      }
    });

    // Aplicar los impuestos al total base
    total += total * totalTaxPercentage;

    return Number(total.toFixed(2));
  }

  calculateAndSetTotal(index: number): void {
    const total = this.calculateTotalPerConcept(index);
    this.concepts.at(index).get('total')?.setValue(total);
  }


  refreshInvoice(): void {
    if (this.invoiceId) {
      this.loadInvoice(this.invoiceId);
    }}

}
