import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'merger';
  constructor() {
    document.body.className = "bg-dark text-white";
    
  }
}
