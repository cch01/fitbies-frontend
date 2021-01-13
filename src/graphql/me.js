import gql from 'graphql-tag';

export default gql`query{
  me{
      _id
      firstName
      type
      lastName
      email
      updatedAt
      createdAt
  }
}`;
