import { React, useState, useContext } from 'react';
import { db } from "../firebase";
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { AuthContext } from "../context/AuthContext";

const Search = () => {
    const [searchEmail, setSearchEmail] = useState("");
    const { currentUser } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState('');

    // Handles the selection of a user and starts a chat with them.
    const handleSelect = async (user) => {
        const combinedID =
            currentUser.uid > user.uid
                ? currentUser.uid + user.uid
                : user.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, "chats", combinedID));
            if (!res.exists()) {
                await setDoc(doc(db, "chats", combinedID), { messages: [] });
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedID + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    },
                    [combinedID + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", user.uid), {
                    [combinedID + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL,
                    },
                    [combinedID + ".date"]: serverTimestamp(),
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Handles the search action to find a user by email.
    const handleSearch = async () => {
        if (currentUser.email === searchEmail) {
            setSearchEmail("");
            setErrorMessage('This is your own email address')
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
            return;
        }
        const q = query(collection(db, "users"), where("email", "==", searchEmail));
        try {
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                setErrorMessage('No user found.');
                setTimeout(() => {
                    setErrorMessage('');
                }, 5000);
            } else {
                querySnapshot.forEach((doc) => {
                    handleSelect(doc.data());
                });
                setSearchEmail("");
                setErrorMessage('');
            }
        } catch (error) {
            console.log(error)
        }
    };

    // Handles the "Enter" key press event in the search input field.
    const handleKey = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className='search'>
            <div className="searchForm">
                <input type="text" placeholder={"Search Email ..."} onKeyDown={handleKey} onChange={(e) => setSearchEmail(e.target.value.toLowerCase())} value={searchEmail} />
                <div className='error'>{errorMessage}</div>
            </div>
            
        </div>
    );
};

export default Search;