import { prisma } from "../../../generated/prisma-client";

export default {
  User: {
    post: (parent) => prisma.user({ id: parent.id }).post(),
    following: (parent) => prisma.user({ id: parent.id }).following(),
    followers: (parent) => prisma.user({ id: parent.id }).followers(),
    likes: (parent) => prisma.user({ id: parent.id }).likes(),
    comments: (parent) => prisma.user({ id: parent.id }).comments(),
    rooms: (parent) => prisma.user({ id: parent.id }).rooms(),
    postCount: (parent) =>
      prisma
        .postsConnection({ where: { user: { id } } })
        .aggregate()
        .count(),
    followingCount: ({ id }) =>
      prisma
        .usersConnection({ where: { followers_some: { id } } })
        .aggregate()
        .count(),
    followersCount: ({ id }) =>
      prisma
        .usersConnection({ where: { following_none: { id } } })
        .aggregate()
        .count(),
    fullName: (parent) => `${parent.firstName} ${parent.lastName}`,
    isFollowing: async (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      try {
        return prisma.$exists.user({
          AND: [
            {
              id: user.id,
            },
            {
              following_some: {
                id: parentId,
              },
            },
          ],
        });
      } catch {
        return false;
      }
    },
    isSelf: (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      return user.id === parentId;
    },
  },
};
