import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ContactDataService } from '../../../../services/contact-data.service';
import { Subject, take, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { InvoiceManagementService } from '../../../../services/invoice-management.service';
import { FlowbiteService } from '../../../../services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { InvoiceDataServiceService } from '../../../../services/invoice-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-new-invoice',
  templateUrl: './add-new-invoice.component.html',
  styleUrls: ['./add-new-invoice.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewInvoiceComponent implements OnInit, OnDestroy {
  invoiceForm: FormGroup;
  contacts: any[] | undefined;
  taxes: any[] = [];
  invoiceTotals: any = {};
  invoiceId: string | null = '';
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    public contactDataService: ContactDataService,
    public invoiceManagementService: InvoiceManagementService,
    public invoiceDataService: InvoiceDataServiceService,
    private cd: ChangeDetectorRef,
    public flowbiteService: FlowbiteService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
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
    initFlowbite();
    this.flowbiteService.loadFlowbite((flowbite) => {});

    this.route.paramMap.subscribe((params) => {
      this.invoiceId = params.get('id');
      if (this.invoiceId) {
        this.loadInvoice(this.invoiceId);
      }
    });

    this.invoiceManagementService.getTaxes();
    this.invoiceManagementService.taxes$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((taxes) => {
        this.taxes = taxes;
      });

    this.contactDataService
      .getContactsByUserId()
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((contacts) => {
        this.contacts = contacts;
        this.cd.detectChanges();
      });

    this.invoiceForm.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.invoiceId && this.invoiceForm.value.contactId) {
          this.updateConcepts();
        }
      });

    this.subscribeToConceptChanges();

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get concepts(): FormArray {
    return this.invoiceForm.get('concepts') as FormArray;
  }

  addConcept(): void {
    const conceptForm = this.fb.group({
      concept: [''], // Campo opcional
      description: [''], // Campo opcional
      units: [1, Validators.required],
      amount: [0, Validators.required],
      taxes: [[]],
      total: [0, Validators.required],
    });

    this.concepts.push(conceptForm);
    this.subscribeToConceptChanges();
    this.cd.detectChanges();
  }

  subscribeToConceptChanges(): void {
    this.concepts.controls.forEach((control, index) => {
      control.get('units')?.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => this.calculateTotalPerConcept(index));

      control.get('amount')?.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => this.calculateTotalPerConcept(index));

      control.get('taxes')?.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(() => this.calculateTotalPerConcept(index));
    });

    this.concepts.valueChanges
    .pipe(debounceTime(2000), distinctUntilChanged())
    .subscribe(() => this.calculateTotals());
  }

  updateConcepts(): void {
    const conceptsArray = this.concepts.value;
    const requestPayload = { concepts: conceptsArray };

    this.invoiceDataService.calculateTotals(requestPayload).subscribe({
      next: (totals) => {
        this.invoiceTotals = totals;
        this.cd.detectChanges();
      },
      error: (error) => console.error('Error calculating totals:', error),
    });
  }

  removeConcept(index: number): void {
    this.concepts.removeAt(index);
    this.updateConcepts();
  }

  onSubmit(): void {

    if
     (this.invoiceForm.valid) {


      const invoiceData = this.invoiceForm.value;

      const payload = {
        contactId: invoiceData.contactId,
        documentNumber: invoiceData.documentNumber,
        date: invoiceData.date,
        expiration: invoiceData.expiration,
        concepts: invoiceData.concepts.map((concept: any) => ({
          concept: concept.concept || '',
          description: concept.description || '',
          units: Number(concept.units),
          amount: Number(concept.amount),
          taxes: concept.taxes.map((tax: any) => tax.toString()),
          total: Number(concept.total),
        })),
      };

      if (this.invoiceId) {

        this.invoiceDataService
          .finalizeInvoice(this.invoiceId, payload)
          .subscribe(
            () => {
              this.snackBar.open('Factura Guardada', 'Cerrar', {
                duration: 3000,
                panelClass: 'success-snackbar',
              });
            },
            (error) =>
              this.snackBar.open('Error al guardar la factura', 'X', {
              duration: 3000,
              panelClass: 'error-snackbar',
            })
          );
      } else {
        this.invoiceDataService
          .createDraftInvoice()
          .pipe(take(1))
          .subscribe(
            (response) => {
              this.invoiceId = response.invoiceId;

            },
            (error) => console.error('Error creating draft invoice:', error)
          );
      }
    }else {console.log('el formulario es invalido', this.invoiceForm)}
  }

  loadInvoice(invoiceId: string): void {
    this.invoiceManagementService.getInvoiceById(invoiceId);
    this.invoiceManagementService.invoice$
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((invoice) => {
        this.invoiceForm.patchValue({
          contactId: invoice.contact,
          documentNumber: invoice.documentNumber,
          date: invoice.date,
          expiration: invoice.expiration,
        });

        this.concepts.clear();

        if (Array.isArray(invoice.concepts)) {
          invoice.concepts.forEach((concept: any) => {
            const conceptForm = this.fb.group({
              concept: [concept.concept || ''],
              description: [concept.description || ''],
              units: [concept.units, Validators.required],
              amount: [concept.amount, Validators.required],
              taxes: [concept.taxes],
              total: [concept.total , Validators.required],
            });

            this.concepts.push(conceptForm);
          });
        }

        this.subscribeToConceptChanges();
        this.cd.detectChanges();
      });
  }

  calculateTotalPerConcept(index: number): void {
    const concept = this.concepts.at(index).value;
    const payload = {
      units: concept.units,
      amount: concept.amount,
      taxes: concept.taxes,
    };

    this.invoiceDataService.calculateConcept(payload).subscribe({
      next: (total) => {
        // Actualiza el total en el formulario
        const totalControl = this.concepts.at(index).get('total');
        if (totalControl) {
          totalControl.setValue(total, { emitEvent: false });
        }
        this.updateConcepts();
      },
      error: (error) => console.error('Error calculating total:', error),
    });
  }

  calculateTotals(): void {

    const conceptsArray = this.concepts.value;

    // Asegurarse de que sea un array
    if (!Array.isArray(conceptsArray)) {
      console.error('Concepts should be an array.');
      return;
    }


    const payload = {
      concepts: conceptsArray
    };


    this.invoiceDataService.calculateTotals(payload).subscribe({
      next: (response) => {
        this.invoiceTotals = response;
        const payload ={
          subtotal : response.subtotal,
          totalTaxes :response.totalTaxes,
          totalWithTaxes : response.total
        }
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error calculating totals:', error);
      }
    });
  }
  deleteInvoice(): void {
    const conceptsArray = this.invoiceForm.get('concepts') as FormArray;

    if (this.invoiceId && conceptsArray.length === 0) {
      this.invoiceDataService.deleteInvoice(this.invoiceId).subscribe(() => {
        this.router.navigate(['/inicio/sales/invoices']);
      });
    } else {
      this.router.navigate(['/inicio/sales/invoices']);
    }
  }
}
