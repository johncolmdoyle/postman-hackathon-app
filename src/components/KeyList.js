import React from 'react';
import Amplify from '@aws-amplify/core';
import { Auth } from '@aws-amplify/auth';
import API from '@aws-amplify/api';

import awsconfig from '../aws-exports';

Amplify.configure(awsconfig);
Auth.configure(awsconfig);
API.configure(awsconfig);

const KeyList = (props) => {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');

    const params = {
      body: {
        email: props.user.attributes.email.toLowerCase()
      },
    };

    API
      .post(awsconfig.aws_cloud_logic_custom[0].name, "/keys", params)
      .then(response => {
        console.log(JSON.stringify(response));

        props.setKeyState({ loadingKeys: true});

        API
         .get(awsconfig.aws_cloud_logic_custom[0].name, "/keys", {})
         .then(response => {
           props.setKeyState({ loadingKeys: false, keys: response.data });
           window.location.reload();
         })
        .catch(error => {
           window.location.reload();
          });
      })
      .catch(error => {
        window.location.reload();
      });
  }

  const { keys } = props;

  if (!keys || keys.length === 0) {
    return (
      <button onClick={handleClick}>
        Request API Key
      </button>
    );
  }

  return (
      <table className='apiTable'>
        <thead>
          <tr>
            <th>API Key</th>
            <th>Usage Plan</th>
            <th>Enabled?</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => {
            return (
              <tr key={key.key}>
                <td key={key.key}>{key.key}</td>
                <td key={key.usagePlanName}>{key.usagePlanName}</td>
                <td key={key.enabled.toString()}>{key.enabled.toString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
  );
};
export default KeyList;
