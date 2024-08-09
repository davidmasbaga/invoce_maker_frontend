import { ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subject, take, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy{
  formError: string | null = null;
  errorMessageClass = "text-red-500 text-xs";

  emailEmpty=false;
  isPasswordEmpty=false;


  private destroy$: Subject<void> = new Subject<void>();

  private fb = inject(FormBuilder,)


  public myForm = this.fb.group({

    email: ['', Validators.required],
    password: ['', Validators.required]
  })



  constructor(
    private authService      : AuthService,
    private router           : Router,
    private cd               : ChangeDetectorRef
  ) { }
  ngOnDestroy(): void {
   this.destroy$.next();
   this.destroy$.complete();
  }



  login() {
    const { email, password } = this.myForm.value;

    if(!password){
      this.isPasswordEmpty=true;
      this.cd.detectChanges();
      return
    }else {
      this.isPasswordEmpty = false}

    if (email && password) {
      this.authService.login(email, password)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next:() =>  this.router.navigate(['/inicio/dashboard']),
          error: err => {
            this.formError = err.error.message;
            this.cd.detectChanges();
            this.hideErrorMessageAfterDelay();
          }
        });
    }
  }

  hideErrorMessageAfterDelay() {
    setTimeout(() => {
      this.formError = null;
      this.cd.detectChanges();
    }, 10000); // 10 segundos
  }

  clearErrorMessage() {
    this.formError = null;
    this.isPasswordEmpty = false;
    this.cd.detectChanges();
  }
}
