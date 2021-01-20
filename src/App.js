import React from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, AmplifyForgotPassword, AmplifySignIn, AmplifySignOut, AmplifySignUp } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const AuthStateApp = () => {
    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();

    React.useEffect(() => {
        onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);

    return authState === AuthState.SignedIn && user ? (
      <div className="App">
          <div>Hello, {user.username}</div>
          <AmplifySignOut />
      </div>
    ) : (
<AmplifyAuthenticator>
    <AmplifyForgotPassword
        headerText="Reset Password"
        slot="forgot-password"
        usernameAlias="email"
      />
    <AmplifySignIn
      headerText="Sign In To Manage Your API Key"
      formFields={[
        {
          type: 'email',
          label: 'Email',
          required: true
        },
        {
          type: 'password',
          label: 'Password',
          placeholder: 'Password',
          required: true
        },
      ]}
      slot="sign-in"
    />
    <AmplifySignUp
      headerText="Sign Up"
      formFields={[
        {
          type: 'username',
          label: 'Email',
          placeholder: 'Enter your email address',
          required: true,
        },
        {
          type: 'password',
          label: 'Password',
          placeholder: 'Password',
          required: true,
        },
      ]}
      slot="sign-up"
    />
  </AmplifyAuthenticator>
  );
}

export default AuthStateApp;
