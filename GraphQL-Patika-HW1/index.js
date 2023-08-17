import { users, events, locations, participants } from './data.js';
import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const typeDefs = gql`

    type User{
        id: ID!
        username: String!
        email: String!
        events: [Event!]
    }

    type Event{
        id: ID!
        title: String!
        desc: String!
        date: String!
        from: String!
        to: String!
        locationId: String!
        userId: String!
        location: Location!
        participants: [Participant!]!
        user: User!

    }

    type Location{
        id: ID!
        name: String!
        desc: String!
        lat: Float!
        lng: Float
    }

    type Participant{
        id: ID!
        user_id: ID!
        event_id: ID!
    }



    type Query{

        # User
        users: [User!]
        user(id: ID!): User!

        # Events
        events: [Event!]
        event(id: ID!): Event!

        # Locations
        locations: [Location!]
        location(id: ID!): Location!

        # Participants
        participants: [Participant!]
        participant(id: ID!): Participant!
        
    }

`

const resolvers = {
    Query: {

        // User
        users: () => users,
        user: (_, args) => {
            return users.find(user => user.id === parseInt(args.id))
        },


        // Event
        events: () => events,
        event: (_, args) => {
            return events.find(event => event.id === parseInt(args.id));
        },

        // Location
        locations: () => locations,
        location: (_, args) => {
            return locations.find(location => location.id === parseInt(args.id));
        },

        // Participant
        participants: () => participants,
        participant: (_, args) => {
            return participants.find(participant => participant.id === parseInt(args.id));
        },
    },

    User: {
        events: (parent) => {
            return events.filter(event => event.user_id === parent.user_id)
        }
    },

    Event: {
        user: (parent) => {
            
            return users.find(user => user.id === parent.id)
        },

        participants: (parent) => {
            return participants.filter(participant => participant.event_id === parent.id)
        },

        location: (parent) => {
            return locations.find(location => location.id === parent.location_id)
        }
    }

}


const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  
  server.listen().then(({ url }) => console.log(`Apollo server is up at ${url}`));