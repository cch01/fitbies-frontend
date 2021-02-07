import gql from 'graphql-tag';

export default gql`mutation($anonymousSignUpInput: AnonymousSignUpInput!){
  anonymousSignUp(anonymousSignUpInput: $anonymousSignUpInput){
    _id
    firstName
    lastName
    email
    type
    nickname
    isActivated
  }
}`;
