import gql from 'graphql-tag';

export default gql`mutation($input: SignInInput!){
    signIn(signInInput: $input){
        user{
            _id
            email
        }
        token
    }
}`;
