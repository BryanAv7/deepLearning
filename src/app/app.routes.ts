import { Routes } from '@angular/router';
import { CameraComponent } from './camera/camera.component';
import { HistoryComponent } from './history/history.component';

export const routes: Routes = [

    { path: 'camera', component: CameraComponent },
    { path: 'history', component: HistoryComponent },
    { path: '', redirectTo: '/camera', pathMatch: 'full' }
];
