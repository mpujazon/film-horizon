import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {AuthService} from 'src/app/core/services/auth/auth-service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly formBuilder = inject(FormBuilder);

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]]
  });

  isSubmitting = false;
  loginErrorMessage = signal('');

  async onSubmit(){
    this.loginErrorMessage.set('');
    this.isSubmitting = true;
    try{
      const {email, password} = this.loginForm.getRawValue();
      await this.authService.login(email,password);
      await this.router.navigate(['']);
    }catch(error){
      this.showLoginError(error as Error);
    }finally {
      this.isSubmitting = false;
    }
  }

  showError(controlName: 'email' | 'password'): boolean {
    const c = this.loginForm.get(controlName);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  getError(controlName: 'email' | 'password'): string | null {
    const c = this.loginForm.get(controlName);
    if (!c?.errors) return null;

    if (c.errors['required']) return 'Required';
    if (c.errors['email']) return 'Email inalid';
    if (c.errors['minlength']) return `At least ${c.errors['minlength'].requiredLength} characters`;
    return 'Value not valid';
  }

  showLoginError(error: Error){
    if(error.message.includes('auth/invalid-credential')){
      this.loginErrorMessage.set('Invalid credential');
    }
  }
}
