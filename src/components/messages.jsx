import { React, useState, useContext, useEffect } from 'react'
import Message from './message'
import { db } from "../firebase"
import { ChatContext } from '../context/ChatContext'
import { doc, onSnapshot } from 'firebase/firestore';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const { data } = useContext(ChatContext);

    useEffect(() => {
        const unSubscribe = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        });

        return () => {
            unSubscribe();
        };
    }, [data.chatId]);

    return (
        <div className='messages'>
            {messages.map((m) => (
                <Message message={m} key={m.id} />
            ))}
        </div>
    );
}

export default Messages;