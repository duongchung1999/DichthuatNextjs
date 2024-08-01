import Link from 'next/link';
import React from 'react';
import './ItemCard.css';
import Image from 'next/image';

const defaultImage = 'https://www.lifedna.com.tw/upload-files/motto/pic/1291771141.jpg?v=2016'; // Đường dẫn đến hình ảnh mặc định
const defaultAuthorImage = 'https://yt3.googleusercontent.com/ytc/AIdro_nevnvE7nYPdcdQLMZgoxJsx1g62U2soHKg3PAG3rQE0g=s160-c-k-c0x00ffffff-no-rj'; // Đường dẫn đến hình ảnh tác giả mặc định

const ItemCard = React.memo((props) => {
    return (
        <div className='col-4' style={{ marginTop: "20px" }} >
            <div className='itemCard-container' onClick={props.cardClick} onMouseEnter={props.cardClick}>
                <Link className="itemCard-title" href={props.link} target="_self" onClick={props.cardClick}>
                    <Image src={props.img || defaultImage} alt="Item Image" width={500} height={500}/>
                </Link>

                <div className='itemCard-content'>
                    <h3 className='itemCard-content-title'>{props.title}</h3>
                    <div className='itemCard-content-description'>
                        <span>{props.tieudeTiengTrung}</span>
                    </div>
                    <div className='itemCard-content-author'>
                        <div className='itemCard-content-author-container'>
                            <Image src={props.imgAuthor || defaultAuthorImage} alt="Author Image" width={30} height={30}/>
                            <a href={props.webLink} target='_blank'>
                                <h4>{props.author}</h4>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
ItemCard.displayName = 'ItemCard';
export default ItemCard;
