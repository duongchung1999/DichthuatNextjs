"use client"
import Link from 'next/link';
import React from 'react';
import './ItemCard.css';
import Image from 'next/image';

const ItemCard = React.memo((props) => {
    return (
        <div className='col-3' style={{ marginTop: "20px" }} >
            <div className='itemCard-container' onClick={props.cardClick} onMouseEnter={props.cardClick}>
                <Link className="itemCard-title" href={props.link} target="_self" onClick={props.cardClick}>
                    {/* <div className='itemCard-img-des'>
                        <h2>{props.title}</h2>
                        <h4>{props.titleDescription}</h4>
                    </div> */}

                    <Image src={props.img} alt="null" />
                </Link>

                <div className='itemCard-content'>
                    <h3 className='itemCard-content-title'>{props.title}</h3>
                    <div className='itemCard-content-description'>
                        <span>{props.tieudeTiengTrung}</span>
                    </div>
                    <div className='itemCard-content-author'>
                        <div className='itemCard-content-author-container'>
                            <Image src={props.imgAuthor} alt="img" />
                            <a href={props.webLink} target='_blank' >
                                <h4>{props.author}</h4>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ItemCard;
