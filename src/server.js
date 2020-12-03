import "./env";
import { GraphQLServer } from "graphql-yoga";
import logger from "morgan";
import schema from "./schema";
import { authenticateJwt } from "./passport";
import "./passport";
import { isAuthenticated } from "./middleware";
import { uploadController, uploadMiddleware } from "./upload";

const PORT = process.env.PORT || 4000;

const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request, isAuthenticated }),
});

server.express.use(logger("dev"));
server.express.use(authenticateJwt); // 1. 서버에 전달되는 모든 요청은 이 함수를 통해 통과함.
server.express.post("api/upload", uploadMiddleware, uploadController);
//Middleware는 controller가 실행되기 전에 먼저 실행됨.
//controller는 req.file을 가져옴. (upload.js 참고)
// 그 file을 어디서 가져온다? middleware에서 가져온다.
// 그 middleware가 실행하는것이? multer.
//multer가 하는일은? 사용자가 form 을 제출했을 때 전달받은 파일을 업로드해준다.
server.start({ port: PORT }, () =>
  console.log(`Server Running on Port http://localhost:${PORT}`)
);
