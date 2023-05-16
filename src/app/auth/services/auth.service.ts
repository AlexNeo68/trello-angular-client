import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { CurrentUserInterface } from 'src/app/auth/types/current-user.interface';
import { LoginRequestInterface } from 'src/app/auth/types/login-request.interface';
import { RegisterRequestInterface } from 'src/app/auth/types/register-request.interface';
import { SocketService } from 'src/app/shared/services/socket.service';
import { generateApiUrl } from 'src/app/shared/utils/utils';

@Injectable()
export class AuthService {
  currentUser$ = new BehaviorSubject<CurrentUserInterface | null | undefined>(
    undefined
  );

  isLoggedIn$ = this.currentUser$.pipe(
    filter((currentUser) => currentUser !== undefined),
    map(Boolean)
  );

  constructor(
    private httpClient: HttpClient,
    private socketService: SocketService
  ) {}

  getCurrentUser(): Observable<CurrentUserInterface> {
    return this.httpClient.get<CurrentUserInterface>(generateApiUrl('user'));
  }

  setCurrentUser(currentUser: CurrentUserInterface | null): void {
    this.currentUser$.next(currentUser);
  }

  register(data: RegisterRequestInterface): Observable<CurrentUserInterface> {
    return this.httpClient.post<CurrentUserInterface>(
      generateApiUrl('users'),
      data
    );
  }

  login(data: LoginRequestInterface): Observable<CurrentUserInterface> {
    return this.httpClient.post<CurrentUserInterface>(
      generateApiUrl('users/login'),
      data
    );
  }

  setToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.setCurrentUser(null);
    this.socketService.disconnect();
  }
}
