import React from 'react'

function NoInternetConnection() {
  return (
    <div className="no_connection">
        <div className="content">
            <i className='bi bi-wifi-off'></i>
            <p>No Internet Connection. Please, Connect To The Internet.</p>
        </div>
    </div>
  )
}

export default NoInternetConnection;