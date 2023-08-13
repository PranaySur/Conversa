import { createContext, useReducer, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// The ChatContext provides the chat-related context for the application.
export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);

    const INITIAL_STATE = {
        chatId: "null",
        user: {},
    };
    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId:
                        currentUser.uid > action.payload.uid
                            ? currentUser.uid + action.payload.uid
                            : action.payload.uid + currentUser.uid,
                };
            case "CLOSE_USER":
                return {
                    user: {},
                    chatId: "null",
                };
            case "DELETE_USER":
                return {
                    user: {},
                    chatId: "null",
                };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};