import gql from 'graphql-tag';

export default gql`mutation($createMeetingInput: CreateMeetingInput!){
  createMeeting(createMeetingInput: $createMeetingInput){
      _id
      roomId
      initiator{
          _id
          firstName
          lastName
          email
          type
      }
      participants{
          _id
          joinedAt
      }
      passCode
      endedAt
  }
}`;
