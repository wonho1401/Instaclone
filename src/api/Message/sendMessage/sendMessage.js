import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    sendMessage: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { roomId, message, toId } = args;
      let room;
      if (roomId === undefined) {
        //room이 없으면

        if (user.id !== toId) {
          //자기 자신에게 보내지 않도록 하는 것.
          room = await prisma.createRoom({
            participants: {
              connect: [{ id: toId }, { id: user.id }],
            },
          });
        }
      } else {
        //room이 있을 경우
        room = await prisma.room({ id: roomId });
      }
      if (!room) {
        //에러 출력
        throw Error("Room not found");
      }
      //DM 상대방 찾는 것
      const getTo = room.participants.filter(
        (participant) => participant.id !== user.id
      )[0];
      //DM 보내기
      return prisma.createMessage({
        text: message,
        from: {
          connect: {
            id: user.id,
          },
        },
        to: {
          connect: {
            id: roomId ? getTo.id : toId, //roomId가 있으면 getTo(participant가 있으니까)로 없으면 toId(room이 없을 때 생성되니까)로
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
