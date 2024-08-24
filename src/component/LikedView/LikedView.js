// import './LikedView.css';
import React, { useState,useEffect } from 'react';

const LikedView = ({ likes }) => {
    const [isShowLiked, setIsShowLiked] = useState(false);
    const [isYouLike, setIsYouLike] = useState(false);

    useEffect(()=>{
        checkYouLike();
    })

    const showLikeClick = () => {
        setIsShowLiked(!isShowLiked);
    }

    const MyUserName = localStorage.getItem("name");
    const checkYouLike = () => {
        likes&&likes.map((like) =>{
            if(like.username === MyUserName){
                setIsYouLike(true);
            }
        })
    }
    
    // console.log(likes)

    return (
        <div className='likeView-controller'>
            <div className='likeView-header' onClick={showLikeClick}>
                {likes[0]?((isYouLike?"Bạn":likes[0].username) + (likes[1]?(" và " + (likes.length - 1) + " người khác"):"")):null}
            </div>
            <div className={isShowLiked ? 'likeView-detailes' : 'hidden'}>
                {likes && likes.map((like, index) => (
                    <div key={index} className='liked-user'>
                        <span>{like.username}</span>    
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LikedView;
