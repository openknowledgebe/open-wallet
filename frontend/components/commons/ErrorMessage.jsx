import React from 'react';
import { Message, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ error }) => {
  return (
    <Message error icon>
      <Icon name="warning circle" />
      {error && (
        <Message.Content>
          <p>{error.message}</p>
          <p>Please make sure to provide all required fieds.</p>
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
