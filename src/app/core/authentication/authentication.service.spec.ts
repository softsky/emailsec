import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import { AuthenticationService, Credentials} from './authentication.service';

const sessionKey = 'credentials';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationService]
    });
  });

  beforeEach(inject([
    AuthenticationService
  ], (_authenticationService: AuthenticationService) => {
    authenticationService = _authenticationService;
  }));

  afterEach(() => {
    // Cleanup
    localStorage.removeItem(sessionKey);
    sessionStorage.removeItem(sessionKey);
  });

  describe('login', () => {
    it('should return credentials', fakeAsync(() => {
      // Act
      const request = authenticationService.login({
        username: 'toto',
        password: '123'
      });
      tick();

      // Assert
      request.subscribe(session => {
        expect(session).toBeDefined();
        expect(session.token).toBeDefined();
      });
    }));

    it('should authenticate user', fakeAsync(() => {
      expect(authenticationService.isAuthenticated()).toBe(false);

      // Act
      const request = authenticationService.login({
        username: 'toto',
        password: '123'
      });
      tick();

      // Assert
      request.subscribe(() => {
        expect(authenticationService.isAuthenticated()).toBe(true);
        expect(authenticationService.credentials).toBeDefined();
        expect(authenticationService.credentials).not.toBeNull();
        expect((<Credentials>authenticationService.credentials).token).toBeDefined();
        expect((<Credentials>authenticationService.credentials).token).not.toBeNull();
      });
    }));

    it('should persist credentials for the session', fakeAsync(() => {
      // Act
      const request = authenticationService.login({
        username: 'toto',
        password: '123'
      });
      tick();

      // Assert
      request.subscribe(() => {
        expect(sessionStorage.getItem(sessionKey)).not.toBeNull();
      });
    }));

    it('should persist credentials across sessions', fakeAsync(() => {
      // Act
      const request = authenticationService.login({
        username: 'toto',
        password: '123',
        remember: true
      });
      tick();

      // Assert
      request.subscribe(() => {
        expect(localStorage.getItem(sessionKey)).not.toBeNull();
      });
    }));
  });

  describe('logout', () => {
    it('should clear user authentication', fakeAsync(() => {
      // Arrange
      const loginRequest = authenticationService.login({
        username: 'toto',
        password: '123'
      });
      tick();

      // Assert
      loginRequest.subscribe(() => {
        expect(authenticationService.isAuthenticated()).toBe(true);

        const request = authenticationService.logout();
        tick();

        request.subscribe(() => {
          expect(authenticationService.isAuthenticated()).toBe(false);
          expect(authenticationService.credentials).toBeNull();
          expect(sessionStorage.getItem(sessionKey)).toBeNull();
          expect(localStorage.getItem(sessionKey)).toBeNull();
        });
      });
    }));

    it('should clear persisted user authentication', fakeAsync(() => {
      // Arrange
      const loginRequest = authenticationService.login({
        username: 'toto',
        password: '123',
        remember: true
      });
      tick();

      // Assert
      loginRequest.subscribe(() => {
        expect(authenticationService.isAuthenticated()).toBe(true);

        const request = authenticationService.logout();
        tick();

        request.subscribe(() => {
          expect(authenticationService.isAuthenticated()).toBe(false);
          expect(authenticationService.credentials).toBeNull();
          expect(sessionStorage.getItem(sessionKey)).toBeNull();
          expect(localStorage.getItem(sessionKey)).toBeNull();
        });
      });
    }));
  });
});
