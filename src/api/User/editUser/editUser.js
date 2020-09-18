import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    editUser: (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { nickname, email, firstName, lastName, bio, avatar } = args;
      const { user } = request;

      return prisma.updateUser({
        where: { id: user.id },
        data: { nickname, email, firstName, lastName, bio, avatar },
      });
    },
  },
};
