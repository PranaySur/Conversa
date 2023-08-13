import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Image from "../images/loginpage.png";
import ImageIcon from '@mui/icons-material/Image';
import { toast } from 'react-toastify';
import "./style.css"

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [file, setFile] = useState(null);
    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
    };
    const handleEmailSignUp = async (e) => {
        e.preventDefault();
        if (name === '') {
            toast.info("Please enter your name to sign up.");
            return;
        }
        if (file === null) {
            toast.info("Please Upload your profile picture.");
            return;
        }
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const date = new Date().toISOString();
            const storageRef = ref(storage, name);
            await uploadBytesResumable(storageRef, file).then(() => {
                try {
                    getDownloadURL(storageRef).then(async (url) => {
                        await updateProfile(res.user, {
                            name,
                            photoURL: url,
                        });
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            displayName: name,
                            email,
                            photoURL: url,
                            createdAt: date,
                            token: "null"
                        });
                        await setDoc(doc(db, "userChats", res.user.uid), {});
                        navigate("/");
                    });
                } catch (error) {
                    toast.error(error.message);
                }
            });
        }
        catch (error) {
            const errorCode = error.code;
            let message = "";
            switch (errorCode) {
                case "auth/invalid-email":
                    message = "Invalid email address. Please enter a valid email.";
                    break;
                case "auth/email-already-in-use":
                    message = "The email address is already in use. Please use a different email.";
                    break;
                case "auth/operation-not-allowed":
                    message = "This operation is not allowed. Please contact support for assistance.";
                    break;
                case "auth/weak-password":
                    message = "The password is too weak. Please choose a stronger password.";
                    break;
                case "auth/too-many-requests":
                    message = "Too many requests. Please try again later.";
                    break;
                default:
                    message = "An error occurred. Please try again later.";
                    break;
            }
            toast.error(message);
        }
    };
    return (
        <div className="box container-fluid bg-primary d-flex justify-content-center align-items-center vh-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div className="row p-3 bg-white shadow border box-area" style={{ width: "930px", borderRadius: "30px" }}>
                <div className="image-container col-md-6 p-3 d-flex justify-content-center align-items-center flex-column bg-primary left-box" style={{ borderRadius: "20px" }}>
                    <div className="featured-image mb-3">
                        <img src={Image} className="img-fluid" style={{ width: '250px' }} alt="Featured" />
                    </div>
                    <p className="text-white fs-1 bold-text">Be Verified</p>
                    <small className="text-white text-wrap text-center fs-3 bold-text">Access your personalized experience.</small>
                </div>

                <div className="form-container col-md-6 px-4 pt-4 right-box">
                    <div className="row align-items-center">
                        <div className="header-text mb-4">
                            <h2 className='text-primary bold-text'>Join Conversa</h2>
                            <h4 className='text-primary bold-text'>Sign up now and connect with people.</h4>
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control form-control-lg bg-light text-secondary fs-6" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control form-control-lg bg-light text-secondary fs-6" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" className="form-control form-control-lg bg-light text-secondary fs-6" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="input-group d-flex justify-content-end">
                            <label htmlFor="fileInput">
                                {!file && <p className='fs-6 text-secondary'><ImageIcon /> Upload Image</p>}
                                {file && <p className='fs-6 text-primary'><ImageIcon /> Change Image</p>}
                            </label>
                            <input type="file" id="fileInput" onChange={handleFileChange} style={{ display: 'none' }} />
                        </div>
                        <div className="input-group mb-4">
                            <button className="btn btn-lg btn-primary w-100 fs-5 bold-text" onClick={handleEmailSignUp}>Register</button>
                        </div>
                        <div class="row">
                            <p className='fs-6 text-center mb-3'>Already have an account? <Link to="/login">Sign In</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
