import gql from 'graphql-tag';

export default gql`
mutation($meetingId: String! $userId: ID!){
  leaveMeeting(meetingId: $meetingId, userId:$userId){
      _id
      meetingId
  }
}
`;
