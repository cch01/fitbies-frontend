import React from 'react';
import styles from './participantList.module.scss';
import Video from './video';

interface ParticipantListProps {
  peerStreams: {[x: string]: MediaStream};
}

const ParticipantList: React.FC<ParticipantListProps> = ({ peerStreams }) => (
  <div className={styles.participant}>
    {Object.keys(peerStreams).map((userId) => {
      if (!peerStreams[userId]) {
        return null;
      }
      return <Video className="width-auto height-auto height-100p border-radius overflow-hidden m2" key={userId} stream={peerStreams[userId]} autoPlay muted={false} />;
    })}
  </div>
);

export default ParticipantList;

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
