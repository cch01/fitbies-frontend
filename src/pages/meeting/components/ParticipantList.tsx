import React from 'react';
import { PeerStreams } from 'hooks/useMeeting';
import styles from './ParticipantList.module.scss';
import Participant from './Participant';

interface ParticipantListProps {
  peerStreams: PeerStreams;
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
