import { Component, Input,Output, EventEmitter, OnInit } from '@angular/core';
import { FlowbiteService } from '../../../services/flowbite.service';
import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-cta-button',
  standalone: false,
  templateUrl: './cta-button.component.html',
  styleUrl: './cta-button.component.css'
})
export class CtaButtonComponent implements OnInit{

  constructor(private flowbiteService: FlowbiteService) { }
ngOnInit(): void {
  initFlowbite();
  this.flowbiteService.loadFlowbite(flowbite => {

  });
}


@Input()
size: 'small' | 'medium' | 'large' = 'medium';


@Input()
link: string = '';

@Input()
icon: string = '';

@Input()
title: string = 'Button';

@Output()
click = new EventEmitter<void>();

@Input()
category: 'primary' | 'secondary'  | 'loading'= 'primary';

@Input()
tooltip: string = '' ;

@Input()
type: string = 'button' ;



onClick(event: Event): void {
  if (this.type !== 'submit') {
    event.preventDefault();
  }
  this.click.emit();
}

}
