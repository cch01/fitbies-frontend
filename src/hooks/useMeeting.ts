import Peer from 'peerjs';
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import * as _ from 'lodash';

const PORT = parseInt(process.env.REACT_APP_PEER_SERVER_PORT!, 10) || undefined;
const KEY = process.env.REACT_APP_PEER_SERVER_KEY;
console.log('key, ', KEY);
interface UsePeerProps {
  userId: string;
  targetId: string;
  localMediaStream?: MediaStream;
  isInitiator: boolean;
  addVideoStream: (connectorId: string, stream: MediaStream) => void;
  addCallObject: (userId: string, call: Peer.MediaConnection) => void;
  onPeerConnected: (peer: Peer) => void;
}

interface UseMeetingOutput {
  loading: boolean;
  peer: Peer | undefined;
}

export const useMeeting = ({
  isInitiator, localMediaStream, targetId, userId, addVideoStream, addCallObject, onPeerConnected,
}: UsePeerProps): UseMeetingOutput => {
  const [loading, setLoading] = useState(true);
  const [peer, setPeer] = useState<Peer>();

  const peerId = isInitiator ? targetId : userId;
  useEffect(() => {
    if (!_.isEmpty(localMediaStream?.id)) {
      console.log('set new peer');
      setPeer(new Peer(peerId, {
        key: KEY, host: 'localhost', path: '/meetings', port: PORT,
      }));
    }
    return peer?.destroy();
  }, [localMediaStream?.id]);

  peer?.on('open', (id) => {
    isInitiator
      ? console.log(`this is initiator ${userId}, roomId: ${id}`)
      : console.log(`this is joiner ${userId}, identity: ${id}`);
    onPeerConnected(peer);
    setLoading(false);
  });
  peer?.on('error', (error) => {
    console.error(error);
  });
  peer?.on('close', () => {
    console.log('Connection closed');
  });
  peer?.on('call', (call) => {
    console.log('someone connected');
    call.answer(localMediaStream);
    const { connectorId } = call.metadata;
    console.log(`${connectorId} is connected`);
    call.on('stream', (stream) => {
      console.log('stream', stream);
      addVideoStream(connectorId, stream);
    });
    call.on('close', () => {
      console.log(`Media streaming with ${connectorId} closed!`);
    });
    addCallObject(connectorId, call);
  });

  return {
    loading,
    peer,
  };
};
