const SocketIO = require("socket.io");
const { removeRoom } = require("./services");
const cors = require("cors");

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, {
    path: "/socket.io",
    cors: {
      origin: "http://localhost:3000",
    },
  });
  app.set("io", io);
  const room = io.of("/room");
  const chat = io.of("/chat");

  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);
  chat.use(wrap(sessionMiddleware));

  room.on("connection", (socket) => {
    console.log("room 네임스페이스에 접속");
    socket.on("disconnect", () => {
      console.log("room 네임스페이스 접속 해제");
    });
  });

  chat.on("connection", (socket) => {
    console.log("chat 네임스페이스에 접속");
    let roomInfo;
    const ranUserNum = Math.random()*100
    socket.on("join", (data) => {
      roomInfo = data;
      console.log(data)
      socket.join(data);
      socket.to(data).emit("join", {
        user: ranUserNum,
        //현재 임시로 랜덤 컬러로 유저 이름을 지정함. 나중에 실제 유저 API 를 배포하여 연결할 예정
        chat: `${ranUserNum}님이 입장하셨습니다.`,
      });
    });

    socket.on("disconnect", async () => {
      console.log("chat 네임스페이스 접속 해제");
      roomId = roomInfo;
      const currentRoom = chat.adapter.rooms.get(roomId);
      const userCount = currentRoom?.size || 0;
      if (userCount === 0) {
        // 유저가 0명이면 방 삭제
        await removeRoom(roomId); // 컨트롤러 대신 서비스를 사용
        room.emit("removeRoom", roomId);
        console.log("방 제거 요청 성공");
      } else {
        socket.to(roomId).emit("exit", {
          user: "system",
          chat: `${socket.request.session.color}님이 퇴장하셨습니다.`,
        });
      }
    });
  });
};
