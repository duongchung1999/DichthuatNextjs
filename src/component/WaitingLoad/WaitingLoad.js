import React, { Component } from 'react';
// import './WaitingLoad.css';
import loadingGif from '@/assets/image/Loading.gif';
import Image from 'next/image';

export default class WaitingLoad extends Component {
    render() {
        return (
            <div className='loadingData'>
                <div className='loadingData-container'>
                <Image 
                        src={loadingGif} 
                        alt='Loading...' 
                        width={100} // Đặt chiều rộng phù hợp
                        height={100} // Đặt chiều cao phù hợp
                    />
                    <h2>Website đang tải dữ liệu, xin vui lòng chờ trong giây lát</h2>
                </div>
            </div>
        );
    }
}
