import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../services/flowbite.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  constructor(private flowbiteService: FlowbiteService) { }

  ngOnInit(): void {
    initFlowbite()
    this.flowbiteService.loadFlowbite(flowbite => {
      // Your custom code here
      // console.log('Flowbite loaded', flowbite);
    });
  }


  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
  }
}
