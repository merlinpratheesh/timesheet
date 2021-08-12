import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AppComponent } from './app.component';
import { OfflineScreenComponent } from './offline-screen/offline-screen.component';

const routes: Routes = [
  { path: 'Admin', component: AppComponent },

  { path: '',   redirectTo: 'Admin', pathMatch: 'full' },

  { path: '**', redirectTo: 'Admin', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
