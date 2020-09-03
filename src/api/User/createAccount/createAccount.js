import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    createAccount: async (_, args) => {
      const { nickname, email, firstName = "", lastName = "", bio = "" } = args;
      const user = await prisma.createUser({
        nickname,
        email,
        firstName,
        lastName,
        bio,
      });
      return user;
    },
  },
};
