import React, { useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
const Room = () => {
  const submitHandler = (e) => {
    e.preventDefault();
    console.log(e);
  };
  return (
    <>
      <div>채팅방 생성</div>
      <form action="http://localhost:5000/room" method="post">
        <div>
          <input type="text" name="title" placeholder="방 제목" />
        </div>
        <div>
          <input
            type="number"
            name="max"
            placeholder="수용 인원(최소 2명)"
            min="2"
            value="10"
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="비밀번호(없으면 공개방)"
          />
        </div>
        <div>
          <input type="submit" onSubmit={submitHandler} />
        </div>
      </form>
    </>
  );
};

export default Room;
