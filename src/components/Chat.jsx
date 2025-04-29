import React, { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from '../App';
import { db } from "./Firebase";
import { set, ref, onChildAdded, onChildRemoved, remove, get } from "firebase/database";

function Chat() {
    const { setShowChat, setPopUpValue, userData, filterName } = useContext(AppContext);
    const [startAnimation, setStartAnimation] = useState(false);
    const [failedFetchingImage, setFailedFetchingImage] = useState(false);
    const [messages, setMessages] = useState([]);
    const [sendingMessage, setSendingMessage] = useState(false);

    const MessagesInpRef = useRef(null);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        if (startAnimation) {
            setTimeout(() => {
                setShowChat(false);
            }, 170)
        }
    }, [startAnimation, setShowChat])

    useEffect(() => {
        onChildAdded(ref(db, "chat"), () => {
            getMessages();
        })
        onChildRemoved(ref(db, "chat"), () => {
            getMessages();
        })
    }, [])

    useEffect(() => {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }, [messages])

    const getMessages = () => {
        get(ref(db, "chat")).then((snapShot) => {
            const fetched_messages = snapShot.val();
            if (fetched_messages) {
                const messagesIds = Object.keys(fetched_messages);
                setMessages([]);
                for (let i = 0; i < messagesIds.length; i++) {
                    setMessages((prevMessages) => [...prevMessages, fetched_messages[messagesIds[i]]]);
                }
            } else {
                setMessages([]);
            }
        })
    }

    const sendMessage = () => {
        const messageValue = MessagesInpRef.current.value.trim();
        if (!sendingMessage) {
            if (messageValue) {
                const messageData = {
                    id: new Date().getTime(),
                    text: messageValue,
                    name: userData.username,
                    user_id: localStorage.getItem("user"),
                };
                MessagesInpRef.current.value = "";
                setSendingMessage(true);
                set(ref(db, "chat/" + messageData.id), messageData).then(() => {
                    setSendingMessage(false);
                    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
                })
            } else {
                setPopUpValue("Your messages input is empty.")
            }
        } else {
            setPopUpValue("Please wait! Another message is still sending...");
        }
    }

    const deleteMessage = (id) => {
        remove(ref(db, "chat/" + id)).then(() => {
            getMessages();
        })
    }

    return (
        <div className={"chat_container " + (startAnimation && "leaveChatAnimation")}>
            {!failedFetchingImage && <img src="download.jpg" alt="background_image" onError={() => setFailedFetchingImage(true)} />}
            <div className="title"><i onClick={() => setStartAnimation(true)} className={"leave_chat bi-chevron-left " + (failedFetchingImage && "no_image")}></i><i className="bi bi-chat-dots-fill"></i> Public Chat</div>
            <div ref={messagesContainerRef} className="messages">
                {
                    messages.map((message, i) => {
                        return (
                            message.user_id === localStorage.getItem("user") ?
                                <div className="message me" key={"msg_" + i} id={"msg_" + message.id}>
                                    <div className="content">
                                        <div className="message_content">
                                            <p className="message_text">{message.text}</p>
                                            <i onClick={() => deleteMessage(message.id)} className="bi bi-trash3-fill"></i>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div id={"msg_" + message.id} key={"msg_" + i} className={"message user " + (failedFetchingImage && "no_image")}>
                                    <div className="content">
                                        <div className="from">{filterName(message.name)}</div>
                                        <div className="message_content">
                                            <p className="message_text">{message.text}</p>
                                        </div>
                                    </div>
                                </div>
                        )
                    })
                }
            </div>
            <div className="send_message_content">
                <input ref={MessagesInpRef} type="text" placeholder='Enter your message....' />
                <button onClick={sendMessage} className={failedFetchingImage ? "no_image" : ""}>{sendingMessage ? <span></span> : "+"}</button>
            </div>
        </div>
    )
}

export default Chat