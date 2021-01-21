import gql from 'graphql-tag';

export default gql`mutation($anonymousSignUpInput: AnonymousSignUpInput!){
  anonymousSignUp(anonymousSignUpInput: $anonymousSignUpInput){
      _id
      type
      email
      nickname
      createdAt
      updatedAt
  }
}`;
