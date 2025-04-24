import React, { useContext , useEffect , useState } from 'react'
import { AppContext } from '../App'

function Chat() {
    const { setShowChat } = useContext(AppContext);
    const [startAnimation , setStartAnimation] = useState(false);
    const [failedFetchingImage , setFailedFetchingImage] = useState(false);

    useEffect(() => {
        if(startAnimation) {
            setTimeout(() => {
                setShowChat(false);
            },170)
        }
    },[startAnimation , setShowChat])

    return (
        <div className={"chat_container " + (startAnimation && "leaveChatAnimation")}>
            {!failedFetchingImage && <img src="download.jpg" alt="background_image" onError={() => setFailedFetchingImage(true)} />}
            <div className="title"><i onClick={() => setStartAnimation(true)} className={"leave_chat bi-chevron-left " + (failedFetchingImage && "no_image")}></i><i className="bi bi-chat-dots-fill"></i> Public Chat</div>
            <div className="messages">
                <div className="message me">
                    <div className="content">
                        <div className="message_content">
                            <p className="message_text">Hello World</p>
                            <i className="bi bi-trash3-fill"></i>
                        </div>
                    </div>
                </div>
                <div className="message me">
                    <div className="content">
                        <div className="message_content">
                            <p className="message_text">Hello World</p>
                            <i className="bi bi-trash3-fill"></i>
                        </div>
                    </div>
                </div>
                <div className={"message user " + (failedFetchingImage && "no_image")}>
                    <div className="content">
                        <div className="from">User Name</div>
                        <div className="message_content">
                            <p className="message_text">Hello World</p>
                        </div>
                    </div>
                </div>
                <div className={"message user " + (failedFetchingImage && "no_image")}>
                    <div className="content">
                        <div className="from">Hello World...</div>
                        <div className="message_content">
                            <p className="message_text">Hello World Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores officiis quisquam illum totam animi rem assumenda soluta quis quibusdam minima.</p>
                        </div>
                    </div>
                </div>
                <div className={"message user " + (failedFetchingImage && "no_image")}>
                    <div className="content">
                        <div className="from">User Name</div>
                        <div className="message_content">
                            <p className="message_text">Hello World</p>
                        </div>
                    </div>
                </div>
                <div className={"message user " + (failedFetchingImage && "no_image")}>
                    <div className="content">
                        <div className="from">User Name</div>
                        <div className="message_content">
                            <p className="message_text">Hello World</p>
                        </div>
                    </div>
                </div>
                <div className="message me">
                    <div className="content">
                        <div className="message_content">
                            <p className="message_text">Hello World Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto eveniet illo dignissimos, nostrum corrupti assumenda voluptate tenetur sapiente. Ad, necessitatibus.</p>
                            <i className="bi bi-trash3-fill"></i>
                        </div>
                    </div>
                </div>
                <div className={"message user " + (failedFetchingImage && "no_image")}>
                    <div className="content">
                        <div className="from">User Name</div>
                        <div className="message_content">
                            <p className="message_text">Hello World</p>
                        </div>
                    </div>
                </div>
                <div className={"message user " + (failedFetchingImage && "no_image")}>
                    <div className="content">
                        <div className="from">User Name</div>
                        <div className="message_content">
                            <p className="message_text">Hello World</p>
                        </div>
                    </div>
                </div>
                <div className="message me">
                    <div className="content">
                        <div className="message_content">
                            <p className="message_text">Hello World</p>
                            <i className="bi bi-trash3-fill"></i>
                        </div>
                    </div>
                </div>
                <div className={"message user " + (failedFetchingImage && "no_image")}>
                    <div className="content">
                        <div className="from">User Name</div>
                        <div className="message_content">
                            <p className="message_text">Hello World</p>
                        </div>
                    </div>
                </div>
                <div className="message me">
                    <div className="content">
                        <div className="message_content">
                            <p className="message_text">Hello World</p>
                            <i className="bi bi-trash3-fill"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="send_message_content">
                <input type="text" placeholder='Enter your message....' />
                <button className={failedFetchingImage ? "no_image" : ""}>+</button>
            </div>
        </div>
    )
}

export default Chat