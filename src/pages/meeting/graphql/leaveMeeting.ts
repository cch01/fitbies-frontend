import gql from 'graphql-tag';

export default gql`
mutation($meetingId: ID! $userId: ID!){
  leaveMeeting(meetingId: $meetingId, userId:$userId){
      _id
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
      blockList
      endedAt
      roomId
  }
}
`;
