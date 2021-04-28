import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { Button, Icon, Label } from 'semantic-ui-react'
import gql from 'graphql-tag'
import MyPopup from '../util/MyPopup'
import { FETCH_POST_QUERY } from '../util/graphql'

function LikeButton({ user, post: { id, likesCount, likes } }) {
    const [liked, setLiked] = useState(false)
    const [updatedLikes, setUpdatedLikes] = useState(likesCount)
    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true)
        } else {
            setLiked(false)
        }
    }, [user, likes])

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        update(_, result) {
            const mutationlikes = result.data.likePost.likes
            const mainLike = mutationlikes.find(like => like.username === user.username)
            if (mainLike) {
                setLiked(true)
            } else {
                setLiked(false)
            }
            setUpdatedLikes(mutationlikes.length)
        },
        variables: { postId: id }
    })
    function likeThePost() {
        if (user) {
            likePost()
        }
    }
    const likeButton = user ? (
        liked ?
            (<Button color='teal'>
                <Icon name='heart' />
            </Button>) :
            (<Button color='teal' basic>
                <Icon name='heart' />
            </Button>)
    ) : (
        <Button as={Link} to="/login" color='teal' basic>
            <Icon name='heart' />
        </Button>
    )

    return (
        <MyPopup content={liked ? 'Unlike' : 'Like'}>
            <Button as='div' labelPosition='right' onClick={likeThePost}>
                {likeButton}
                <Label as='a' basic color='teal' pointing='left'>
                    {updatedLikes}
                </Label>
            </Button>

        </MyPopup>

    )
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId : ID!){
        likePost(postId: $postId){
            id 
            likes{
                id username
            }
            likesCount
        }
    }
`

export default LikeButton