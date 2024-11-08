import React, { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale'; 
import Link from 'next/link'; 
// import './ItemCard.css';
import userImage from '@/assets/image/user.jpg';
import Image from 'next/image';

const ItemCardDashboard = React.memo((props) => {
    const [isFullTextShown, setIsFullTextShown] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const MAX_ITEMS = 3; 
    const truncateText = (text, maxLength) => {
        // if (text && text.length > maxLength) {
        //     return (
        //         <>
        //             {text.substring(0, maxLength)}...
        //             <span className="see-more">
        //                 <Link href={props.link} legacyBehavior>
        //                     <a>xem thêm</a>
        //                 </Link>
        //             </span>
        //         </>
        //     );
        // }
        // return text;
        if (!isFullTextShown && text && text.length > maxLength) {
            return (
                <>
                    {text.substring(0, maxLength)}...
                    <span 
                        className="see-more" 
                        onClick={() => isFullTextDoubleClick()}
                        style={{ cursor: 'pointer', color: 'blue' }}
                    >
                        xem thêm
                    </span>
                </>
            );
        }
        return text;
    };
    const isFullTextDoubleClick =() =>{
        setIsFullTextShown(!isFullTextShown)
    }

    const formatDateTime = (dateTime) => {
        if (!dateTime) return '';
        try {
            const date = new Date(dateTime);
            return format(date, "h:mm a, dd 'Tháng' MM, yyyy", { locale: vi });
        } catch (error) {
            console.error('Invalid date format:', dateTime);
            return dateTime;
        }
    };

    const [isLiked, setIsLiked] = useState(false);
    const [commentText, setCommentText] = useState('');



    const handleLikeClick = () => {
        setIsLiked(!isLiked);
        props.likeClick();
    };

    const handleCommentChange = (e) => {
        // setCommentText(e.target.value);
        if (props.onChangeHandle) {
            props.onChangeHandle(e);
        }
    };

    const renderTrash=()=>{
        const MyUserName = localStorage.getItem("name");
        // console.log(props.username)
        if(props.username==MyUserName){
            return (
                <div className='itemCard-UserName-1'>
                    <button
                        className="btn btn-options"
                        onClick={props.removeClick}
                        style={{ padding: '0', margin: '0' }}
                    >
                        <i className="fa-solid fa-trash" />
                    </button>
                </div>
            )
        }
        else return null;
    }

    const renderLikeArea=()=>{
        const MyUserName = localStorage.getItem("name");
        if(MyUserName) {
            return (
                <div className='row'>
                            <div className='col-6 ItemCard-interact-item' onClick={handleLikeClick}>
                                <div className={`ItemCard-interact-item-flex ${props.isLiked ? 'liked' : ''}`}>
                                    <i className={`fa-regular fa-thumbs-up ${props.isLiked ? 'liked-icon' : ''}`}></i>
                                    <span>Thích</span>
                                </div>

                            </div>

                            <div className='col-6 ItemCard-interact-item' onClick={props.cmtClick}>
                                <div className='ItemCard-interact-item-flex'>
                                    <i className="fa-regular fa-comment"></i>
                                    <span>Bình luận</span>
                                </div>

                            </div>
                </div>
            )
        }
        else return null;

    }

    const renderCommentInput=()=>{
        const MyUserName = localStorage.getItem("name");
        const imgUser = localStorage.getItem("userImage")||userImage;
        if(MyUserName){
            return(
                <div className='itemCard-comment-write'>
                    <div className='itemCard-user-image'>
                        <Image src={imgUser} alt="img"  width={500} height={500}/>
                    </div>
                
                    <div className='comment-input-container'>
                        <textarea
                            className="form-control comment-input"
                            name={props.name}
                            aria-describedby="helpId"
                            placeholder={"Bình luận với vai trò " + MyUserName}
                            onChange={handleCommentChange}
                            value={props.commentText}
                        ></textarea>
                        <div className={`itemCard-comment-send  ${props.commentText ? 'active1' : 'no-item'}`}
                            onClick={props.sendCmtHandle}>
                            <i className={`fa-solid fa-paper-plane`}></i>
                        </div>
                    </div>

                </div> 
            )
        }
        else return null;
    }


    const renderBaidich=()=>{
        if (props.tiengTrungs) {
            const tiengTrungsArray = Object.values(props.tiengTrungs);
            // const dichNghiaArray = Object.values(props.dichNghias);

            if (tiengTrungsArray.length > 0) {
                return (
                    <div className="itemCard-baiDich" onDoubleClick={()=>setIsExpanded(!isExpanded)}>
                        {tiengTrungsArray
                            .slice(0, isExpanded ? tiengTrungsArray.length : MAX_ITEMS)
                            .map((tiengTrung, index) => (
                                <div key={index} className="textDashboard_container">
                                    <pre className="tiengTrung_Dashboard simsun">
                                        {tiengTrung.value}
                                    </pre>
                                    <pre className="dichNghia_Dashboard cambria">
                                        {props.dichNghias[index] ? props.dichNghias[index].value : null}
                                    </pre>
                                </div>
                            ))}
                        {!isExpanded && tiengTrungsArray.length > MAX_ITEMS && (
                            <span 
                                className="see-more" 
                                onClick={() => setIsExpanded(true)} 
                                style={{ cursor: 'pointer', color: 'blue' }}
                            >
                                ...xem thêm
                            </span>
                        )}
                    </div>
                );
            } else return null;
        } 

        else if(props.baidich)
        return (
            <div className='itemCard-baiDich'>
                {props.img ?
                    <pre  onDoubleClick={() => isFullTextDoubleClick()}>
                        {truncateText(props.baidich, 300)}
                    </pre>
                    :
                    <pre>
                        {props.baidich}
                    </pre>}
            </div>
        )
    }

    return (
        <div className='itemCard-container-dashboard' onClick={props.cardClick} onMouseEnter={props.cardClick}>
            <div className='itemCard-UserName'>
                <div className='itemCard-UserName-1'>
                    <Image src={props.imgUser ? props.imgUser : userImage} alt="img"
                    width={50} 
                    height={50}/>
                    <div className='itemCard-UserName-container cambria'>
                        <h4 className='username-card'>{props.username}</h4>
                        <p style={{ margin: '0' }}>{formatDateTime(props.dateTime)}</p>
                    </div>
                </div>
                {renderTrash()}
            </div>

            {/* <div className='itemCard-baiDich'>
                {props.img ?
                    <pre  onDoubleClick={() => isFullTextDoubleClick()}>
                        {truncateText(props.baidich, 300)}
                    </pre>
                    :
                    <pre>
                        {props.baidich}
                    </pre>}
            </div> */}
            {renderBaidich()}
            {props.img && <Link href={props.link} passHref legacyBehavior>
                <a className="itemCard-title-dashboard" onClick={props.cardClick}>
                    <Image src={props.img} alt="null" width={500} height={500}/>
                </a>
            </Link>}

            <div className='itemCard-content'>
                {props.img && <h3 className='itemCard-content-title cambria'>{props.title}</h3>}
                {props.img && <div className='itemCard-content-description simsun'>
                    <span>{props.tieudeTiengTrung}</span>
                </div>}
                <div className='ItemCard-dashboard-footer'>
                    <div className='ItemCard-interact'>
                        <div className='ItemCard-interact-likeview'>
                            <div className='liked-view'>
                                <i className="fa-solid fa-thumbs-up"></i>
                            </div>

                            <span className='ItemCard-interact-liked'>
                                <div>{props.likes}</div>
                            </span>
                        </div>
                        <hr />
                        {renderLikeArea()}
                    </div>
                    <div className='itemCard-comment'>
                        <div className='itemCard-comment-container'>
                            <div className='itemCard-comment-viewer'>
                                {props.comment}
                            </div>
                            
                            {renderCommentInput()}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
});

ItemCardDashboard.displayName = 'ItemCardDashboard';

export default ItemCardDashboard;
