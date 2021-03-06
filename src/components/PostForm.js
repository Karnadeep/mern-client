import React from "react";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import { useMutation } from "@apollo/react-hooks";
import { useForm } from "../util/hooks";

function PostForm({ updatePosts }) {
  const { values, onSubmit, onChange } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      console.log("result", result);
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      console.log(data.getPosts);
      data.getPosts = [result.data.createPost, ...data.getPosts];
      console.log(data.getPosts);
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      const newProxy = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      updatePosts(newProxy.getPosts);
      values.body = "";
    },
  });

  function createPostCallback() {
    console.log('typeof() :>> ', typeof (values.body));
    if (values.body.length === 0) {
      alert('Body cannot be empty')
      return
    }

    createPost();
  }
  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi World!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit">Submit</Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        createdAt
        username
      }
      likesCount
      comments {
        id
        body
        createdAt
        username
      }
      commentsCount
    }
  }
`;

export default PostForm;
