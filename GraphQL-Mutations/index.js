import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { users, posts, comments } from "./data.js";
import { nanoid } from 'nanoid';



const typeDefs = gql`
  type User {
    id: ID!
    fullName: String!
    posts: [Post!]
    comments: [Comment!]
  }

  type Post {
    id: ID!
    title: String!
    user_id: ID!
    comments: [Comment!]
    user: User!
  }

  type Comment {
    id: ID!
    text: String!
    post_id: ID!
    user: User!
    post: Post!
  }

  type Query {
    users: [User!]
    user(id: ID!): User!
    posts: [Post!]
    post(id: ID!): Post! 
    comments: [Comment!]
    comment(id: ID!): Comment!
  }

  type Mutation{
    createUser(fullName: String!): User!
    createPost(title: String!, user_id: ID!): Post!
    createComment(text: String!, user_id: ID!, post_id: ID): Comment!

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
    createUser: (_, args) => {

      const user = {id: nanoid(), fullName: args.fullName}
      
      users.push(user);
      return user;
    },

    createPost: (_, args) => {
      const post = {
        
        id: nanoid(),
        title: args.title,
        user_id: args.user_id,

      }
      posts.push(post);

      return post;

    },
    createComment: (_, args) => {
      const comment = {
        id: nanoid(),
        post_id: args.post_id,
        user_id: args.user_id,
        text: args.text,
      }

      comments.push(comment)

      return comment;
    }
  },

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
