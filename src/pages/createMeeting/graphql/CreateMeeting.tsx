import gql from 'graphql-tag';

export default gql`mutation($createMeetingInput: CreateMeetingInput!){
  createMeeting(createMeetingInput: $createMeetingInput){
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
