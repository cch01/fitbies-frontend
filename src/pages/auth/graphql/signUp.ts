import gql from 'graphql-tag';

export default gql`
  mutation($input:SignUpInput!){
    signUp(signUpInput: $input){
        _id
        firstName
        lastName
        nickname
        email
        createdAt
        updatedAt
    }
  }
`;
