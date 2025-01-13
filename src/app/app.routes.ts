import { Routes } from '@angular/router';
import { CameraComponent } from './camera/camera.component';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [

    { path: 'home', component: HomeComponent, data: { animation: 'home' } },
    { path: 'camera', component: CameraComponent, data: { animation: 'camera' } },
    { path: 'history', component: HistoryComponent, data: { animation: 'history' } },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];
