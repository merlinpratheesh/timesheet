import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppSharedModule } from './app-shared/app-shared.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { OfflineScreenComponent } from './offline-screen/offline-screen.component';

import {firebase, firebaseui, FirebaseUIModule} from 'firebaseui-angular';
import { AdminComponent } from './admin/admin.component';
import { TaskComponent } from './admin/task/task.component';
import { TaskDialogComponent } from './admin/task-dialog/task-dialog.component';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInOptions: [
      {
        // Google provider must be enabled in Firebase Console to support one-tap
        // sign-up.
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // Required to enable ID token credentials for this provider.
        // This can be obtained from the Credentials page of the Google APIs
        // console. Use the same OAuth client ID used for the Google provider
        // configured with GCIP or Firebase Auth.
        clientId: '1083946522610-no8pqccuo3ca8hiu0nhs54slt9lm5qhj.apps.googleusercontent.com'
        
      }],
  
    credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
  
  };
 

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    OfflineScreenComponent,TaskComponent, TaskDialogComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppSharedModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule // storage
    ,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }