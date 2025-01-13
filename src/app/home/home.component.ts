import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  showWelcome: boolean = true;

  ngOnInit() {
    // La animación se detiene y el contenido se muestra después de 8 segundos
    setTimeout(() => {
      this.showWelcome = false;
    }, 5000);
  }
}
