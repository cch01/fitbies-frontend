import gql from 'graphql-tag';

export default gql`
mutation($toggleMeetingMediaInput: ToggleMeetingMediaInput!){
    toggleMeetingMedia(toggleMeetingMediaInput: $toggleMeetingMediaInput){
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
        muted
        videoOff
        participants{
            _id
            joinedAt
            videoOff
            muted
        }
        passCode
        endedAt
    }
}
`;
