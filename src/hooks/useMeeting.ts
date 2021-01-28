import Peer from 'peerjs';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
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

interface UseMeetingResult {
  removeVideoStream:(id: string) => void;
  connectToPeer: (designatedId: string) => void;
  closeConnection: () => void;
  closePeerConnection: (id: string) => void;
  peer: Peer;
  peerStreams: PeerStreams,

}
interface UseMeetingOutput {
  loading: boolean;
  result?: UseMeetingResult
}

export interface PeerStreams {
  [x:string]: MediaStream
}

export const useMeeting = ({
  isInitiator, localMediaStream, targetId, userId,
}: UsePeerProps): UseMeetingOutput => {
  const [peerStreams, setPeerStreams] = useState<PeerStreams>({});
  const [calls, setCalls] = useState<CallsState>({});
  const [loading, setLoading] = useState(true);
  const [peer, setPeer] = useState<Peer>();
  console.log('rerender in useMeeting');
  console.log('media', localMediaStream);

  // creating identity
  const peerId = isInitiator ? targetId : userId;
  useEffect(() => {
    if (!_.isEmpty(localMediaStream?.id)) {
      setPeer(new Peer(peerId, {
        key: KEY, host: 'localhost', path: '/meetings', port: PORT,
      }));
    }
  }, [localMediaStream?.id]);

  if (!peer) {
    return { loading, result: undefined };
  }
  const addVideoStream = (stream: MediaStream, connectorId: string) => {
    setPeerStreams((val) => ({ ...val, [connectorId]: stream }));
  };

  peer.on('open', (id) => {
    isInitiator
      ? console.log(`this is initiator ${userId}, roomId: ${id}`)
      : console.log(`this is joiner ${userId}, identity: ${id}`);
    setLoading(false);
  });
  peer.on('error', (error) => {
    console.error(error);
  });
  peer.on('close', () => {
    console.log('Connection closed');
  });
  peer.on('call', (call) => {
    console.log('someone connected');
    call.answer(localMediaStream);
    const { connectorId } = call.metadata;
    console.log(`${connectorId} is connected`);
    call.on('stream', (stream) => {
      console.log('stream', stream);
      addVideoStream(stream, connectorId);
    });
    call.on('close', () => {
      console.log(`Media streaming with ${connectorId} closed!`);
    });
  });

  const closeConnection = (): void => { peer.disconnect(); };

  const removeVideoStream = (id: string) => {
    setPeerStreams((val) => _.omit(val, [id]));
  };

  const closePeerConnection = (id: string): void => {
    console.log(`closing media connection with ${id}`);
    calls[id].close();
    setCalls((val) => _.omit(val, [id]));
  };
  const connectToPeer = (designatedId: string):void => {
    console.log(`Connecting to ${designatedId}...`);
    // console.log(userPeer);
    const call = peer.call(designatedId, localMediaStream!, { metadata: { connectorId: userId } });
    console.log(call);
    call.on('stream', (stream) => {
      console.log('stream coming');
      setInterval(() => console.log(stream), 5000);
      // addVideoStream(stream, designatedId);
    });

    call.on('close', () => {
      console.log(`media stream connection with ${designatedId} closed`);
    });

    // setCalls((val) => ({ ...val, ...{ [designatedId]: call } }));
  };

  return {
    loading,
    result: {
      removeVideoStream, connectToPeer, closeConnection, closePeerConnection, peer, peerStreams,
    },
  };
};
