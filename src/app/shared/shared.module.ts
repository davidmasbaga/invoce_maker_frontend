import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MaterialModule } from './material/material.module';
import { RouterModule } from '@angular/router';
import { CtaButtonComponent } from './ui-components/cta-button/cta-button.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ButtonDirective } from './directives/button.directive';




@NgModule({
  declarations: [
     NavbarComponent,
     SidebarComponent,
     CtaButtonComponent,
     SpinnerComponent,
     ButtonDirective
    ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    CtaButtonComponent,
    MaterialModule,
    SpinnerComponent,
    ButtonDirective
  ]

})
export class SharedModule { }
