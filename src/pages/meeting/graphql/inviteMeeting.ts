import gql from 'graphql-tag';

export default gql`
mutation($inviteMeetingInput: InviteMeetingInput!){
  inviteMeeting(inviteMeetingInput: $inviteMeetingInput){
              _id
              endedAt
      initiator{
          _id
          firstName
          lastName
          email
      }
      participants{
          _id
          joinedAt
          leftAt
          isLeft
      }
      roomId
      endedAt
  }
}




`;
