import { React, useContext, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/ImageOutlined';
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from '../context/ChatContext';
import { arrayUnion, updateDoc, doc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { v4 as uuid } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

const Input = () => {
    const [text, setText] = useState(null);
    const [img, setImg] = useState(null);
    const [queue, setQueue] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    // Displays the image in the queue.
    const handleQueue = (imgURL) => {
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = document.getElementById("queue");
            img.src = e.target.result;
        };
        reader.readAsDataURL(imgURL);
    };

    // Resets the input field and image queue.
    const reset = () => {
        var element = document.getElementById("file");
        element.value = "";
        setQueue(false);
        setImg(null);
    };

    // Handles the "Enter" key press event in the input field.
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };
    
    // Zooms in/out the image in the queue.
    const handleZoomImg = (e) => {
        e.target.classList.toggle("imgQueue--zoom");
    };

    // Handles the send action (sending a message or image).
    const handleSend = async () => {
        if (img) {
            setQueue(false);
            const storageRef = ref(storage, uuid());
            uploadBytesResumable(storageRef, img).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    await updateDoc(doc(db, "chats", data.chatId), {
                        messages: arrayUnion({
                            id: uuid(),
                            text,
                            senderId: currentUser.uid,
                            date: Timestamp.now(),
                            img: downloadURL,
                        }),
                    });
                });
                setText('');
                setImg(null);
            });
        } else if (text !== null) {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                }),
            });
            setText('');
        } else {
            return;
        }
        if (text !== null) {
            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [data.chatId + ".lastMessage"]: {
                    text,
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });
            await updateDoc(doc(db, "userChats", data.user.uid), {
                [data.chatId + ".lastMessage"]: {
                    text,
                },
                [data.chatId + ".date"]: serverTimestamp(),
            });
        }
    };

    return (
        <div className='input-container' id='input'>
            {queue && (
                <div className='queueContain'>
                    <img className="queueImg" id='queue' onClick={handleZoomImg} src="" alt="" />
                    <div className="gg-close-o" onClick={reset}></div>
                </div>
            )}
            <div className='inputField'>
                <input id='input' type="text" placeholder='Message' autoComplete="off" onKeyDown={handleKeyDown} onChange={e => setText(e.target.value)} value={text} />
                <div className="send">
                    <input type="file" style={{ display: "none" }} id="file" onChange={e => { setImg(e.target.files[0]); setQueue(true); handleQueue(e.target.files[0]) }} />
                    <label htmlFor="file">
                        <ImageIcon style={{fontSize: "30px"}} />
                    </label>
                    <button onClick={handleSend}><SendIcon style={{fontSize: "30px"}} /></button>
                </div>
            </div>
        </div>
    );
}

export default Input;