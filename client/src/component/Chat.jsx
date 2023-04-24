import React, { useEffect,useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const Chat = () => {
 
  useEffect(() => {
    const socket = io.connect("http://localhost:5000/chat")
    socket.emit("join", new URL(window.location).pathname.split("/").at(-1));
    socket.on("join", function (data) {
      console.log(data)
  
    });
    socket.on("exit", function (data) {
      console.log(data)
 
    });
    socket.on("chat", function (data) {
      const div = document.createElement("div");
      if (data.user === "{{user}}") {
        div.classList.add("mine");
      } else {
        div.classList.add("other");
      }
      const name = document.createElement("div");
      name.textContent = data.user;
      div.appendChild(name);
      if (data.chat) {
        const chat = document.createElement("div");
        chat.textContent = data.chat;
        div.appendChild(chat);
      } else {
        const pic = document.createElement("img");
        pic.src = "/pic/" + data.pic;
        div.appendChild(pic);
      }
      div.style.color = data.user;
      document.querySelector("#chat-list").appendChild(div);
    });
  }, []);

  // document.querySelector("#chat-form").addEventListener("submit", function (e) {
  //   e.preventDefault();
  //   if (e.target.chat.value) {
  //     axios
  //       .post("/room/{{room._id}}/chat", {
  //         chat: this.chat.value,
  //       })
  //       .then(() => {
  //         e.target.chat.value = "";
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });
  //   }
  // });
  // document.querySelector("#pic").addEventListener("change", function (e) {
  //   console.log(e.target.files);
  //   const formData = new FormData();
  //   formData.append("pic", e.target.files[0]);
  //   axios
  //     .post("/room/{{room._id}}/pic", formData)
  //     .then(() => {
  //       e.target.file = null;
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // });
  return (
    <>
      <a href="/" id="exit-btn">
        방 나가기
      </a>
      <div>채팅 내용</div>
    </>
  );
};

export default Chat;
