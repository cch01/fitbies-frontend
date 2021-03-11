import gql from 'graphql-tag';

export default gql`mutation($hostMeetingInput: HostMeetingInput!){
  hostMeeting(hostMeetingInput: $hostMeetingInput){
      _id
      peerRoomId
      meetingId
      videoOff
      muted
      initiator{
        _id
        nickname
      }
      participants{
          _id
          nickname
          isLeft
          muted
          videoOff
      }
      passCode
      endedAt
  }
}`;
