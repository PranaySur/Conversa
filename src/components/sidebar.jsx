import { React } from 'react'
import Navbar from "./navbar"
import Search from "./search"
import Chats from "./chats"

const Sidebar = ({ setActiveChat, activeChat }) => {
    return (
        <div className='sidebar'>
            <Navbar />
            <Search />
            <div className="wrap">
                <Chats setActiveChat={setActiveChat} activeChat={activeChat} />
            </div>
        </div>
    );
}

export default Sidebar;