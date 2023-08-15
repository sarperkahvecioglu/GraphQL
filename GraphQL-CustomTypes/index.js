import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const author = {
  id: "01",
  name: "Mike",
  surname: "James",
  age: 22,
  books: [
      {id: "1", title: "Mike's First Book", score: 3.4, isPublished: false},
      {id: "2", title: "Mike's Second Book", score: 3.7, isPublished: true},
    ]
};

const book = {
    title: "Life Passes",
    author: author,
    id: "01adqw02",
    score: 6.9,
    isPublished: true,
}

const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    surname: String
    age: Int!
    books: [Book!]
  }

  type Book {
    title: String!
    author: Author!
    id: ID!
    score: Int
    isPublished: Boolean
  }



  type Query {
    book: Book!
    author: Author!
  }
`;

const resolvers = {
  Query: {
    book: () => book,
    author: () => author,
  },



};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen().then(({ url }) => console.log(`Apollo server is up at ${url}`));
