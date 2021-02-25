import gql from 'graphql-tag';

export default gql`
mutation($inviteMeetingInput: InviteMeetingInput!){
  inviteMeeting(inviteMeetingInput: $inviteMeetingInput){
      _id
      meetingId
  }
}




`;
