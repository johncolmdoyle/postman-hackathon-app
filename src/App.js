import React, { useEffect, useState } from 'react';
import './App.css';
import KeyList from './components/KeyList';

import withListLoading from './components/withListLoading';

import Amplify from '@aws-amplify/core';
import { Auth } from '@aws-amplify/auth';
import API from '@aws-amplify/api';
import { AmplifyAuthenticator, AmplifyForgotPassword, AmplifySignIn, AmplifySignOut, AmplifySignUp } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
Auth.configure(awsconfig);
API.configure(awsconfig);

function AmplifySetup() {
  return (
    <AmplifyAuthenticator >
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

function App() {
  const KeysLoading = withListLoading(KeyList);

  const [keyState, setKeyState] = useState({
    loadingKeys: false,
    keys: null
  });

  let previousAuthState = useState();

  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    setKeyState({ loadingKeys: true});

    onAuthUIStateChange((nextAuthState, authData) => {
      if (nextAuthState === "confirmSignUp") {
        previousAuthState = nextAuthState;
      }
      if (previousAuthState === "confirmSignUp" && nextAuthState === "signedin") {
        previousAuthState = ""
        window.location.reload();
      }

      setAuthState(nextAuthState);
      setUser(authData);
    });

    API
      .get(awsconfig.aws_cloud_logic_custom[0].name, "/keys", {})
      .then(response => {
        setKeyState({ loadingKeys: false, keys: response });
      })
      .catch(error => {
        console.log(error.response);
      });
  }, [setKeyState]);

  return authState === AuthState.SignedIn && user ? (
    <div className='App'>
      <div className='container'>
        <div className='titleText'>
          <h1>API-Network Keys</h1>
        </div>
        <div className='signoutButton'>
          <AmplifySignOut />
        </div>
      </div>
      <div className='clear'></div>
      <div className='repo-container'>
        <h2 className='list-head'>Issued API Key</h2>
        <h3 className='list-head'>{ user.attributes.email.toLowerCase() }</h3>
        <KeysLoading isLoading={keyState.loadingKeys} keys={keyState.keys} user={user} />
      </div>
    </div> ) : ( <AmplifySetup /> );
}

export default App;
