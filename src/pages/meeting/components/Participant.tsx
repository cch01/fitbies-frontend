import React from 'react';
import Video from './video';

const Participant: React.FC<ParticipantProps> = ({ stream, ...props }) => {
  if (!stream) {
    return null;
  }

  return <Video stream={stream} {...props} autoPlay muted={false} />;
};

interface ParticipantProps {
  stream: any;
  [x: string]: any;
}

export default Participant;
