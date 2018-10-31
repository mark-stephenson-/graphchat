import React from 'react';
//import './ChatContainer.css';
//import customerChat from './CustomerChat';
import App from '../App';
import { ApolloConsumer } from 'react-apollo';

const ChatContainer = ({mode}) => (
  <ApolloConsumer>
    {client => (
      <App mode={mode} client={client} />
    )}
  </ApolloConsumer>
)

export default ChatContainer;
