import { prisma } from "../../../../generated/prisma-client";

export default {
  Query: {
    seeUser: async (_, args) => {
      const { nickname } = args;
      return prisma.user({ nickname });
    },
  },
};
