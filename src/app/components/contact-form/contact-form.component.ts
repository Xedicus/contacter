import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ContactFormComponent implements OnInit {
  isEditMode = false;
  contactId?: number;
  contactForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    this.contactForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern(/^[\d\s+-]*$/)],
      photo: ['', Validators.pattern(/^(http|https):\/\/.+/)]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.contactId = +id;
      this.isEditMode = true;
      this.loadContact(this.contactId);
    }
  }

  loadContact(id: number): void {
    this.loading = true;
    this.contactService.getContact(id).subscribe({
      next: (contact) => {
        this.contactForm.patchValue({
          first_name: contact.first_name,
          last_name: contact.last_name,
          email: contact.email,
          phone: contact.phone,
          photo: contact.photo
        });
        this.loading = false;
      },
      error: (err) => {
        this.showError(err.error?.errorMessage || 'Erreur lors du chargement');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid || this.loading) return;

    this.loading = true;
    const currentUser = this.authService.getCurrentUser();
    const formData = {
      ...this.contactForm.value,
      user_id: currentUser?.id
    };

    const operation = this.isEditMode && this.contactId
      ? this.contactService.updateContact(this.contactId, formData)
      : this.contactService.createContact(formData);

    operation.subscribe({
      next: () => {
        this.showSuccess();
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.showError(err.error?.errorMessage || 'Erreur lors de la sauvegarde');
        this.loading = false;
      }
    });
  }

  private showSuccess() {
    this.snackBar.open(
      `Contact ${this.isEditMode ? 'modifié' : 'créé'} avec succès`, 
      'Fermer', 
      { duration: 3000 }
    );
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Fermer', { 
      duration: 5000,
      panelClass: ['error-snackbar'] 
    });
  }

  get first_name() { return this.contactForm.get('first_name'); }
  get last_name() { return this.contactForm.get('last_name'); }
  get email() { return this.contactForm.get('email'); }
  get phone() { return this.contactForm.get('phone'); }
  get photo() { return this.contactForm.get('photo'); }
}
