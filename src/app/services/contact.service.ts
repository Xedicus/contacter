import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

interface ContactResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  photo?: string;
  user_id: number;
}

interface PaginatedContactResponse {
  data: ContactResponse[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

interface ContactOperationResponse {
  message: string;
  contact?: ContactResponse;
}

type ContactCreateRequest = Omit<ContactResponse, 'id'>;
type ContactUpdateRequest = Partial<ContactResponse>;

@Injectable({ providedIn: 'root' })
export class ContactService {
  private apiUrl = 'https://www.api.4gul.kanemia.com/contacts';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): { [header: string]: string } {
    return {
      'Authorization': this.authService.getAuthorizationHeader(),
      'Content-Type': 'application/json'
    };
  }

  getContact(id: number): Observable<ContactResponse> {
    return this.http.get<ContactResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getContacts(page: number = 1, search: string = ''): Observable<PaginatedContactResponse> {
    let params = new HttpParams().set('page', page.toString());
    if (search) params = params.set('search', search);

    return this.http.get<PaginatedContactResponse>(this.apiUrl, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  createContact(contactData: ContactCreateRequest): Observable<ContactOperationResponse> {
    const user = this.authService.getCurrentUser();
    const dataWithUserId = { ...contactData, user_id: user?.id };
    
    return this.http.post<ContactOperationResponse>(
      this.apiUrl, 
      dataWithUserId,
      { headers: this.getAuthHeaders() }
    );
  }

  updateContact(id: number, contactData: ContactUpdateRequest): Observable<ContactOperationResponse> {
    return this.http.put<ContactOperationResponse>(
      `${this.apiUrl}/${id}`,
      contactData,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteContact(id: number): Observable<ContactOperationResponse> {
    return this.http.delete<ContactOperationResponse>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getCurrentUserContacts(): Observable<ContactResponse[]> {
    const user = this.authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    return this.http.get<ContactResponse[]>(`${this.apiUrl}?user_id=${user.id}`, {
      headers: this.getAuthHeaders()
    });
  }
}