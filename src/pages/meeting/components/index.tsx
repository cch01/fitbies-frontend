import { PeerStreams } from 'hooks/useMeeting';
import React from 'react';
import ParticipantList from './ParticipantList';
import Video from './Video';

interface MeetingProps {
  localStream: MediaStream;
  peerStreams: PeerStreams;
}

const Meeting: React.FC<MeetingProps> = ({ localStream, peerStreams }) => (
  <div className="row">
    {localStream && (
    <Video stream={localStream} autoPlay muted />
    )}
    <div>
      <ParticipantList peerStreams={peerStreams} />
    </div>
  </div>
);

export default Meeting;