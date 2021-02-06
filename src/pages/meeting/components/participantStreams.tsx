import React from 'react';
import { useMediaQuery } from 'react-responsive';
import Video from './video';

interface ParticipantStreamsProps {
  peerStreams: {[x: string]: MediaStream};
}

const ParticipantStreams: React.FC<ParticipantStreamsProps> = ({ peerStreams }) => {
  console.log('stream length', peerStreams.length);
  const isMobile = useMediaQuery({
    query: '(max-width: 719px)',
  });
  return (
    <div className="flex-row flex-1 flex-space-evenly">
      {Object.keys(peerStreams).map((userId) => {
        if (!peerStreams[userId]) {
          return null;
        }
        return <div key={userId} className="object-fit-fill overflow-hidden border-radius border-white m1"><Video className="border-radius overflow-hidden" stream={peerStreams[userId]} autoPlay muted={false} /></div>;
      })}
    </div>
  );
};

export default ParticipantStreams;

const Participant: React.FC<ParticipantProps> = ({ stream, ...props }) => {
  if (!stream) {
    return null;
  }
  return <Video className="min-width-100p min-height-100p width-auto height-auto" stream={stream} {...props} autoPlay muted={false} />;
};
interface ParticipantProps {
  stream: any;
  [x: string]: any;
}
