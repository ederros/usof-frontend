import React, { useEffect, useRef, useState } from 'react';

const Avatar = ({ imagePath , size = 50}) => {
    if(!imagePath) {
        imagePath = 'images/noavatar.png';
    }
    const fileName = imagePath.split('\\').pop();
    const profilePicture = 'images/' + fileName; 
    function standby() {
        document.getElementById('myAvatar').src = 'http://localhost:3000/images/noavatar.png';
    }

    return (
        <div>            
            <img width={size} height={size} id="myAvatar" src= {process.env.REACT_APP_API_URL + '/' + profilePicture} alt="Avatar"  onError={standby}/>
        </div>
    );
};

export default Avatar;
