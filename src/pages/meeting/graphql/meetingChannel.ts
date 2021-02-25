import gql from 'graphql-tag';

export default gql`
subscription($userId: ID!, $meetingId: String!) {
  meetingChannel(userId: $userId, meetingId: $meetingId) {
    type
    from {
      _id
      nickname
      email
    }
    toMeeting {
      _id
      meetingId
      initiator{
        _id
        nickname
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
