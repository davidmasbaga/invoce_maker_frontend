import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-main-layout-page',
  templateUrl: './main-layout-page.component.html',
  styleUrl: './main-layout-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutPageComponent implements OnInit {

  private authService = inject(AuthService);
  public user = computed(() => this.authService.currentUser());


  ngOnInit(): void {
   
    initFlowbite()

  }

}
