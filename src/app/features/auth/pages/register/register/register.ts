import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../../../core/services/auth/auth-service';
import {email} from '@angular/forms/signals';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html'
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly formBuilder = inject(FormBuilder);

  registerForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]],
    confirmPassword: ['', [Validators.minLength(8), Validators.required]]
  },
    {
      validators: password.equals(confirmPassword)
    });

  isSubmitting = false;

  async onSubmit(){
    this.isSubmitting = true;
    try{
      const {email, password} = this.registerForm.getRawValue();
      await this.authService.register(email,password);
      await this.router.navigate(['/verify-email']);
    }catch(error){
      console.error('Error on register', error);
    }finally {
      this.isSubmitting = false;
    }
  }

  showError(controlName: 'email' | 'password' |'confirmPassword'): boolean {
    const c = this.registerForm.get(controlName);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  getError(controlName: 'email' | 'password' | 'confirmPassword'): string | null {
    const c = this.registerForm.get(controlName);
    if (!c?.errors) return null;

    if (c.errors['required']) return 'Required';
    if (c.errors['email']) return 'Email inalid';
    if (c.errors['minlength']) return `At least ${c.errors['minlength'].requiredLength} characters`;
    return 'Value not valid';
  }
}
