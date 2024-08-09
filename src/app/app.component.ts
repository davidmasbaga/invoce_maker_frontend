import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from './services/flowbite.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'fakeholded';
constructor(private flowbiteService: FlowbiteService) { }
  ngOnInit(): void {
    initFlowbite();
this.flowbiteService.loadFlowbite(flowbite => {

    });
  }
}
