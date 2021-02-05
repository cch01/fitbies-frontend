import gql from 'graphql-tag';

export default gql`
mutation($meetingId: ID!, $userId:ID!){
  endMeeting(meetingId: $meetingId, userId: $userId){
      _id
      initiator{
          _id
          email
      }
      endedAt
      roomId
      participants{
          _id
          joinedAt
          leftAt
          isLeft
      }
  }
}
`;
