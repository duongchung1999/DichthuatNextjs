'use client'
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import PageForm from '@/component/PageForm/PageForm';
import ItemCard from '@/component/ItemCard/ItemCard';
import { getKeyValueFromFireBase, getValueFromPath } from '@/component/firebase/Firebase';
import WaitingLoad from '@/component/WaitingLoad/WaitingLoad';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function DichThuatDetails({ params }) {
    const slug = params.slug;
    const id = params.id;
    const [dichthuats, setDichthuats] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug && id) {
            getDichThuat();
        }
    }, [slug, id]);

    const getDichThuat = async () => {
        setLoading(true);
        const dichthuatPath = `/users/dichthuat/${slug}/listBaihoc`;
        const dichthuats = await getKeyValueFromFireBase(dichthuatPath);

        if (dichthuats && dichthuats.length > 0) {
            setDichthuats(dichthuats);

            const dataPromises = dichthuats.map(async (dichthuat) => {
                const key = dichthuat.key;
                return {
                    key,
                    tieude: await getValueFromPath(`${dichthuatPath}/${key}/tieude`),
                    youtubeLinkToGetImg: await getValueFromPath(`${dichthuatPath}/${key}/link`),
                    tieudeTiengTrung: await getValueFromPath(`${dichthuatPath}/${key}/tieudeTiengTrung`),
                    author: await getValueFromPath(`/users/dichthuat/${slug}/author`),
                    imgAuthor: await getValueFromPath(`/users/dichthuat/${slug}/imgAuthor`),
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
        var yt = link.split('=');
        const videoId = yt[1] ? yt[1].split('&')[0] : "null";
        return videoId;
    };

    return (
        <PageForm
            body={
                <div>
                    <Link href={`/dichthuat/baidichHandle/${slug}`}>
                        <Button variant="info">
                            Edit
                            <i className="fa-solid fa-calendar-plus"></i>
                        </Button>
                    </Link>
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