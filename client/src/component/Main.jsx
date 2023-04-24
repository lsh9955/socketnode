import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
const Main = () => {
  const [socket, setSocket] = useState(null);
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    const res = async () => {
      const getRoomInfo = await axios.get("http://localhost:5000/room");
      console.log(getRoomInfo);
      setRooms(
        getRoomInfo.data.room.map((v, i) => {
          return JSON.stringify(v);
        })
      );
    };
    res();
    console.log(io.connect("http://localhost:5000/room"));
    setSocket(io.connect("http://localhost:5000/room"));
  }, []);
  useEffect(() => {
    socket?.on("newRoom", function (data) {
      // 새 방 이벤트 시 새 방 생성
      console.log("새 방 생성");
      console.log(rooms, [...rooms, JSON.stringify(data)]);
      setRooms([...rooms, JSON.stringify(data)]);
    });

    socket?.on("removeRoom", function (data) {
      // 방 제거 이벤트 시 id가 일치하는 방 제거
      console.log("방 제거");
      console.log(rooms.slice().splice(rooms.indexOf(JSON.stringify(data))));
      setRooms(rooms.slice().splice(rooms.indexOf(JSON.stringify(data)), 1));
    });
  }, [rooms, socket]);

  function addBtnEvent(e) {
    // 방 입장 클릭 시
    if (e.target.dataset.password === "true") {
      const password = prompt("비밀번호를 입력하세요");
      window.location.href =
        "/room/" + e.target.dataset.id + "?password=" + password;
    } else {
      window.location.href = "/room/" + e.target.dataset.id;
    }
  }

  document.querySelectorAll(".join-btn").forEach(function (btn) {
    btn.addEventListener("click", addBtnEvent);
  });

  return (
    <>
      <h1>채팅방</h1>
      <div>
        {rooms.map((v, i) => {
          return <div>{v}</div>;
        })}
      </div>
      <fieldset>
        <legend>채팅방 목록</legend>
        <table>
          <thead>
            <tr>
              <th>방 제목</th>
              <th>종류</th>
              <th>허용 인원</th>
              <th>방장</th>
            </tr>
          </thead>
          {/* <tbody>
        {% for room in rooms %}
        <tr data-id="{{room._id}}">
          <td>{{room.title}}</td>
          <td>{{'비밀방' if room.password else '공개방'}}</td>
          <td>{{room.max}}</td>
          <td style="color: {{room.owner}}">{{room.owner}}</td>
          <td>
            <button
              data-password="{{'true' if room.password else 'false'}}"
              data-id="{{room._id}}"
              class="join-btn"
            >
              입장
            </button>
          </td>
        </tr>
        {% endfor %}
      </tbody> */}
        </table>

        <a href="/room">채팅방 생성</a>
      </fieldset>
    </>
  );
};

export default Main;
