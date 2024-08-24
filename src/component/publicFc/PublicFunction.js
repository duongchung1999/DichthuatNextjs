import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
// import './PublicFunction.css'
import React, { useState,Component } from 'react';
import userImage from '@/assets/image/user.jpg';
import Image from 'next/image';

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



function ItemCardUserPost(props){
    const renderTrash =()=>{
        const MyUserName = localStorage.getItem("name");
        console.log(MyUserName)
        if (props.username==MyUserName){
            return(
                <div className='itemCard-UserName-1'> 
                    <button
                        className="btn btn-options"
                        // id="sidebarToggle"
                        onClick={props.removeClick}
                        style={{padding:'0',margin:'0'}}
                    >
                        <i className="fa-solid fa-trash" />
                    </button>
                </div>
            )
        }
        else return null
    }
    return(
         <div className='itemCard-container-dashboard' ref={props.refViewBaidich}>
            <div className='itemCard-UserName itemcard-UserName-sticky'>
                <div className='itemCard-UserName-1'>
                    <Image src={props.imgUser ? props.imgUser : userImage} alt="img" width={30} height={30}/>
                    <div className='itemCard-UserName-container'>
                        <h4 className='username-card'>{props.username}</h4>
                        <p style={{ margin: '0' }}>{formatDateTime(props.dateTime)}</p>
                    </div>
                </div>
                {renderTrash()}
            </div>

            <div className='itemCard-baiDich'>
                <pre>
                    {props.baidich}
                </pre>
            </div>
         </div>
       
    )
}




export {formatDateTime}
export {ItemCardUserPost}