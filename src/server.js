import "./env";
import { GraphQLServer } from "graphql-yoga";
import logger from "morgan";
import schema from "./schema";
import { authenticateJwt } from "./passport";
import "./passport";
import { isAuthenticated } from "./middleware";

const PORT = process.env.PORT || 4000;

const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request, isAuthenticated }),
});

server.express.use(logger("dev"));
server.express.use(authenticateJwt); // 1. 서버에 전달되는 모든 요청은 이 함수를 통해 통과함.

server.start({ port: PORT }, () =>
  console.log(`Server Running on Port http://localhost:${PORT}`)
);
