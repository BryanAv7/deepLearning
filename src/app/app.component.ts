import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'app';

  constructor(private router: Router) {}

  irHome(): void {
    this.router.navigate(['/home']);  // Redirige a la ruta de inicio
  }

  irCamera(): void {
    this.router.navigate(['/camera']);  // Redirige a la ruta de camara
  }

    // Método para navegar a la página de Inicio (o Login si lo prefieres)
  irHistory(): void {
    this.router.navigate(['/history']);  // Redirige a la ruta de historial
  }

  getOutletState(outlet: RouterOutlet): string {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  
}
