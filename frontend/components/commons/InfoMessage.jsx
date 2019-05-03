import React from 'react';
import { Message, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const InfoMessage = ({ children, visible }) => {
  return (
    <Message info icon color="green" visible={visible}>
      <Icon name="info" />
      <Message.Content>{children}</Message.Content>
    </Message>
  );
};

InfoMessage.defaultProps = {
  visible: true
};

InfoMessage.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool
};

export default InfoMessage;
