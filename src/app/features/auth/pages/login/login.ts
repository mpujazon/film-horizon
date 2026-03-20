import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth-service';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html'
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';

  async onSubmit(){
    try{
      await this.authService.login(this.email, this.password);
      await this.router.navigate(['/']);
    }catch(error){
      console.error('Error on login', error);
    }
  }
}
