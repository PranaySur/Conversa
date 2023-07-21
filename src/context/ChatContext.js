import { createContext, useReducer, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// The ChatContext provides the chat-related context for the application.
export const ChatContext = createContext();

/**
 * The ChatContextProvider component is responsible for managing the chat state and providing it to its children.
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The children components
 * @returns {JSX.Element} The rendered JSX element
 */
export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);

    const INITIAL_STATE = {
        chatId: "null",
        user: {},
    };

    /**
     * The chatReducer function defines how the chat state is updated based on dispatched actions.
     * @param {Object} state - The current chat state
     * @param {Object} action - The dispatched action
     * @returns {Object} The updated chat state
     */
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