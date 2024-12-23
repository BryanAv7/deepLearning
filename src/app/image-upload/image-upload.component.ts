import { Component } from '@angular/core';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent {

  constructor(private imageService: ImageService) { }

  onImageSelected(event: any) {
    const formData = new FormData();
    formData.append('image', event.target.files[0]);
    this.imageService.processImage(formData).subscribe(response => {
      console.log('Respuesta del servidor:', response);
    }, error => {
      console.error('Error al procesar la imagen:', error);
    });
  }
}
