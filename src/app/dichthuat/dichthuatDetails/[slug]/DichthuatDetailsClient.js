'use client';

import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import PageForm from '@/component/PageForm/PageForm';
import ItemCard from '@/component/ItemCard/ItemCard';
import { getKeyValueFromFireBase, getValueFromPath } from '@/component/firebase/Firebase';
import WaitingLoad from '@/component/WaitingLoad/WaitingLoad';
import Link from 'next/link';
// import { isLogin } from '@/component/publicFc/PublicFunction';
// import { isAdmin } from '@/component/publicFc/PublicFunction';

export default function DichThuatDetailsClient({ slug }) {
    const [dichthuats, setDichthuats] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flagAdmin, setFlagAdmin] = useState(false);
    const [flagLogin, setFlagLogin] = useState(false);

    useEffect(() => {
        if (slug) {
            getDichThuat();
            isAdmin();
            isLogin();
          
        }

        
    }, [slug]);
    
    const isLogin =()=>{
        const MyUserName = localStorage.getItem("name");
        if(MyUserName) setFlagLogin(true)
    }
    
    const isAdmin=()=>{
        const user = localStorage.getItem("user");
        if(user=="duong171099") setFlagAdmin(true);
    }
    const getDichThuat = async () => {
        setLoading(true);

        const allData = JSON.parse(localStorage.getItem("allData"));
        const dichthuatData = allData.find(item => item.key === "dichthuat");
        // console.log(dichthuatData)
        const listBaihocData = dichthuatData.value[slug].listBaihoc;
        const dichthuatSlugData= dichthuatData.value[slug]

        const dichthuatPath = `/users/dichthuat/${slug}/listBaihoc`;
        // const dichthuats = await getKeyValueFromFireBase(dichthuatPath);
        const dichthuats = Object.entries(listBaihocData).map(([key, value]) => ({ key, value }));

        if (dichthuats && dichthuats.length > 0) {
            setDichthuats(dichthuats);

            const dataPromises = dichthuats.map(async (dichthuat) => {
                const key = dichthuat.key;
                const dataReturn = listBaihocData[key];
                // console.log(dataReturn);
                return {
                    key,
                    // tieude: await getValueFromPath(`${dichthuatPath}/${key}/tieude`),
                    // youtubeLinkToGetImg: await getValueFromPath(`${dichthuatPath}/${key}/link`),
                    // tieudeTiengTrung: await getValueFromPath(`${dichthuatPath}/${key}/tieudeTiengTrung`),
                    // author: await getValueFromPath(`/users/dichthuat/${slug}/author`),
                    // imgAuthor: await getValueFromPath(`/users/dichthuat/${slug}/imgAuthor`),
                    tieude: dataReturn.tieude,
                    youtubeLinkToGetImg: dataReturn.link,
                    tieudeTiengTrung: dataReturn.tieudeTiengTrung,
                    author: dichthuatSlugData.author,
                    imgAuthor: dichthuatSlugData.imgAuthor,
                };
            });

            const dataResults = await Promise.all(dataPromises);
            setData(dataResults);
        }
        setLoading(false);
    };

    const setVideoName = (name, id, link) => {
        localStorage.setItem("video", name);
        localStorage.setItem("videoId", id);
        localStorage.setItem("link", link);
    };

    const getYoutubeId = (link) => {
        var yt = link&&link.split('=');
        // console.log(yt);
        const videoId = yt[1] ? yt[1].split('&')[0] : "null";
        return videoId;
    };
    const renderAddButton = () =>{
        if(flagAdmin){
            return (
                <Link href={`/dichthuat/baidichHandle/${slug}`}>
                    <Button variant="info">
                        Edit
                        <i className="fa-solid fa-calendar-plus"></i>
                    </Button>
                </Link>
            )
        }
        else return null;
    }

    return (
       
        <PageForm flagAdmin={flagAdmin} flagLogin={flagLogin}
            body={
                
                <div>
                    {renderAddButton()}
                    <div className='dichthuat-container row row-cols-6 row-cols-xxxxxl-5 row-cols-xxxxl-4 row-cols-xl-3 row-cols-lg-2 gy-6 gx-xxl-2 gx-xl-3 gx-lg-2'>
                        {data.map((dichthuat, index) => {
                            const tieude = dichthuat.tieude;
                            const tieudeTiengTrung = dichthuat.tieudeTiengTrung;
                            const author = dichthuat.author;
                            const imgAuthor = dichthuat.imgAuthor;
                            const youtubeLinkToGetImg = dichthuat.youtubeLinkToGetImg;
                            const id = getYoutubeId(youtubeLinkToGetImg);

                            return (
                                <ItemCard
                                    cardClick={() => setVideoName(dichthuat.key, id, youtubeLinkToGetImg)}
                                    webLink={youtubeLinkToGetImg}
                                    tieudeTiengTrung={tieudeTiengTrung}
                                    author={author}
                                    imgAuthor={imgAuthor}
                                    key={index}
                                    link={`/dichthuat/dichthuatViewer/${slug}/${dichthuat.key}`}
                                    title={tieude}
                                    titleDescription="Description"
                                    img={id ? `https://img.youtube.com/vi/${id}/sddefault.jpg` : null}
                                    alt="IMG Link"
                                />
                            );
                        })}
                    </div>
                    {loading ? <WaitingLoad /> : null}
                </div>
            }
        />
    );
}
