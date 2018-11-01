import React, { Component } from 'react';
import { graphql, compose, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

import { Route } from 'react-router-dom';

import Chatbox from './components/Chatbox';
import ChatCard from './components/ChatCard';
import ContextCards from './components/ContextCards';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      from: this.props.mode,
      to: (this.props.mode !== 'Customer' ? 'Customer' : 'Jo'),
      all_chats: [],
      selected_chat: this.props.mode === 'Customer' ? 'Customer' : null,
      visible_messages: [],
      context_cards: []
    };

    this.currentSubscription = null;

  }

  componentDidMount() {
    if(this.props.mode === 'Jo'){
      this._subscribeToNewChats(this._newMessageReceived);
      this._get_chat_list();
    }else{
      this._get_customer_chats();
    }
  }

  _get_chat_list = async() => {
    let chatList = await this.props.client.query({ query: ALL_CHATS_QUERY });
    console.log(chatList.data.allChats);
    let s = [];
    let all_chats = [];
    for(var chat of chatList.data.allChats){
      if(!s.includes(chat.from)) {
        all_chats.push(chat)
        s.push(chat.from)
      }
    }
    this.setState({all_chats});
  }

  _get_customer_chats = async () => {
    const { client } = this.props
    const callback = this._appendMessages;

    const test = client.query({
      query: CUSTOMER_CHATS_QUERY,
      variables: { personName: this.state.from }
    }).then(response => {
      callback(response, "init");

      //Set Up Subscription
      this.currentSubscription = client.subscribe({
        query: SUB_CUSTOMER_CHATS_QUERY,
        variables: { personName: this.state.from}
      }).subscribe({
          next(response) {
            callback(response.data.Chat.node);
          },
          error(err) {
            console.error('err', err);
          }
        })

    });
  }

  _newMessageReceived = (message) => {
    const { selected_chat } = this.state;
    if(
        (message.from === selected_chat) ||
        (message.from === 'Jo' && message.to === selected_chat)
      ){
        this._appendMessages(message)
    }
  }

  __appendMessages = (message) => {
    this.setState((prevState) => {
      const { visible_messages } = prevState;
      visible_messages.push(message);
      return {visible_messages};
    })
  }

  _parse_system_messages = (message) => {
    console.log('-->', message);
    return JSON.parse(message[0].content.slice(1,-1));
  }

  _appendMessages = (messages, mode) => {

    switch (mode) {
      case "init":
        //Get invisible_messages from history
        let invisible_messages = messages.data.allChats.filter(
          message => {
            return message.content.startsWith("{[{")
          }
        );
        console.log('invisible_messages', invisible_messages);
        let last_invisible =  invisible_messages.slice(-1);
        console.log('last inv', last_invisible);
        let context_cards = this._parse_system_messages(last_invisible);
        let visible_messages = messages.data.allChats.filter(message => { return !message.content.startsWith("{[") });

        //Set messages that need to be displayed
        this.setState({
          visible_messages,
          context_cards
        });
        break;
      default:
        this.setState((prevState) => {
          const { visible_messages, context_cards } = prevState;
          if(messages.content.startsWith("{[")){
            return {context_cards: this._parse_system_messages([messages])};
          } else {
            visible_messages.push(messages);
            return {visible_messages};
          }
        })

    }

  }


  _subscribeToNewChats = (callback) => {


    const { client } = this.props

    this.currentSubscription = client.subscribe({
      query: SUBSCRIPTION_QUERY,
    }).subscribe({
        next(response) {
          callback(response.data.Chat.node);
        },
        error(err) {
          console.error('err', err);
        }
      })
  };

  _createChat = async e => {
    if (e.key === 'Enter') {
      const { content, from, to } = this.state;
      await this.props.createChatMutation({
        variables: { content, from, to }
      });
      this.setState({ content: '' });
    }
  };

  handle_chat_select = personName => {
    const { client } = this.props
    client.query({query: SELECTED_CHATS_QUERY, variables: { from: personName }})
    .then(response => {
      console.log(response);
        this.setState({
            selected_chat: personName,
            to: personName,
            visible_messages: response.data.allChats
          })
        }
    );
  }

  render() {

    const { all_chats, visible_messages, context_cards, to } = this.state;

    return (
      <div className="">

        <Route exact path="/operator" render={(props) => (
          <div className="chat-list-container clearfix">
            <div className="people-list">
              <ul className="list">

                {all_chats.map(person => (
                  <ChatCard key={person.createdAt} person={person} onclick={this.handle_chat_select} />
                ))}

              </ul>
            </div>
          </div>

        )} />
        <div className="container">
          <div>
            <h2>Talking with: <strong>{to}</strong></h2>
            <Chatbox mode={this.props.mode} chats={visible_messages} changecontext={this.handle_context_set} />
            <input
              value={this.state.content}
              onChange={e => this.setState({ content: e.target.value })}
              type="text"
              placeholder="Start typing"
              onKeyPress={this._createChat}
            />
          </div>
        </div>
        <div className="contextWindow">
          <p>Context:</p>
          <ContextCards cards={context_cards} />
        </div>
      </div>
    );
  }
}

const ALL_CHATS_QUERY = gql`
  query ChatListQuery {
    allChats (
      filter: {to: "Jo"},
      orderBy: createdAt_ASC
    ) {
      createdAt
      from
      id
    }
  }
`;

const SELECTED_CHATS_QUERY = gql`
  query SelectedChatsQuery($from: String!) {
    allChats (filter: {
    OR: [
    {from: $from},
    {to: $from}
    ]}) {
      id
      createdAt
      from
      to
      content
    }
  }
`;

const CUSTOMER_CHATS_QUERY = gql`
  query CustomerChatsQuery($personName: String!) {
    allChats (filter: {
    OR: [
    {from: $personName},
    {to: $personName}
    ]}) {
      id
      createdAt
      from
      to
      content
    }
  }
`;

const SUB_CUSTOMER_CHATS_QUERY = gql`
  subscription($personName: String!) {
    Chat(
      filter: {
        mutation_in: [CREATED]
          OR: [
            {node: { from: $personName}},
            {node: { to: $personName}},
          ]
      }){
      node {
        id
        from
        to
        content
        createdAt
      }
    }
  }
`;

const CREATE_CHAT_MUTATION = gql`
  mutation CreateChatMutation($content: String!, $from: String!, $to: String!) {
    createChat(content: $content, from: $from, to: $to) {
      id
      createdAt
      from
      to
      content
    }
  }
`;

const SUBSCRIPTION_QUERY = gql`
  subscription {
    Chat(filter: { mutation_in: [CREATED] }) {
      node {
        id
        from
        to
        content
        createdAt
      }
    }
  }
`;


export default compose(
  graphql(CREATE_CHAT_MUTATION, { name: 'createChatMutation' })
)(App);
