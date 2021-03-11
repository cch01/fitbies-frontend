import gql from 'graphql-tag';

export default gql`
mutation($toggleParticipantMediaInput: ToggleParticipantMediaInput!){
    toggleParticipantMedia(toggleParticipantMediaInput: $toggleParticipantMediaInput){
        _id
        peerRoomId
        meetingId
        initiator{
            _id
            firstName
            lastName
            email
            type
        }
        videoOff
        muted
        participants{
            _id
            joinedAt
            muted
            videoOff
        }
        passCode
        endedAt
    }
}
`;
