import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Auth from "./Auth.jsx";
import {MyContext} from "./MyContext.jsx";
import { useEffect, useState } from 'react';
import {v1 as uuidv1} from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || "");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleAuthSuccess = ({ token, user: loggedInUser }) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setAuthToken(token);
    setUser(loggedInUser);
  };

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    theme, setTheme,
    authToken, setAuthToken,
    user, setUser
  }; 

  return (
    <div className='app'>
      {!authToken ? (
        <Auth onAuthSuccess={handleAuthSuccess} />
      ) : (
        <MyContext.Provider value={providerValues}>
            <Sidebar></Sidebar>
            <ChatWindow></ChatWindow>
        </MyContext.Provider>
      )}
    </div>
  )
}

export default App
