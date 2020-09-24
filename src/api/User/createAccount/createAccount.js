import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    createAccount: async (_, args) => {
      const { nickname, email, firstName = "", lastName = "", bio = "" } = args;
      const exists = await prisma.$exists.user({
        OR: [{ nickname }, { email }],
      });
      if (exists) {
        throw Error("This nickname / email is already used");
      }
      await prisma.createUser({
        nickname,
        email,
        firstName,
        lastName,
        bio,
      });
      return true;
    },
  },
};
