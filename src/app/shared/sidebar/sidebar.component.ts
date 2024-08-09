import { Component, OnInit } from '@angular/core';
import { FlowbiteService } from '../../services/flowbite.service';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menu = [
    {
      title: 'Dashboard',
      icon: 'pie_chart',
      link: '/dashboard',
      active: true
    },
    {
      title: 'Contactos',
      icon: 'group',
      link: '',
      active: false,
      control: 'dropdown-contacts',
      children: [
        {
          title: 'Lista',
          icon: '',
          link: '/inicio/contacts',
          active: true
        },
        {
          title: 'Añadir Contacto',
          icon: '',
          link: '/inicio/add-contact',
          active: true
        },
      ]
    },
    {
      title: 'Ventas',
      icon: 'trending_up',
      link: '/settings',
      active: false,
      control: 'dropdown-sales',
      children: [
        {
          title: 'Facturas',
          icon: '',
          link: '/inicio/sales/invoices',
          active: true
        },
        {
          title: 'Añadir Factura',
          icon: '',
          link: '/inicio/sales/invoices/add',
          active: true
        },
        {
          title: 'Presupuestos',
          icon: '',
          link: '/inicio/sales/budgets',
          active: true
        },
        {
          title: 'Añadir Presupuesto',
          icon: '',
          link: '/inicio/sales/budgets/add',
          active: true
        },
      ]
    },
    {
      title: 'Gastos',
      icon: 'trending_down',
      link: '/settings',
      active: false,
      control: 'dropdown-purchases',
      children: [
        {
          title: 'Gastos',
          icon: '',
          link: '/dashboard',
          active: true
        },
        {
          title: 'Añadir Factura Compra',
          icon: '',
          link: '/dashboard',
          active: true
        },
      ]
    },
  ];

  mainLiButtonStyle: string = "flex items-center p-2 w-full text-base font-medium text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ";
  linkLiButtonStyle: string = "flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 text-sm";

  constructor(private flowbiteService: FlowbiteService) { }

  ngOnInit(): void {
    initFlowbite();
    this.flowbiteService.loadFlowbite(flowbite => {
      // console.log('Flowbite loaded', flowbite);
    });
  }

  toggleDropdown(control: string) {
    const element = document.getElementById(control);
    if (element) {
      element.classList.toggle('hidden');
      element.classList.toggle('show');
    }
  }
}
