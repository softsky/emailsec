interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: '8Vxwltha1La3uqXooU0FsIqRFeSG1Bxr',
  domain: 'softsky.eu.auth0.com',
  callbackURL: 'http://localhost:4200/callback'
};
