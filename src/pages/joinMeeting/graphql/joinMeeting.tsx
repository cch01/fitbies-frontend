import gql from 'graphql-tag';

export default gql`mutation($joinMeetingInput: JoinMeetingInput!){
  joinMeeting(joinMeetingInput:$joinMeetingInput){
      _id
      initiator{
          _id
          nickname
          email
      }
      roomId
      endedAt
  }
}`;
