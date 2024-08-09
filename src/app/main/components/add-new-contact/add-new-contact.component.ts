import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewEncapsulation,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  Input
} from '@angular/core';
import { FlowbiteService } from '../../../services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactDataService } from '../../../services/contact-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-new-contact',
  templateUrl: './add-new-contact.component.html',
  styleUrls: ['./add-new-contact.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
export class AddNewContactComponent implements OnInit, AfterViewInit, OnChanges {
  inputClass: string =
    'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';
  status = '';
  contactForm!: FormGroup;
  currentUrl!: string;
  isEditMode = false;
  contactId!: string;
  isPerson = true;

  @Input() contact: any;

  constructor(
    private flowbiteService: FlowbiteService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    public contactDataService: ContactDataService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    initFlowbite();
    this.flowbiteService.loadFlowbite((flowbite) => {
      // console.log('Flowbite loaded', flowbite);
    });

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.contactId = params['id'];
        this.loadContactData(this.contactId);
      }
    });

    this.currentUrl = this.router.url;
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  ngAfterViewInit(): void {
    this.loadContactData(this.contactId);
    this.contactForm.get('contactCategory')?.valueChanges.subscribe((value) => {
      this.updateContactCategory(value);
    });

  }

  private initForm() {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      typeDoc: ['NIF', Validators.required],
      fiscal: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: [''],
      telefono: ['', Validators.required],
      calle: ['', Validators.required],
      numero: ['', Validators.required],
      escalera: [''],
      piso: [''],
      puerta: [''],
      cp: ['', Validators.required],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
      pais: ['', Validators.required],
      contactType: ['client', Validators.required],
      contactCategory: ['person', Validators.required],
    });
  }

  private loadContactData(contactId: string) {
    this.contactDataService.getUniqueContactByContactId(contactId).subscribe({
      next: (data) => {
        if(data.contactCategory === 'person') {
          this.isPerson = true;
        this.cd.detectChanges()
        } else {
          this.isPerson = false;
          this.cd.detectChanges()
        }
        this.updateFormWithContactData(data);
      },
      error: (error) => {
        // Handle error
      },
    });
  }

  private updateFormWithContactData(data: any) {
    this.contactForm.patchValue({
      nombre: data.name,
      typeDoc: data.fiscal.type,
      fiscal: data.fiscal.number,
      email: data.email,
      company: data.company,
      telefono: data.phoneNumber,
      calle: data.address.street,
      numero: data.address.number,
      escalera: data.address.escalera,
      piso: data.address.piso,
      puerta: data.address.puerta,
      cp: data.address.postalCode,
      ciudad: data.address.city,
      provincia: data.address.province,
      pais: data.address.country,
      contactType: data.contactType,
      contactCategory: data.contactCategory,
    });

    // Establece la categoría de contacto correctamente
    this.updateContactCategory(data.contactCategory);
  }

  private updateContactCategory(category: string) {
    if (category === 'person') {
      this.isPerson = true;
      this.contactForm.get('typeDoc')?.setValue('NIF');
    } else {
      this.isPerson = false;
      this.contactForm.get('typeDoc')?.setValue('CIF');
    }
  }

  onSubmit() {
    if (this.isEditMode === true) {
      this.onEditSubmit();
    } else {
      this.onAddSubmit();
    }
  }

  onAddSubmit() {
    this.status = 'loading';
    this.markFormTouched(this.contactForm);
    this.cd.detectChanges();

    const payload = this.createPayload();

    if (this.contactForm.valid) {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.contactDataService.addContact(payload).subscribe({
          next: (response) => {
            this.status = 'default';
            this.cd.detectChanges();
            this.snackBar.open('Contacto añadido exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: 'success-snackbar',
            });
          },
          error: (error) => {
            this.status = 'default';
            this.cd.detectChanges();
            this.snackBar.open('Error al añadir contacto', 'X', {
              duration: 3000,
              panelClass: 'error-snackbar',
            });
          },
        });
      } else {
        this.status = 'default';
        this.cd.detectChanges();
        this.snackBar.open('No se ha encontrado el id del usuario', 'X', {
          duration: 3000,
          panelClass: 'error-snackbar',
        });
      }
    } else {
      this.status = 'default';
      this.cd.detectChanges();
      this.snackBar.open('Formulario inválido', 'X', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
    }
  }

  onEditSubmit() {
    this.status = 'loading';
    this.markFormTouched(this.contactForm);
    this.cd.detectChanges();

    const payload = this.createPayload();

    if (this.contactForm.valid) {
      const userId = localStorage.getItem('userId');

      if (userId) {
        this.contactDataService.editContact(this.contactId, payload).subscribe({
          next: (response) => {
            this.status = 'default';
            this.cd.detectChanges();
            this.snackBar.open('Contacto editado exitosamente', 'Cerrar', {
              duration: 3000,
              panelClass: 'success-snackbar',
            });
          },
          error: (error) => {
            this.status = 'default';
            this.cd.detectChanges();
            this.snackBar.open('Error al editar contacto', 'X', {
              duration: 3000,
              panelClass: 'error-snackbar',
            });
          },
        });
      } else {
        this.status = 'default';
        this.cd.detectChanges();
        this.snackBar.open('No se ha encontrado el id del contacto', 'X', {
          duration: 3000,
          panelClass: 'error-snackbar',
        });
      }
    } else {
      this.status = 'default';
      this.cd.detectChanges();
      this.snackBar.open('Formulario inválido', 'X', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
    }
  }

  private createPayload() {
    return {
      name: this.contactForm.value.nombre.trim(),
      fiscal: {
        type: this.contactForm.value.typeDoc,
        number: this.contactForm.value.fiscal.trim(),
      },
      email: this.contactForm.value.email.trim().toLowerCase(),
      company: this.contactForm.value.company?.trim() || '',
      phoneNumber: this.contactForm.value.telefono.trim(),
      address: {
        street: this.contactForm.value.calle.trim(),
        number: this.contactForm.value.numero.trim(),
        escalera: this.contactForm.value.escalera?.trim() || '',
        piso: this.contactForm.value.piso?.trim() || '',
        puerta: this.contactForm.value.puerta?.trim() || '',
        postalCode: this.contactForm.value.cp.trim(),
        city: this.contactForm.value.ciudad.trim(),
        province: this.contactForm.value.provincia?.trim() || '',
        country: this.contactForm.value.pais.trim(),
      },
      contactType: this.contactForm.value.contactType,
      contactCategory: this.contactForm.value.contactCategory,
    };
  }

  private markFormTouched(group: FormGroup) {
    Object.keys(group.controls).forEach((key) => {
      const control = group.get(key);
      if (control instanceof FormGroup) {
        this.markFormTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }
}
