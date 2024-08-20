import React, { useEffect, useRef, memo, Suspense } from 'react';
import Image from 'next/image';

const ItemCardYoutube = memo((props) => {
        return (
        <div className='itemCard-container' onClick={props.cardClick} onMouseEnter={props.cardClick}>
            <div className="itemCard-title">
                <div className='itemCard-img-des'>
                    {/* <h2>{props.title}</h2>
                    <h4>{props.titleDescription}</h4> */}
                </div>
                <ShowYoutube link={props.videoLink}/>
            </div>

            <div className='itemCard-content'>
                <h3 className='itemCard-content-title'>{props.title}</h3>
                <h4 className='itemCard-content-description'>
                    {props.tieudeTiengTrung}
                </h4>
                <div className='itemCard-content-author'>
                    <div className='itemCard-content-author-container'>
                        <Image src={props.imgAuthor} alt="img" width={500} height={500}/>
                        <a href={props.webLink} target='_blank' rel='noreferrer'>
                            <h4>{props.author}</h4>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
});
ItemCardYoutube.displayName="ItemCardYoutube"

export default ItemCardYoutube;

function ShowYoutube(props) {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <iframe 
                // width="100%"
                ref={props.iframeRef}
                height={props.height}
                src={props.link}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
            ></iframe>
        </Suspense>
    );
}
