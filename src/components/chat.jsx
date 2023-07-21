import { React, useContext } from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import Messages from './messages'
import Input from './input'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase"
import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';

const Chat = () => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);
    const { dispatch } = useContext(ChatContext);

    // Handles close of a chat.
    const handleClose = (user) => {
        dispatch({ type: "CLOSE_USER", payload: user });
    };
    const handleDelete = async (user) => {
        dispatch({ type: "DELETE_USER", payload: user });
        try {
            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [data.chatId + ".lastMessage"]: {
                    text: "nullmessage",
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });
            await updateDoc(doc(db, "userChats", data.user.uid), {
                [data.chatId + ".lastMessage"]: {
                    text: "nullmessage",
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });
            const combinedID = currentUser.uid > data.user.uid ? currentUser.uid + data.user.uid : data.user.uid + currentUser.uid;
            await updateDoc(doc(db, "chats", combinedID), { messages: [] });
        } catch (error) {
            console.log(error);
        }
    };

    if (data.user.displayName) {
        return (
            <div className='chat'>
                <div className="chatInfo">
                    <div>
                        <img src={data.user.photoURL} alt="" />
                        <span>{data.user.displayName}</span>
                    </div>
                    <div>
                        <button onClick={handleClose}><LogoutIcon /></button>
                        <button onClick={handleDelete}><DeleteIcon /></button>
                    </div>
                </div>
                <Messages />
                <Input />
            </div>
        )
    }
    else {
        return (
            <div className='no-chat'>
                <span>Choose a chat to start the converation</span>
            </div>
        )
    }
}

export default Chat;