import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private apiUrl = 'http://127.0.0.1:5000/process_image';  // Asegúrate de que la URL corresponda al endpoint de Flask

  constructor(private http: HttpClient) { }

  processImage(formData: FormData){
    return this.http.post(this.apiUrl, formData);
  }
}
