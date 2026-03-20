import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth-service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login.html'
})
export class Login {
  private readonly authService = inject(AuthService);

  email = '';
  password = '';

  async onSubmit(){
    try{
      await this.authService.login(this.email, this.password);
      console.log('Login correcto')
    }catch(error){
      console.error('Error on login', error);
    }
  }
}
