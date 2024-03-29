import gql from 'graphql-tag';

export default gql`mutation($hostMeetingInput: HostMeetingInput!){
  hostMeeting(hostMeetingInput: $hostMeetingInput){
      _id
      roomId
      initiator{
        _id
        nickname
      }
      participants{
          _id
          nickname
          isLeft
      }
      passCode
      endedAt
  }
}`;
