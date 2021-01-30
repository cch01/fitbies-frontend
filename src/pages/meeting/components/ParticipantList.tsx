import React from 'react';
import styles from './ParticipantList.module.scss';
import Participant from './Participant';

interface ParticipantListProps {
  peerStreams: {[x: string]: MediaStream};
}

const ParticipantList: React.FC<ParticipantListProps> = ({ peerStreams }) => (
  <div className={styles.participant}>
    {Object.keys(peerStreams).map((userId) => (
      <Participant
        key={userId}
        stream={peerStreams[userId] || null}
      />
    ))}
  </div>
);

export default ParticipantList;
