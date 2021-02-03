import gql from 'graphql-tag';

export default gql`
mutation($sendMeetingMessageInput: SendMeetingMessageInput! ){
  sendMeetingMessage(sendMeetingMessageInput: $sendMeetingMessageInput){
      content
      sentAt
  }
}
`;
