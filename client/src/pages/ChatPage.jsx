import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Chat from "../components/Chat";
import Login from "../components/Login";

function ChatPage() {
  const { username, setUsername } = useContext(UserContext);

  return <div>{username ? <Chat username={username} /> : <Login setUsername={setUsername} />}</div>;
}

export default ChatPage;
