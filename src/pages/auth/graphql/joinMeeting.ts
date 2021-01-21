import gql from 'graphql-tag';

export default gql`mutation($joinMeetingInput: JoinMeetingInput!){
  joinMeeting(joinMeetingInput:$joinMeetingInput){
      _id
      initiator{
          _id
          firstName
          lastName
          email
      }
      participants{
          _id
          approvedAt
          leftAt
          isLeft
      }
      meetingInvitationToken 
      endedAt
      needApproval
  }
}`;
