import { users, events, locations, participants } from "./data.js";
import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]
  }

  input CreateUserInput {
    id: ID!
    username: String!
    email: String!
  }

  input UpdateUserInput {
    username: String
    email: String
  }

  type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    locationId: ID!
    userId: ID!
    location: Location!
    participants: [Participant!]!
    user: User!
  }

  input CreateEventInput {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    locationId: ID!
    userId: ID!
  }

  input UpdateEventInput {
    title: String
    date: String
  }

  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float
  }

  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
  }

  type Query {
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

  type DeleteAllOutput {
    count: Int!
  }

  type Mutation {
    # User
    createUser(data: CreateUserInput): User!
    updateUser(id: ID!, data: UpdateUserInput!): User!
    deleteUser(id: ID!): User!
    deleteAllUsers: DeleteAllOutput!

    # Event
    createEvent(data: CreateEventInput!): Event!
    updateEvent(id: ID!, data: UpdateEventInput!): Event!
    deleteEvent(id: ID!): Event!
    deleteAllEvents: DeleteAllOutput!
  }
`;

const resolvers = {
  Query: {
    // User
    users: () => users,
    user: (_, args) => {
      return users.find((user) => user.id === parseInt(args.id));
    },

    // Event
    events: () => events,
    event: (_, args) => {
      return events.find((event) => event.id === parseInt(args.id));
    },

    // Location
    locations: () => locations,
    location: (_, args) => {
      return locations.find((location) => location.id === parseInt(args.id));
    },

    // Participant
    participants: () => participants,
    participant: (_, args) => {
      return participants.find(
        (participant) => participant.id === parseInt(args.id)
      );
    },
  },

  Mutation: {
    createUser: (_, { data: { id, username, email } }) => {
      const newUser = { id, username, email };
      users.push(newUser);

      return newUser;
    },

    updateUser: (_, { id, data }) => {
      const user_index = users.findIndex((user) => user.id === parseInt(id));

      if (user_index === -1) {
        throw new Error("User not found!");
      }

      users[user_index] = {
        ...users[user_index],
        ...data,
      };

      return users[user_index];
    },

    deleteUser: (_, { id }) => {
      const user_index = users.findIndex((user) => user.id === parseInt(id));

      if (user_index === -1) {
        throw new Error("User not found!");
      }
      const tempUser = users[user_index];

      users.splice(user_index, 1);

      return tempUser;
    },

    deleteAllUsers: () => {
      const length = users.length;

      users.splice(0, length);

      return { count: length };
    },

    createEvent: (_, { data }) => {
      const user_id = data.userId;
      const event = { ...data, userId: user_id };

      events.push(event);

      return event;
    },

    updateEvent: (_, { id, data }) => {
      const event_index = events.findIndex(
        (event) => event.id === parseInt(id)
      );

      if (event_index === -1) {
        throw new Error("Event not found!");
      }

      events[event_index] = {
        ...events[event_index],
        ...data,
      };

      return events[event_index];
    },

    deleteEvent: (_, { id }) => {
      const event_index = events.findIndex((event) => event.id === parseInt(id));

      if(event_index === -1){
          throw new Error('Event not found!');
      }
      const tempEvent = events[event_index];

      events.splice(event_index, 1);

      return tempEvent;
    },

    deleteAllEvents: () => {
        const length = events.length;

        events.splice(0, length);

        return {count: length};
    },
  },

  User: {
    events: (parent) => {
      return events.filter((event) => event.userId === parent.id);
    },
  },

  Event: {
    user: (parent) => {
      return users.find((user) => user.id === parent.user_id);
    },

    participants: (parent) => {
      return participants.filter(
        (participant) => participant.event_id === parent.id
      );
    },

    location: (parent) => {
      return locations.find((location) => location.id === parent.location_id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen().then(({ url }) => console.log(`Apollo server is up at ${url}`));
