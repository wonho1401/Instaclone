import { prisma } from "../../../generated/prisma-client";
import { ROOM_FRAGMENT } from "../../fragments";

export default {
  Mutation: {
    sendMessage: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { roomId, message, toId } = args;
      let room;
      if (roomId === undefined) {
        if (user.id !== toId) {
          //자기 자신에게 보내지 않도록 하는 것.
          room = await prisma
            .createRoom({
              participants: {
                connect: [{ id: toId }, { id: user.id }], //toId: 메세지 전달할 사람, user.id : 메세지 보내는 사람
              },
            })
            .$fragment(ROOM_FRAGMENT);
        }
      } else {
        room = await prisma.room({ id: roomId }).$fragment(ROOM_FRAGMENT);
      }
      if (!room) {
        throw Error("Room not found");
      }
      const getTo = room.participants.filter(
        (participant) => participant.id !== user.id
      )[0];
      return prisma.createMessage({
        text: message,
        from: {
          connect: {
            id: user.id,
          },
        },
        to: {
          connect: {
            id: roomId ? getTo.id : toId,
          },
        },
        room: {
          connect: {
            id: room.id,
          },
        },
      });
    },
  },
};
