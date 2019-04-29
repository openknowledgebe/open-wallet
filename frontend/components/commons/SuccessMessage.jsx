import React from 'react';
import { Message, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const SuccessMessage = ({ message }) => {
  return (
    <Message success icon>
      <Icon name="checkmark" />
      <Message.Content>{message}</Message.Content>
    </Message>
  );
};

SuccessMessage.propTypes = {
  message: PropTypes.string.isRequired
};

export default SuccessMessage;
