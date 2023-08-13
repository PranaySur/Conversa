import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Renders the root component of the application, wrapped in context providers.
root.render(
    <AuthContextProvider>
        <ChatContextProvider>
            <React.StrictMode>
                <ToastContainer theme="dark" position="top-right" autoClose={1500} closeOnClick pauseOnHover={false} />
                <App />
            </React.StrictMode>
        </ChatContextProvider>
    </AuthContextProvider>
);