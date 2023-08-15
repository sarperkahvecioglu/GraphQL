import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const typeDefs = gql`

    type Book{
        title: String,
        author: String,
    }

    type Query{
        books: [Book]
    }
`

const resolvers = {
    Query: {
        books: () => [{title: "Romeo and Juliet", author: 'William Shakespeare'}],
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground({

        })
    ]
});

server.listen().then(({url}) => console.log(`Apollo server is up at ${url}`));