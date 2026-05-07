import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import {ScaleLoader} from "react-spinners";

function ChatWindow() {
    const {
        prompt,
        setPrompt,
        setReply,
        currThreadId,
        setPrevChats,
        setNewChat,
        setAllThreads,
        setCurrThreadId,
        theme,
        setTheme,
        authToken,
        setAuthToken,
        user,
        setUser
    } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

    const getReply = async () => {
        const userMessage = prompt.trim();
        if(!userMessage) return;
        setLoading(true);
        setNewChat(false);
        setPrevChats((prev) => [...prev, { role: "user", content: userMessage }]);
        setPrompt("");

        console.log("message ", userMessage, " threadId ", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`
            },
            body: JSON.stringify({
                message: userMessage,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, options);
            if (response.status === 401) {
                handleLogout();
                return;
            }
            const res = await response.json();
            if (!response.ok) {
                throw new Error(res.error || "Failed to get AI reply");
            }
            setReply(res.reply);
            setPrevChats((prev) => [...prev, { role: "assistant", content: res.reply }]);
        } catch(err) {
            console.log(err);
            setPrevChats((prev) => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
        }
        setLoading(false);
    }


    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    const handleToggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
        setIsOpen(false);
    };

    const handleUpgradePlan = () => {
        window.open("https://platform.openai.com/docs", "_blank");
        setIsOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setAuthToken("");
        setUser(null);
        setPrompt("");
        setReply(null);
        setPrevChats([]);
        setAllThreads([]);
        setCurrThreadId(crypto.randomUUID());
        setNewChat(true);
        setIsOpen(false);
    };

    const startVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setPrompt((prev) => prev ? `${prev} ${transcript}` : transcript);
        };

        recognition.start();
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>SigmaGPT <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon">{user?.name?.[0]?.toUpperCase() || <i className="fa-solid fa-user"></i>}</span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <button type="button" className="dropDownItem" onClick={handleToggleTheme}>
                        <i className="fa-solid fa-circle-half-stroke"></i> {theme === "dark" ? "Light mode" : "Dark mode"}
                    </button>
                    <button type="button" className="dropDownItem" onClick={handleUpgradePlan}>
                        <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
                    </button>
                    <button type="button" className="dropDownItem" onClick={handleLogout}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                    </button>
                </div>
            }
            <Chat></Chat>

            <ScaleLoader color={theme === "dark" ? "#fff" : "#111827"} loading={loading}>
            </ScaleLoader>
            
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}
                    >
                           
                    </input>
                    <button
                        type="button"
                        className={`voiceBtn ${isListening ? "active" : ""}`}
                        onClick={startVoiceInput}
                        title="Voice input"
                    >
                        <i className="fa-solid fa-microphone"></i>
                    </button>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;
