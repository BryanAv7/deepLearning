import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss'
})

export class CameraComponent {//implements OnInit{
  public imageUrl: string | undefined;
  public selectedImage: File | null = null;  // Para guardar la imagen seleccionada
  //private recognition: any; // Instancia de SpeechRecognition

  constructor(private http: HttpClient, private router: Router) {}
  
  /*
  ngOnInit(): void {
    // Inicializar el reconocimiento de voz
    this.initVoiceRecognition();
  }

  // Configuración del reconocimiento de voz
  initVoiceRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('API de reconocimiento de voz no soportada en este navegador.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US'; // Idioma español
    this.recognition.continuous = false; // Escuchar una sola frase
    this.recognition.interimResults = false; // Obtener solo los resultados finales

    // Evento cuando se detecta un comando de voz
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      console.log('Comando de voz detectado:', transcript);

      // Verificar si el comando es "explorar"
      if (transcript === 'home') {
        this.captureImageFromVoice(); // Llamar al método de captura de imagen
      } else {
        console.log('Comando no reconocido.');
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Error en el reconocimiento de voz:', event.error);
    };
  }

  // Método para activar el reconocimiento de voz
  startListening(): void {
    if (this.recognition) {
      this.recognition.start();
      console.log('Reconocimiento de voz activado. Di "Explorar".');
    }
  }

  // Método para capturar la imagen desde la voz
  captureImageFromVoice(): void {
    //this.captureImage(event); // Llama al método de captura existente
    console.log("Funciona!!!")
  }

  */

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
          // Establecer las dimensiones del canvas
          canvas.width = video.videoWidth || 640;  // Si no hay dimensiones, usamos un valor por defecto
          canvas.height = video.videoHeight || 480;
  
          // Dibujar la imagen del video sobre el canvas
          context?.drawImage(video, 0, 0, canvas.width, canvas.height);
  
          // Convertir el canvas a una imagen (DataURL)
          this.imageUrl = canvas.toDataURL('image/png');
  
          // Convertir el DataURL a un archivo para que se pueda enviar en el formulario
          const byteString = atob(this.imageUrl.split(',')[1]);  // Obtener los bytes de la imagen
          const mimeString = this.imageUrl.split(',')[0].split(':')[1].split(';')[0];  // Tipo MIME
          const arrayBuffer = new ArrayBuffer(byteString.length);
          const view = new Uint8Array(arrayBuffer);
          
          for (let i = 0; i < byteString.length; i++) {
            view[i] = byteString.charCodeAt(i);
          }
  
          const file = new File([arrayBuffer], 'captured-photo.png', { type: mimeString });
          this.selectedImage = file;  // Asignamos el archivo a selectedImage
          
          // Detener el stream de la cámara
          stream.getTracks().forEach(track => track.stop());

          // Eliminar el video creado dinámicamente
          video.remove();
        });
      })
      .catch((error) => {
        console.error('Error al acceder a la cámara:', error);
      });
  }

   // Método para manejar la selección de una imagen desde el archivo
    onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;  // Establece la URL de la imagen seleccionada
        this.selectedImage = file;  // Guarda el archivo seleccionado
      };
      reader.readAsDataURL(file);  // Lee el archivo como una URL de datos
    }
  }

  processImage() {
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('image', this.selectedImage);

      this.http.post('http://127.0.0.1:5000/process_image', formData).subscribe(
        (response: any) => {
          console.log('Resultado:', response);

          // Obtener el historial actual desde localStorage (si existe)
        const currentHistory = JSON.parse(localStorage.getItem('history') || '[]');

        // Agregar la nueva imagen al historial
        currentHistory.push(response);

        // Guardar el historial actualizado en localStorage
        localStorage.setItem('history', JSON.stringify(currentHistory));

        // Navegar a la vista de historial
        this.router.navigate(['/history']);

          //this.router.navigate(['/history'], { state: { historyItem: response } });
        },
        (error) => {
          console.error('Error al procesar la imagen:', error);
        }
      );
    } else {
      alert('Por favor, selecciona una imagen antes de procesar.');
    }
  }
}