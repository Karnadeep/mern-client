import gql from 'graphql-tag'

export const FETCH_POSTS_QUERY = gql`
{
    getPosts{
        id
        body 
        createdAt 
        username 
        likesCount
        likes{
            username
        }
        commentsCount
        comments{
            id 
            username 
            createdAt 
            body
        }
    }
}
`;

export const FETCH_POST_QUERY = gql`
query getPost($postID : ID!){
     getPost(postID : $postID){
         id
         body
         username
         createdAt
         likes{
             id username createdAt
         }
         likesCount
         comments{
             id username createdAt body
         }
         commentsCount
     }
 }
`