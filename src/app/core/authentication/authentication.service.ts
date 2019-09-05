import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AUTH_CONFIG } from './auth0-variables';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';

(window as any).global = window;

export interface Credentials {
  // Customize received credentials here
  username: string;
  token: string;
  expiresIn?: number;
  accessToken?: string;
  idToken?: string;
}

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

const sessionKey = 'session';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {

  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: 'token id_token',
    redirectUri: AUTH_CONFIG.callbackURL
  });

  private savedSession: Credentials | null;

  constructor(
    public router: Router
  ) {
    const savedCredentials = sessionStorage.getItem(sessionKey) || localStorage.getItem(sessionKey);
    if (savedCredentials) {
      this.savedSession = JSON.parse(savedCredentials);
    }
  }

  signup(): void {
    this.auth0.authorize({mode: 'signUp'});
  }
  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(): Observable<boolean> {
    // this.setCredentials(data, context.remember);
    this.auth0.authorize({mode: 'login'});
    return of(true);
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials();
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
    return of(true);
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult: any) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setCredentials(authResult);
        this.router.navigate(['/home']);
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.session;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get session(): Credentials | null {
    return this.savedSession ;
  }
  set session(session: Credentials) {
    this.savedSession  = session;
  }

  /**
   * Sets the user session.
   * The session may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the session are only persisted for the current session.
   * @param session The user session.
   * @param remember True to remember session across sessions.
   */
  private setCredentials(session?: Credentials, remember?: boolean) {
    this.savedSession = session || null;

    if (session) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(sessionKey, JSON.stringify(session));
      const expiresAt = JSON.stringify((session.expiresIn * 1000) + new Date().getTime());
      localStorage.setItem('access_token', session.accessToken);
      localStorage.setItem('id_token', session.idToken);
      localStorage.setItem('expires_at', expiresAt);
    } else {
      sessionStorage.removeItem(sessionKey);
      localStorage.removeItem(sessionKey);
    }
  }
}
