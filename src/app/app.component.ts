import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult,
  FirebaseuiAngularLibraryService
} from 'firebaseui-angular';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserdataService, userProfile } from './service/userdata.service';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  myuserProfile: userProfile = {
    userAuthenObj: null as any,//Receive User obj after login success
  };
  myauth;
  subjectauth = new BehaviorSubject(null as any);
  getObservableauthStateSub: Subscription = new Subscription;
  getObservableauthState = (authdetails: Observable<any>) => {
    if (this.getObservableauthStateSub !== undefined) {
      this.getObservableauthStateSub.unsubscribe();
    }
    this.getObservableauthStateSub = authdetails.subscribe((val: any) => {
      this.subjectauth.next(val);
      console.log(val);
    });
    return this.subjectauth;
  };
  myonline;
  subjectonline = new BehaviorSubject(undefined);
  getObservableonlineSub: Subscription = new Subscription;

  getObservableonline = (localonline: Observable<boolean>) => {
    this.getObservableonlineSub?.unsubscribe();
    this.getObservableonlineSub = localonline.subscribe((valOnline: any) => {
      console.log(valOnline);
      this.subjectonline.next(valOnline);
    });
    return this.subjectonline;
  }
  OnlineCheck: any;

  AfterOnlineCheckAuth: Observable<any>;
  constructor(public afAuth: AngularFireAuth, public firebaseuiAngularLibraryService: FirebaseuiAngularLibraryService, public developmentservice: UserdataService,
    private router: Router, private db: AngularFirestore,) {
    this.firebaseuiAngularLibraryService.firebaseUiInstance.disableAutoSignIn();

    this.myonline = this.getObservableonline(this.developmentservice.isOnline$);
    this.myauth = this.getObservableauthState(this.afAuth.authState);
    console.log('constructor');
    console.log(this.myauth);
    console.log(this.myonline);



    this.AfterOnlineCheckAuth = this.myonline.pipe(
      switchMap((onlineval: any) => {
        console.log(onlineval);
        if (onlineval === true) {
          console.log('reachd', this.myauth);
          return this.myauth.pipe(
            switchMap((afterauth: any) => {
              if (afterauth !== null && afterauth !== undefined) {
                this.myuserProfile.userAuthenObj = afterauth;

                console.log(this.myuserProfile.userAuthenObj);
                

                this.router.navigate(['/admin']);

              } else if (afterauth === null) {
                this.router.navigate(['']);
              }
              return of(onlineval);
            })
          );
        } else {
          this.router.navigate(['/offline']);
        }
        return of(onlineval);
      })
    )
  }

  ngAfterViewInit(): void {

  }
  successCallback(data: FirebaseUISignInSuccessWithAuthResult) {
    console.log('successCallback', data);

  }

  errorCallback(data: FirebaseUISignInFailure) {
    console.warn('errorCallback', data);
  }

  uiShownCallback() {
    console.log('UI shown');
  }

  logout() {
    this.afAuth.signOut();
  }
}