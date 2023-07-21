import { React, useState, useEffect, useContext, useRef } from 'react'
import { AuthContext } from "../context/AuthContext"
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from "../firebase"
import { ChatContext } from '../context/ChatContext'

const Chats = ({ setActiveChat, activeChat }) => {
    const [chats, setChats] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);
    const listChats = useRef([]);

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                setChats(doc.data());
            });
            return () => {
                unsub();
            };
        };
        currentUser.uid && getChats();
    }, [currentUser.uid]);

    // Handles the selection of a chat.
    const handleSelect = (user) => {
        setActiveChat(user.uid);
        dispatch({ type: "CHANGE_USER", payload: user });
    };

    // Handles the display of chat text.
    const handleShowChat = (text) => {
        return text === ""
            ? <i>image attached</i>
            : (text === undefined || text === "nullmessage")
                ? ""
                : text?.length > 20
                    ? text?.substring(0, 20) + "..."
                    : text;
    };

    return (
        <div className="chats">
            {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat, index) => (
                <div ref={el => listChats.current[index] = el} className="userChat" key={chat[0]} onClick={() => { handleSelect(chat[1].userInfo) }} >
                    <img src={chat[1].userInfo.photoURL} alt="" />
                    <div className="userChatInfo">
                        <span>{chat[1].userInfo.displayName}</span>
                        <p>{handleShowChat(chat[1].lastMessage?.text)}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Chats;