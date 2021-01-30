import gql from 'graphql-tag';

export default gql`mutation($joinMeetingInput: JoinMeetingInput!){
  joinMeeting(joinMeetingInput:$joinMeetingInput){
      _id
      initiator{
          _id
          nickname
          firstName
          lastName
          email
      }
      participants{
          _id
          leftAt
          isLeft
      }
      endedAt
      needApproval
  }
}`;
