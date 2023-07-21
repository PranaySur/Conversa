import { React, useState } from 'react';
import Sidebar from "./sidebar";
import Chat from "./chat";
import { motion } from "framer-motion";

const Home = () => {
    const [activeChat, setActiveChat] = useState(null);
    return (
        <div className='home'>
            <motion.div className="home-container" initial="initialState" animate="animateState" exit="exitState" transition={{ duration: 0.5 }} variants={{ initialState: { opacity: 0, clipPath: "circle(0.0% at 50% 50%)", }, animateState: { opacity: 1, clipPath: "circle(100% at 50% 50%)", }, exitState: { opacity: 0, clipPath: "circle(0.0% at 50% 50%)", }, }}>
                <Sidebar setActiveChat={setActiveChat} activeChat={activeChat} />
                <Chat />
            </motion.div>
        </div>
    );
};

export default Home;