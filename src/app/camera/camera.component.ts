import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss'
})
export class CameraComponent {
  public imageUrl: string | undefined;

  constructor(private router: Router) {}
  
    // Método para navegar a la página de Inicio (o Login si lo prefieres)
    irHistory(): void {
      this.router.navigate(['/history']);  // Redirige a la ruta de inicio
    }

  captureImage(event: any) {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        
        video.addEventListener('canplay', () => {
          // Draw the image from the video stream onto the canvas
          context?.drawImage(video, 0, 0, canvas.width, canvas.height);
          this.imageUrl = canvas.toDataURL('image/png');
          stream.getTracks().forEach(track => track.stop());  // Stop video stream after capturing
        });
      });
  }

   // Método para manejar la selección de una imagen desde el archivo
   onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;  // Establece la URL de la imagen seleccionada
      };
      reader.readAsDataURL(file);  // Lee el archivo como una URL de datos
    }
  }
}

