import React, { useContext } from 'react';
import { AppContext } from '../App';

function ShowAllUsers() {
    const { otherUsers , setShowAllUsers , filterName } = useContext(AppContext);

    return (
        <div className="showAllUsers">
            <div className="main_content">
                <div className="title">All Users</div>
                <div className="users">
                    {otherUsers.length ? otherUsers.map((user, index) => {
                        return (
                            <div className="user" key={"user_" + index}>
                                <div className="content">
                                    <div className="left_side">
                                        <div className="rank">#{index + 11}</div>
                                        <div className="name">{filterName(user.username || "")}</div>
                                    </div>
                                    <div className="right_side">
                                        <div className="score">{user.score}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : <div className="no_users">No users found</div>}
                </div>
                <button className="show_all_users" onClick={() => setShowAllUsers(false)}>Leave Show All Users</button>
            </div>
        </div>
    )
}

export default ShowAllUsers;