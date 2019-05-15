/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Message, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ error }) => {
  return (
    <Message error icon>
      <Icon name="warning circle" />
      {error && (
        <Message.Content>
          {error.networkError && (
            <p>
              Network error! Please check your internet connection and make sure to provide all
              required values.
            </p>
          )}
          {error.graphQLErrors && error.graphQLErrors.map((err, i) => <p key={i}>{err.message}</p>)}
        </Message.Content>
      )}
    </Message>
  );
};

ErrorMessage.defaultProps = {
  error: undefined
};

ErrorMessage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  error: PropTypes.object
};

export default ErrorMessage;
