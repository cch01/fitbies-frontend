import gql from 'graphql-tag';

export default gql`mutation($token: String!){
  activateAccount(token:$token){
      _id
      isActivated
      activatedAt
  }
}`;
