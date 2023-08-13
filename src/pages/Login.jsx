import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { auth, provider, db } from "../firebase";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import GoogleIcon from "../images/google.png";
import Image from "../images/loginpage.png";
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log(user);
            navigate("/")
        } catch (error) {
            const errorCode = error.code;
            let message = '';
            switch (errorCode) {
                case 'auth/invalid-email':
                    message = 'Invalid email address. Please enter a valid email.';
                    break;
                case 'auth/user-not-found':
                    message = 'User not found. Please check your email or sign up for a new account.';
                    break;
                case 'auth/wrong-password':
                    message = 'Incorrect password. Please try again.';
                    break;
                case 'auth/invalid-credential':
                    message = 'Invalid credential. Please check your email and password.';
                    break;
                case 'auth/too-many-requests':
                    message = 'Too many requests. Please try again later.';
                    break;
                case 'auth/user-disabled':
                    message = 'The user account has been disabled. Please contact support for assistance.';
                    break;
                default:
                    message = 'An error occurred. Please try again later.';
                    break;
            }
            toast.error(message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("User already exists");
            } else {
                const { displayName, email, photoURL } = user;
                const date = new Date().toISOString();
                const userRef = collection(db, "users");
                await setDoc(doc(userRef, user.uid), {
                    uid: user.uid,
                    createdAt: date,
                    displayName,
                    email,
                    photoURL,
                    token: "null"
                });
                await setDoc(doc(db, "userChats", user.uid), {});
                console.log("User document created");
            }
            navigate("/");
        } catch (error) {
            let message = 'An error occurred. Please try again later.';
            switch (error.code) {
                case 'auth/too-many-requests':
                    message = 'Too many requests. Please try again later.';
                    break;
                case 'auth/popup-closed-by-user':
                    message = 'The sign-in popup was closed. Please try again.';
                    break;
                default:
                    message = 'An error occurred. Please try again later.';
                    break;
            }
            toast.error(message);
        }
    };

    const handleResetPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setEmail("");
            setPassword("");
            toast.info("Password reset email sent!");
        } catch (error) {
            let message = 'An error occurred. Please try again later.';
            switch (error.code) {
                case 'auth/missing-email':
                    message = 'Enter your E-Mail Address.';
                    break;
                case 'auth/invalid-email':
                    message = 'Invalid email address. Please enter a valid email.';
                    break;
                case 'auth/user-not-found':
                    message = "User doesn't exist! Please sign up.";
                    break;
                case 'auth/too-many-requests':
                    message = 'Too many requests. Please try again later.';
                    break;
                default:
                    message = 'An error occurred. Please try again later.';
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
                        <div className="header-text mb-3">
                            <h2 className='text-primary bold-text'>Welcome Back!</h2>
                            <h4 className='text-primary bold-text'>Enter your credentials to access your account.</h4>
                        </div>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control form-control-lg bg-light text-secondary fs-6" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="input-group mb-1">
                            <input type="password" className="form-control form-control-lg bg-light text-secondary fs-6" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="input-group d-flex justify-content-end fs-6 mb-3">
                            <button className='btn btn-link text-secondary' onClick={handleResetPassword}>Forgot Password?</button>
                        </div>
                        <div className="input-group mb-3">
                            <button className="btn btn-lg btn-primary w-100 fs-5 bold-text" onClick={handleEmailSignIn}>Sign In</button>
                        </div>
                        <div className="input-group mb-3">
                            <button className="btn btn-lg btn-light text-primary w-100 fs-6" onClick={handleGoogleSignIn}>
                                <span className='fs-5 bold-text'>Sign In with <img src={GoogleIcon} style={{ width: "25px" }} className="me-2 mx-2" alt="" /></span>
                            </button>
                        </div>
                        <div class="row">
                            <p className='fs-6 text-center mb-3'>Don't have an account? <Link to="/register">Sign Up</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
