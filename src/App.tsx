import React from 'react';
import Peer from 'peerjs';
import Landing from 'pages/landing';
import Test from 'pages/test';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useInitApollo } from 'hooks/useInitApollo';
import { observer } from 'mobx-react';
import { useStores } from 'hooks/useStores';

// const id = (Math.random()*50).toString()
// console.log('id',id)
// const peer = new Peer(id, {host:'localhost', path:"/rooms", port: 3001 });
// const conn = peer.connect('another-peers-id');
// conn.on('open', () => {
//   conn.send('hi x 2!!, I am '+id);
// });

// peer.on('connection', (conn) => {
//   conn.on('data', (data) => {
//     // Will print 'hi!'
//     console.log(data);
//   });
//   conn.on('open', () => {
//     conn.send('hello! me is '+id);
//   });
// });

const App: React.FC = observer(() => {
  const { authStore } = useStores();
  const client = useInitApollo(authStore.currentToken, () => {
    // eslint-disable-next-line no-console
    console.warn('Clearing cookie...');
    authStore.logout();
  });

  return (
    <ApolloProvider client={client}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
      <div className="App">
        <Landing />
      </div>
    </ApolloProvider>
  );
});

export default App;
