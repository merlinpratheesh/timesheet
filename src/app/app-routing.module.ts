import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { OfflineScreenComponent } from './offline-screen/offline-screen.component';

const routes: Routes = [
  
  { path: 'admin', component: AdminComponent },
  { path: 'offline', component: OfflineScreenComponent },

  { path: '',   redirectTo: '/admin', pathMatch: 'full' },

  { path: '**', redirectTo: '/admin', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
