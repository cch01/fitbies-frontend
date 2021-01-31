import gql from 'graphql-tag';

export default gql`mutation($joinMeetingInput: JoinMeetingInput!){
  joinMeeting(joinMeetingInput:$joinMeetingInput){
      _id
      initiator{
          _id
          nickname
      }
      participants{
        _id
        isLeft
        nickname
      }
      roomId
      endedAt
  }
}`;
