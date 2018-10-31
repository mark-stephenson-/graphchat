import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import MainLayout from './components/MainLayout';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, split } from 'apollo-client-preset';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import { BrowserRouter } from 'react-router-dom';

const wsLink = new WebSocketLink({
  uri: 'wss://subscriptions.graph.cool/v1/cjnkoms5n99cn01816lkc3qdu',
  options: {
    reconnect: true
  }
})

const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cjnkoms5n99cn01816lkc3qdu' })

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink,
)


const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: { query: { fetchPolicy: 'network-only' } }
})


ReactDOM.render(

  <BrowserRouter>
    <ApolloProvider client={client}>
      <MainLayout />
      </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
