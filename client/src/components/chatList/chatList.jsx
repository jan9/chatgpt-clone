import "./chatList.css";
import { Link } from "react-router-dom";

const ChatList = () => {
  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Explore Lama AI</Link>
      <Link to="/">Contact</Link>
      <hr />
      <div className="list">
        <span className="title">RECENT CHATS</span>
        <Link to="/dashboard/chats/1">My chat title</Link>
        <Link to="/dashboard/chats/2">My chat title</Link>
        <Link to="/dashboard/chats/3">My chat title</Link>
        <Link to="/dashboard/chats/4">My chat title</Link>
        <Link to="/dashboard/chats/5">My chat title</Link>
        <Link to="/dashboard/chats/6">My chat title</Link>
        <Link to="/dashboard/chats/7">My chat title</Link>
        <Link to="/dashboard/chats/8">My chat title</Link>
        <Link to="/dashboard/chats/9">My chat title</Link>
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>Upgrade to Lama AI Pro</span>
          <span>Get unlimited access to all features</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
