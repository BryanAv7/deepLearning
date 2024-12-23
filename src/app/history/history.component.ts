import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../services/image.service';

interface HistoryItem {
  imageUrl: string;
  labels: string[];
  timestamp: string;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})

export class HistoryComponent implements OnInit{
  public history: HistoryItem [] = [];

  constructor(private router: Router, private imageService: ImageService, private cdr: ChangeDetectorRef) {}
  /*
  //Desde el state
  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras['state'];  // Acceder con corchetes

    console.log('State:', state);

    if (state && state['historyItem']) {  // Acceder con corchetes
      console.log('History Item:', state['historyItem']);
      this.history.push(state['historyItem']);  // Ahora TypeScript reconoce el tipo
    }
  }
  */

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Solo acceder a localStorage si estamos en el navegador
      try {
        const history = JSON.parse(localStorage.getItem('history') || '[]');  // Cambié 'historyItem' por 'history'
        console.log('History:', history);
        if (history.length > 0) {
          this.history = history;  // Asignar el historial a la propiedad history para mostrarlo en la vista
        }
  
        // Forzar actualización de la vista
        this.cdr.detectChanges();
      } catch (error) {
        console.error('Error al parsear localStorage:', error);
      }
    }
  }
  
  // Método para mostrar la imagen en el historial
  mostrarImagen(imageUrl: string): string {
    return imageUrl;  // La URL de la imagen la puedes usar en tu HTML
  }

  // Método para navegar a la página de Inicio (o Login si lo prefieres)
  irCamera(): void {
    this.router.navigate(['/camera']);  // Redirige a la ruta de inicio
  }


  // Método para leer los resultados por voz
  speak(historyItem: any): void {
    const speech = new SpeechSynthesisUtterance();

    // Generar el texto a leer
    const labelsText = `Etiquetas detectadas: ${historyItem.labels.join(', ')}`;
    const dateText = `Fecha de procesamiento: ${new Date(historyItem.timestamp).toLocaleString()}`;
    speech.text = `${labelsText}. ${dateText}.`;

    // Configuración de voz y velocidad
    speech.lang = 'es-ES'; // Idioma español
    speech.rate = 1; // Velocidad normal
    speech.pitch = 1; // Tono normal

    // Leer en voz alta
    window.speechSynthesis.speak(speech);
  }

}
