import gql from 'graphql-tag';

export default gql`query{
  me{
    _id
    firstName
    lastName
    email
    type
    nickname
    isActivated
  }
}`;
