import { React, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import { AuthContext } from "../context/AuthContext"
import Logout from '@mui/icons-material/PowerSettingsNew';

const Navbar = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const handleLogout = () => {
        try{
            signOut(auth);
            navigate("/login");
        }catch(error){
            console.log(error);
        }
    }
    return (
        <div className='navbar'>
            <span className="logo">Conversa</span>
            <div className="user">
                <img src={currentUser.photoURL} alt="" />
                <button className='btn-logout' onClick={handleLogout}><Logout /></button>
            </div>
        </div>
    );
}

export default Navbar;