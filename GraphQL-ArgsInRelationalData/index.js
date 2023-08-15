import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { books, authors } from "./data.js";



const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    surname: String
    age: Int!
    books(filter: String): [Book!]
  }

  type Book {
    title: String!
    author: Author!
    author_id: String!
    id: ID!
    score: Float
    isPublished: Boolean
  }



  type Query {
    books: [Book!]
    book(id: ID!): Book!
    authors: [Author!]
    author(id: ID!): Author!
    
  }
`;

const resolvers = {
  Query: {
    books: () => books,
    authors: () => authors,
    book: (_, args) => {
      
      const data = books.find(book => book.id === args.id);
      return data;
    },

    author: (_, args) => {
      const data = authors.find(author => author.id === args.id);

      return data;
    },
  },

  Book: {
    author: (parent) => {
      const data = authors.find(author => author.id === parent.author_id)
      
      return data;
    }
  },

  Author: {
    books: (parent, args) => {

      let data = books.filter((book) => book.author_id === parent.id);

      
      if(args.filter){
        data = data.filter(book => book.title.toLowerCase().startsWith(args.filter));

      }

      return data;
    }

  }



};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen().then(({ url }) => console.log(`Apollo server is up at ${url}`));
