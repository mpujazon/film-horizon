import { inject, Injectable } from '@angular/core';
import {
  Auth, authState, createUserWithEmailAndPassword,
  sendEmailVerification, signInWithEmailAndPassword, signOut, User
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth: Auth = inject(Auth);

  readonly user$: Observable<User | null> = authState(this.auth);
  readonly user = toSignal(this.user$, {initialValue: null})

  async register(email: string, password: string){
    await createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential)=>{
        if(this.auth.currentUser){
          await sendEmailVerification(this.auth.currentUser);
          console.log("Email verification sent!");
        }
          return userCredential;
      }).catch((error)=>{
        console.error(error)
      });
  }

  login(email: string, password: string){
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  isAuthenticated(): boolean{
    return !!this.user();
  }

  isEmailVerified(): boolean{
    return this.user()?.emailVerified ?? false;
  }
}
