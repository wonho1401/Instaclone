import { prisma } from "../../../../generated/prisma-client";

export default {
  query: {
    messages: (_, args) => {
      const { roomId } = args;
      return prisma.messages({
        where: {
          room: {
            id: roomId,
          },
        },
      });
    },
  },
};
