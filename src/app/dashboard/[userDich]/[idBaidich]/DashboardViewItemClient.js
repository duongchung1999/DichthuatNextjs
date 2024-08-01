'use client'
import React, { useEffect, useState, useRef } from 'react';
import PageForm from '@/component/PageForm/PageForm';
import { getValueFromPath, DeleteKeyFromFirebase } from '@/component/firebase/Firebase';
import ItemCardYoutube from '@/component/ItemCardYoutube/ItemCardYoutube'; 
import WaitingLoad from '@/component/WaitingLoad/WaitingLoad';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale'; 
import { ItemCardUserPost } from '@/component/publicFc/PublicFunction';

export default function DashboardViewItemClient ({userDich,idBaidich}){
    const [state, setState] = useState({
        youtubeLink: null,
        webLink: null,
        tieude: null,
        tieudeTiengTrung: null,
        author: null,
        imgAuthor: null,
        id: null,
        error: null,
        nav: false,
        baiDich: null,
        dateTime: null,
        userName: null
    });
    const [loading, setLoading] = useState(true);
    // const { userDich, idBaidich } = useParams();
    // const userDich = params.userDich;
    // const idBaidich = params.idBaidich;
    const [expandedItems, setExpandedItems] = useState({});
    const [showMeanings, setShowMeanings] = useState({});
    const containerCardRef = useRef(null);
    const viewBaidichDetailsRef = useRef(null);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (containerCardRef.current && viewBaidichDetailsRef.current) {
            const cardHeight = containerCardRef.current.offsetHeight;
            viewBaidichDetailsRef.current.style.maxHeight = `${cardHeight}px`;
        }
    }, [loading]);

    const getData = async () => {
        setLoading(true);

        const user = localStorage.getItem("user");
        const baidichPath = `/users/dashboard/${userDich}/${idBaidich}`;
        const weblinkPath = `${baidichPath}/weblink`;
        const tieudeTiengTrungPath = `${baidichPath}/tieudeTiengTrung`;
        const tieudeBaidichPath = `${baidichPath}/tieude`;
        const authorPath = `${baidichPath}/author`;
        const imgAuthorPath = `${baidichPath}/imgAuthor`;
        const YoutubePath = `${baidichPath}/link`;
        const userDichPath = `${baidichPath}/baidich`;
        const dateTimePath = `${baidichPath}/dateTime`;
        const idPath = `${baidichPath}/id`;
        const userNamePath = `${baidichPath}/username`;
        const imgUserPath = `${baidichPath}/userImage`;

        const [
            tieude,
            youtubeLink,
            webLink,
            tieudeTiengTrung,
            author,
            imgAuthor,
            baiDich,
            dateTime,
            id,
            userName,
            imgUser,
        ] = await Promise.all([
            getValueFromPath(tieudeBaidichPath),
            getValueFromPath(YoutubePath),
            getValueFromPath(weblinkPath),
            getValueFromPath(tieudeTiengTrungPath),
            getValueFromPath(authorPath),
            getValueFromPath(imgAuthorPath),
            getValueFromPath(userDichPath),
            getValueFromPath(dateTimePath),
            getValueFromPath(idPath),
            getValueFromPath(userNamePath),
            getValueFromPath(imgUserPath),
        ]);

        setState(prevState => ({
            ...prevState,
            webLink,
            tieudeTiengTrung,
            tieude,
            author,
            imgAuthor,
            youtubeLink,
            user,
            baiDich,
            dateTime,
            id,
            userName,
            imgUser
        }));
        setLoading(false);
    };

    const highlightText = (text, highlight) => {
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <span key={index} style={{ color: 'red' }}>{part}</span>
            ) : (
                part
            )
        );
    };

    const toggleMeanings = (tuMoiKey) => {
        setShowMeanings({
            ...showMeanings,
            [tuMoiKey]: !showMeanings[tuMoiKey]
        });
    };

    const expandExamples = (tuMoiKey, nghiaKey) => {
        setExpandedItems({
            ...expandedItems,
            [tuMoiKey + '-' + nghiaKey]: true,
        });
    };

    const collapseExamples = (tuMoiKey, nghiaKey) => {
        setExpandedItems({
            ...expandedItems,
            [tuMoiKey + '-' + nghiaKey]: false,
        });
    };

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

    const removeClick = async (path) => {
        await DeleteKeyFromFirebase(path);
        getData();
    };

    const { userName, dateTime, imgUser, id, tieude, baiDich, webLink, tieudeTiengTrung, author, imgAuthor, youtubeLink } = state;
    const path = `/users/dashboard/${userDich}/${idBaidich}`;

    return (
        <PageForm
            body={
                <div>
                    <div className='dichthuat-container row'>
                        <div className='col-12 col-md-6 col-lg-6 col-xxl-2 gy-6 gx-2'>
                            <div className='dichthuat-container-card' ref={containerCardRef}>
                                <ItemCardYoutube
                                    videoLink={youtubeLink ? youtubeLink : null}
                                    webLink={webLink ? webLink : null}
                                    tieudeTiengTrung={tieudeTiengTrung ? tieudeTiengTrung : null}
                                    author={author ? author : null}
                                    imgAuthor={imgAuthor ? imgAuthor : null}
                                    title={tieude ? tieude : null}
                                />
                            </div>
                        </div>
                        <div className='col-12 col-md-6 col-lg-6 col-xxl-2 gy-6 gx-2'>
                            {imgUser && <ItemCardUserPost
                                        imgUser={imgUser}
                                        username={userName}
                                        dateTime={dateTime}
                                        baidich={baiDich}
                                        removeClick={() => removeClick(path)}
                                        refViewBaidich={viewBaidichDetailsRef}
                                    />}
                        </div>
                    </div>
                    {loading ? <WaitingLoad /> : null}
                </div>
            }
        />
    );
}
