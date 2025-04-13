import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Router } from '@angular/router';
import { Contact } from '../../models/contact.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    FormsModule,
    RouterModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  contacts: Contact[] = [];
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  loading = false;

  constructor(
    private contactService: ContactService,
    public router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.loading = true;
    this.contactService.getContacts(this.currentPage, this.searchTerm)
      .subscribe({
        next: (response) => {
          this.contacts = response.data;
          this.totalItems = response.pagination.total;
          this.loading = false;
        },
        error: (err) => {
          this.showError(err.error?.errorMessage || 'Erreur de chargement');
          this.loading = false;
        }
      });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadContacts();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.loadContacts();
  }

  deleteContact(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce contact ?')) {
      this.contactService.deleteContact(id).subscribe({
        next: () => {
          this.showSuccess('Contact supprimé');
          this.loadContacts();
        },
        error: (err) => this.showError(err.error?.errorMessage || 'Erreur de suppression')
      });
    }
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Fermer', { duration: 3000 });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Fermer', { 
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}