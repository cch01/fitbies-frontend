import Peer from 'peerjs';
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import * as _ from 'lodash';

const PORT = parseInt(process.env.REACT_APP_PEER_SERVER_PORT!, 10) || undefined;
const KEY = process.env.REACT_APP_PEER_SERVER_KEY;
console.log('key, ', KEY);
interface UsePeerProps {
  streamLoading: boolean;
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
  peer: Peer | undefined;
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
  isInitiator, localMediaStream, targetId, userId, streamLoading,
}: UsePeerProps): UseMeetingOutput => {
  const [peerStreams, setPeerStreams] = useState<PeerStreams>({});
  const [calls, setCalls] = useState<CallsState>({});
  const [loading, setLoading] = useState(true);
  const [peer, setPeer] = useState<Peer>();

  // creating identity
  const peerId = isInitiator ? targetId : userId;
  useEffect(() => {
    console.log('stream changed');
    if (!_.isEmpty(localMediaStream?.id)) {
      console.log('set new peer');
      setPeer(new Peer(peerId, {
        key: KEY, host: 'localhost', path: '/meetings', port: PORT,
      }));
    }
  }, [localMediaStream?.id]);

  const addVideoStream = (stream: MediaStream, connectorId: string) => {
    setPeerStreams((val) => ({ ...val, [connectorId]: stream }));
  };

  peer?.on('open', (id) => {
    isInitiator
      ? console.log(`this is initiator ${userId}, roomId: ${id}`)
      : console.log(`this is joiner ${userId}, identity: ${id}`);
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
      addVideoStream(stream, connectorId);
    });
    call.on('close', () => {
      console.log(`Media streaming with ${connectorId} closed!`);
    });
  });

  const closeConnection = useMemo(() => (): void => { peer?.disconnect(); }, [peer]);

  const removeVideoStream = (id: string) => {
    setPeerStreams((val) => _.omit(val, [id]));
  };

  const closePeerConnection = useMemo(() => (id: string): void => {
    console.log(`closing media connection with ${id}`);
    calls[id].close();
    setCalls((val) => _.omit(val, [id]));
  }, [calls]);

  const connectToPeer = useMemo(() => (designatedId: string):void => {
    console.log(`Connecting to ${designatedId}...`);
    const call = peer?.call(designatedId, localMediaStream!, { metadata: { connectorId: userId } });
    console.log(call);
    call?.on('stream', (stream) => {
      console.log('stream coming');
      addVideoStream(stream, designatedId);
    });

    call?.on('close', () => {
      console.log(`media stream connection with ${designatedId} closed`);
    });

    call && setCalls((val) => ({ ...val, ...{ [designatedId]: call } }));
  }, [peer]);

  return {
    loading,
    result: {
      removeVideoStream, connectToPeer, closeConnection, closePeerConnection, peer, peerStreams,
    },
  };
};
