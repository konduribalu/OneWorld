import { Routes } from '@angular/router';
import { ShellLayoutComponent } from './accordion.component';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./login-host.component').then(m => m.LoginHostComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./register-host.component').then(m => m.RegisterHostComponent)
  },
  { 
    path: '', 
    component: ShellLayoutComponent
  },
  { 
    path: 'profile', 
    loadComponent: () => import('./profile-host.component').then(m => m.ProfileHostComponent)
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];
