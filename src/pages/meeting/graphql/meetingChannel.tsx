import gql from 'graphql-tag';

export default gql`
subscription($userId: ID!, $meetingId: ID!) {
  meetingChannel(userId: $userId, meetingId:$meetingId) {
    type
    from {
      _id
      nickname
      email
    }
    toMeeting {
      _id
      initiator{
        _id
        email
      }
    }
    message {
      sentAt
      content
    }
    userToBeKickedOut{
      _id
      nickname
    }
  }
}
`;
