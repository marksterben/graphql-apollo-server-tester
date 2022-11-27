import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import axios from "axios";
import qs from "qs";

const typeDefs = `#graphql
  type Car {
    id: String
    slug: String
    title: String
  }

  type Metadata {
    total: Int
    totalPages: Int
  }

  type Result {
    data: [Car]
    metadata: Metadata
  }

  type Query {
    findCars(q: String): Result
  }
`;

const resolvers = {
  Query: {
    findCars: async (_, args) => {
      try {
        const { data } = await axios.get(
          `https://asl-nprd-dev-co01.autopedia.id/catalog/v2/cars`,
          {
            params: args,
            paramsSerializer: function (params) {
              return qs.stringify(params, {
                encode: false,
                arrayFormat: "brackets",
              });
            },
          }
        );
        return data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`🚀 Server listening at: ${url}`);
