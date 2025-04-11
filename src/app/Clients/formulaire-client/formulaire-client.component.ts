import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, of, switchMap } from 'rxjs';
import { RequetesApiService } from '../../services/requetes-api.service';

@Component({
  selector: 'app-formulaire',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulaire-client.component.html',
  styleUrls: ['./formulaire-client.component.css']
})
export class FormulaireClientComponent implements OnInit {

  formu: string | null = '';
  id: string | null = '';
  name: string | null = '';
  email: string | null = '';
  phone: string | null = '';
  address: string | null = '';
  isCreateFormVisible = false;
  isModifierFormVisible = false;

  createClientForm: FormGroup;
  editClientForm: FormGroup;
  createErrorMessage = '';
  createSuccessMessage = '';
  editErrorMessage = '';
  editSuccessMessage = '';

  constructor(private fb: FormBuilder, private apiService: RequetesApiService) {
    // Initialisation des formulaires
    this.createClientForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });

    this.editClientForm = this.fb.group({
      clientId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    this.formu = urlParams.get('formu');
    this.id = urlParams.get('id');
    this.name = urlParams.get('name');
    this.email = urlParams.get('email');
    this.phone = urlParams.get('phone');
    this.address = urlParams.get('address');

    if (this.id) {
      const clientId = parseInt(this.id, 10);
      if (!isNaN(clientId)) {
        this.loadClientData(clientId);
      } else {
        console.error('ID de client invalide');
      }
    }

    if (this.formu === "0") {
      this.isCreateFormVisible = true;
    } else if (this.formu === "1") {
      this.isModifierFormVisible = true;
    }
  }

  loadClientData(clientId: number) {
    this.apiService.getCustomerById(clientId).pipe(
      catchError(err => {
        this.editErrorMessage = `Erreur: impossible de charger les données du client avec l'ID ${clientId}.`;
        this.editClientForm.reset();
        return of(null); // Retourner un observable vide
      })
    ).subscribe(client => {
      if (client) {
        this.editClientForm.patchValue({
          clientId: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          address: client.address,
        });
        this.editErrorMessage = '';
      }
    });
  }

  handleError(message: string) {
    this.createErrorMessage = message;
    this.createSuccessMessage = '';
  }

  handleSuccess(message: string) {
    this.createSuccessMessage = message;
    this.createErrorMessage = '';
  }

  onCreateSubmit(): void {
    const { name, email, phone, address } = this.createClientForm.value;

    this.apiService.createCustomer({ name, email, phone, address }).pipe(
      catchError(() => {
        this.handleError('Erreur lors de la création du client.');
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        this.handleSuccess('Client créé avec succès.');
        this.createClientForm.reset();
      }
    });
  }

  onEditSubmit(): void {
    const { clientId, name, email, phone, address } = this.editClientForm.value;

    this.apiService.updateCustomer(clientId, { name, email, phone, address }).pipe(
      catchError(() => {
        this.editErrorMessage = 'Erreur lors de la modification du client.';
        return of(null);
      })
    ).subscribe(() => {
      this.editSuccessMessage = 'Client modifié avec succès.';
      this.editErrorMessage = '';
      this.editClientForm.reset();
    });
  }

  onDelClient(): void {
    const { clientId } = this.editClientForm.value;

    if (!clientId) {
      this.editErrorMessage = 'Aucun client sélectionné pour suppression.';
      return;
    }

    this.apiService.deleteCustomer(clientId).pipe(
      catchError(() => {
        this.editErrorMessage = 'Erreur lors de la suppression du client.';
        return of(null);
      })
    ).subscribe(() => {
      this.editSuccessMessage = 'Client supprimé avec succès.';
      this.editErrorMessage = '';
      this.editClientForm.reset();
    });
  }

  onCreerClick(event: Event): void {
    event.preventDefault();
    window.location.href = `formulaire-client?formu=0`;
  }
}
