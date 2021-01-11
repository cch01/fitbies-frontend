import React from 'react';
import Peer from 'peerjs';
import Landing from 'pages/landing';
import Test from 'pages/test';
import { BrowserRouter as Router, Route } from 'react-router-dom';

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

const App: React.FC = () => (
  <React.StrictMode>
    <Router>
      <div className="App">
        <Landing />
      </div>
    </Router>
  </React.StrictMode>
);

export default App;
