import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { users, posts, comments } from "./data.js";
import { nanoid } from 'nanoid';



const typeDefs = gql`

  # User
  type User {
    id: ID!
    fullName: String!
    age: Int
    posts: [Post!]
    comments: [Comment!]
  }

  input CreateUserInput{
    fullName: String!,
    age: Int!

  }

  input UpdateUserInput{
    fullName: String
    age: Int
    
  }


  # Post
  type Post {
    id: ID!
    title: String!
    user_id: ID!
    comments: [Comment!]
    user: User!
    likes: Int!
  }

  input CreatePostInput{
    title: String!
    user_id: ID!
  }

  input UpdatePostInput{
    title: String
    likes: Int
  }

  # Comment
  type Comment {
    id: ID!
    text: String!
    post_id: ID!
    user: User!
    post: Post!
  }

  input CreateCommentInput{
    text: String!, user_id: ID!, post_id: ID
  }

  input UpdateCommentInput{
    text: String
  }

  type Query {
    users: [User!]
    user(id: ID!): User!
    posts: [Post!]
    post(id: ID!): Post! 
    comments: [Comment!]
    comment(id: ID!): Comment!
  }

  type DeleteAllOutput{
    count: Int!
  }

  type Mutation{

    # User
    createUser(data: CreateUserInput): User!
    updateUser(id: ID!, data: UpdateUserInput!): User!
    deleteUser(id: ID!): User!
    deleteAllUsers: DeleteAllOutput!

    # Post
    createPost(data: CreatePostInput): Post!
    updatePost(id: ID!, data: UpdatePostInput!): Post!
    deletePost(id: ID!): Post!
    deleteAllPosts: DeleteAllOutput!
    
    # Comment
    createComment(data: CreateCommentInput): Comment!
    updateComment(id: ID!, data: UpdateCommentInput): Comment!
    deleteComment(id: ID!): Comment!
    deleteAllComments: DeleteAllOutput!
   

  }
`;

const resolvers = {
  Query: {
    // user
    users: () => users,
    user: (_, args) => { 
        return users.find((user) => user.id === args.id);
    },

    // post
    posts: () => posts,
    post: (_, args) => {
        return posts.find((post) => post.id === args.id);
    },

    // comment
    comments: () => comments,
    comment: (_, args) => {
        return comments.find((comment) => comment.id === args.id);
    }

  },

  Mutation: {
    // User
    createUser: (_, args) => {

      const user = {id: nanoid(), fullName: args.data.fullName}
      
      users.push(user);
      return user;
    },

    updateUser: (_, args) => {
      const user_index = users.findIndex(user => user.id === args.id);

      if(user_index === -1){
        throw new Error('User not found!');
      }

      users[user_index] = {
        ...users[user_index],
        ...args.data,
      }

      return users[user_index];
    },

    deleteUser: (_, args) => {
      const user_index = users.findIndex((user) => args.id === user.id);

      if(user_index === -1){
        throw new Error('User not found!');
      };

      const deleted_user = users[user_index];
      users.splice(user_index, 1);

      return deleted_user;

    },

    deleteAllUsers: () => { 
      const length = users.length;
      users.splice(0, length);

      return {count: length};
    },


    // Post
    createPost: (_, args) => {
      const post = {
        
        id: nanoid(),
        title: args.data.title,
        user_id: args.data.user_id,

      }
      posts.push(post);

      return post;

    },

    updatePost: (_, args) => {
      const post_index = posts.findIndex(post => post.id === args.id);

      if(post_index === -1){
        throw new Error('Post Not Found!')
      }

      posts[post_index] = {
        ...posts[post_index],
        ...args.data,
      }

      return posts[post_index];
    },
    deletePost: (_, args) => {
      const post_index = posts.findIndex(post => post.id === args.id);

      if(post_index === -1){
        throw new Error('Post not found!');
      };

      const deleted_post = posts[post_index];

      posts.splice(post_index, 1);

      return deleted_post;
    },

    deleteAllPosts: () => { 
      const length = posts.length;
      posts.splice(0, length);

      return {count: length};
    },

    // Comment
    createComment: (_, args) => {
      const comment = {
        id: nanoid(),
        post_id: args.data.post_id,
        user_id: args.data.user_id,
        text: args.data.text,
      }

      comments.push(comment)

      return comment;
    },

    updateComment: (_, args) => {
      const comment_index = comments.findIndex(comment => comment.id === args.id);

      if(comment_index === -1){
        throw new Error('Comment not found!');
      };

      comments[comment_index] = {
        ...comments[comment_index],
        ...args.data,
      }

      return comments[comment_index];
    },

    deleteComment: (_, args) => {

      const comment_index = comments.findIndex(comment => comment.id === args.id);
  
      if(comment_index === -1){
        throw new Error('Comment not found!');
      };
  
      const deleted_comment = comments[comment_index];
  
      comments.splice(comment_index, 1);
  
      return deleted_comment;
  
    },
    deleteAllComments: () => { 
      const length = comments.length;
      comments.splice(0, length);

      return {count: length};
    },
  },

  

  // User
  User: {
      posts: (parent) => {
        return posts.filter(post => post.user_id === parent.id)
      },
      comments: (parent) => {
        return comments.filter(comment => comment.user_id === parent.id)
      }
  },
  Post: {
      comments: (parent) => {
        return comments.filter(comment => comment.post_id === parent.id)
      },
      user: (parent) => {
        return users.find(user => user.id === parent.user_id);
      }
  },
  Comment: {
      post: (parent) => {
        return posts.find((post) => post.id === parent.post_id)
      },
      user: (parent) => {
          return users.find((user) => user.id === parent.user_id)
      }

  },

  

};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen().then(({ url }) => console.log(`Apollo server is up at ${url}`));
