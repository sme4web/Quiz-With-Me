import React , { useContext } from 'react'
import { AppContext } from '../App';

function PopUpMessage(prop) {
    const { setPopUpValue } = useContext(AppContext);
    return (
        <div className="pop_up_container">
            <div className="content">
                <div className="title">Pop Up Message</div>
                <p className="message">{prop.value}</p>
                <button onClick={() => setPopUpValue("")}>Close</button>
            </div>
        </div>
    )
}

export default PopUpMessage;