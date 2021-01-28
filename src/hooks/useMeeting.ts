import Peer from 'peerjs';
import { useState } from 'react';
import * as _ from 'lodash';

const PORT = parseInt(process.env.REACT_APP_PEER_SERVER_PORT!, 10) || undefined;
const KEY = process.env.REACT_APP_PEER_SERVER_KEY;
console.log('key, ', KEY);
interface UsePeerProps {
  userId: string;
  targetId: string;
  localMediaStream?: MediaStream;
  isInitiator: boolean
}

interface CallsState{
  [x:string]: Peer.MediaConnection
}

export interface PeerStreams {
  [x:string]: MediaStream
}

export const useMeeting = ({
  isInitiator, localMediaStream, targetId, userId,
}: UsePeerProps) => {
  const [peerStreams, setPeerStreams] = useState<PeerStreams>({});
  const [calls, setCalls] = useState<CallsState>({});
  const addVideoStream = (stream: MediaStream, connectorId: string) => {
    setPeerStreams((val) => ({ ...val, [connectorId]: stream }));
  };

  const removeVideoStream = (id: string) => {
    setPeerStreams((val) => _.omit(val, [id]));
  };
  // creating identity
  const peer = new Peer(isInitiator ? targetId : userId, {
    key: KEY, host: 'localhost', path: '/meetings', port: PORT,
  });
  peer.on('open', (id) => {
    isInitiator
      ? console.log(`this is initiator ${userId}, roomId: ${id}`)
      : console.log(`this is joiner ${userId}, identity: ${id}`);
  });
  peer.on('error', (error) => {
    console.error(error);
  });

  peer.on('close', () => {
    console.log('Connection closed');
  });

  peer.on('call', (call) => {
    call.answer(localMediaStream);
    const { connectorId } = call.metadata;
    console.log(`${connectorId} is connected`);
    call.on('stream', (stream) => addVideoStream(stream, connectorId));
    call.on('close', () => {
      console.log(`Media streaming with ${connectorId} closed!`);
    });
  });

  const closeConnection = (): void => { peer.disconnect(); };

  const closePeerConnection = (id: string) => {
    console.log(`closing media connection with ${id}`);
    calls[id].close();
    setCalls((val) => _.omit(val, [id]));
  };
  const connectToPeer = (userPeer: Peer, designatedId: string):void => {
    console.log(`Connecting to ${designatedId}...`);
    console.log(userPeer);
    const call = userPeer.call(designatedId, localMediaStream!, { metadata: { connectorId: userId } });
    console.log(call);
    call.on('stream', (stream) => addVideoStream(stream, designatedId));

    call.on('close', () => {
      console.log(`media stream connection with ${designatedId} closed`);
    });

    setCalls((val) => ({ ...val, ...{ [designatedId]: call } }));
  };

  return {
    removeVideoStream, connectToPeer, closeConnection, closePeerConnection, peer, peerStreams,
  };
};
