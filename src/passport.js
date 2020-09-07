import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../generated/prisma-client";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const verifyUser = async (payload, done) => {
  try {
    const user = await prisma.user({ id: payload.id });
    //4 payload는 토큰에서 해석된 id를 받아서 user를 찾음!
    if (user !== null) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
};

export const authenticateJwt = (req, res, next) =>
  //2 아래 함수를 실행함! 이 함수는 Strategy를 활용해서 jwt 토큰을 뽑아냄! 그것이 바로 3번
  passport.authenticate("jwt", { sessions: false }, (error, user) => {
    //5 user가 있으면 req의 user에 추가!
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
passport.use(new Strategy(jwtOptions, verifyUser)); //3 토큰이 추출되면 verifyUser를 payload와 함께 실행함!
passport.initialize();

//토큰을 받아서, 해석하고, 사용자를 확인하고, 사용자가 존재한다면 req 객체에 사용자를 추가하고 나면 graphql 함수가 실행됨.
//로그인 되어 있다면 모든 graphql 요청에 사용자 정보가 추가되어 요청된다.
