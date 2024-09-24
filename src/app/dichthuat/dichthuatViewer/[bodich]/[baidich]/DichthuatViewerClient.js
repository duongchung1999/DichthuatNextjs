'use client'
import React, { useEffect, useState } from 'react';
import PageForm from '@/component/PageForm/PageForm';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { getValueFromPath, getKeyValueFromFireBase,AddDataToFireBaseNoKey } from '@/component/firebase/Firebase';
import ItemCardYoutube from '@/component/ItemCardYoutube/ItemCardYoutube';
import TumoiHandle from '@/component/TumoiHandle/TumoiHandle';
import WaitingLoad from '@/component/WaitingLoad/WaitingLoad';

export default function DichthuatViewerClient({bodich,baidich}) {
    const [state, setState] = useState({
        dichthuat: null,
        youtubeLink: null,
        webLink: null,
        tieude: null,
        tieudeTiengTrung: null,
        author: null,
        imgAuthor: null,
        id: null,
        error: null,
        nav: false,
        tuMois: {},
        tuMoiNghias: {},
        tuMoiNghiaGets: {},
        tuMoiPinyins: {},
        tumoiViduGets: {},
        tuMoiVidus: {},
        tuMoiViduDichs: {},
        tuMoiViduPinyins: {},
        hanviets: {},
        baiDich: null,
        tiengTrungs: {},
        dichNghias: {},
    });
    const [loading, setLoading] = useState(true);
    const [openTumoiForm, setOpenTumoiForm] = useState(false);
    // const { bodich, baidich } = useParams();
    // const bodich = params.bodich;
    // const baidich = params.baidich;
    const [expandedItems, setExpandedItems] = useState({});
    const [showMeanings, setShowMeanings] = useState({});
    // console.log(bodich,baidich)

    useEffect(() => {
        getData();
    }, []);

    const publishDashboard = async () =>{
        setLoading(true); 
    
        const user = localStorage.getItem("user");
        const userName = localStorage.getItem("name");
        const userImage = localStorage.getItem("userImage");

    
        
        const bdPath = `/users/dashboard/${user}/${baidich}`;
        const userNamePath = `${bdPath}/username`;
        const weblinkPath = `${bdPath}/weblink`;
        const tieudeTiengTrungPath = `${bdPath}/tieudeTiengTrung`;
        const tieudeBaidichPath = `${bdPath}/tieude`;
        const authorPath = `${bdPath}/author`;
        const imgAuthorPath = `${bdPath}/imgAuthor`;
        const YoutubePath = `${bdPath}/link`;
        const tiengTrungPath = `${bdPath}/tiengTrung`;
        const dichNghiaPath = `${bdPath}/dichNghia`;
        const datetimePath = `${bdPath}/dateTime`;
        const idPath = `${bdPath}/id`;
        const userImagePath = `${bdPath}/userImage`;
     
        const { tieude, tiengTrungs,dichNghias,youtubeLink, webLink, tieudeTiengTrung, author, imgAuthor, embedLink} = state;
        const currentDateTime = new Date().toISOString();

        const dichNghiaArray = Object.values(dichNghias).filter(dichNghia => dichNghia !== null);
        // const tiengTrungArray = Object.values(tiengTrungs).filter(tiengTrung => tiengTrung !== null);
        const tiengTrungsArray = Object.values(tiengTrungs);
        try{
            const id = getYoutubeId(youtubeLink);
            await Promise.all([
                AddDataToFireBaseNoKey(userNamePath,userName),
                AddDataToFireBaseNoKey(weblinkPath,youtubeLink),
                AddDataToFireBaseNoKey(tieudeTiengTrungPath,tieudeTiengTrung),
                AddDataToFireBaseNoKey(tieudeBaidichPath,tieude),
                AddDataToFireBaseNoKey(YoutubePath,embedLink),
                AddDataToFireBaseNoKey(authorPath,author),
                AddDataToFireBaseNoKey(imgAuthorPath,imgAuthor),
                // AddDataToFireBaseNoKey(baidichPath,baiDich),
                AddDataToFireBaseNoKey(datetimePath,currentDateTime),
                AddDataToFireBaseNoKey(idPath,id),
                AddDataToFireBaseNoKey(userImagePath,userImage)
            ]);
            await Promise.all(dichNghiaArray.map((dichNghia, index) => {
                const path = `${dichNghiaPath}/${index}`;
                AddDataToFireBaseNoKey(path, dichNghia);
            }));

            await Promise.all(tiengTrungsArray.map((tiengTrung, index) => {
                const path = `${tiengTrungPath}/${index}`;
                AddDataToFireBaseNoKey(path, tiengTrung);
            }));
            
            await Swal.fire({
                position: "center",
                icon: "success",
                title: "Đăng bài thành công",
                showConfirmButton: false,
                timer: 1500
            });
            
            setState(prevState => ({ ...prevState, nav: true }));
        }
        catch (error){
            console.error('Lỗi tạo bài mới:', error);
            let errorMessage = {
                message: 'Lỗi tạo bài mới: ' + error.message
            };
            Swal.fire(error.message, "", "info");
            setState(prevState => ({ ...prevState, error: errorMessage }));
        }
        finally{
            setLoading(false); 
        }
       

    }

    const getData = async () => {
        // await luuBaiDich();
        setLoading(true); 
    
        const user = localStorage.getItem("user");
    
        const dichthuatPath = `/users/dichthuat/${bodich}`;
        const baidichPath = `/users/dichthuat/${bodich}/listBaihoc/${baidich}`;
        const weblinkPath = `${baidichPath}/weblink`;
        const tieudeTiengTrungPath = `${baidichPath}/tieudeTiengTrung`;
        const tieudeBaidichPath = `${baidichPath}/tieude`;
        const authorPath = `${dichthuatPath}/author`;
        const imgAuthorPath = `${dichthuatPath}/imgAuthor`;
        const noidungTiengTrungPath = `${baidichPath}/noidung`;
        const YoutubePath = `${baidichPath}/link`;
        const userDichPath = `${baidichPath}/${user}/baidich`;
        const userTuMoiPath = `${baidichPath}/${user}/tumoi`;
    
        const [
            tuMois,
            tieude,
            youtubeLink,
            webLink,
            tieudeTiengTrung,
            author,
            imgAuthor,
            baiDich,
            noiDungBaiDich
        ] = await Promise.all([
            getKeyValueFromFireBase(userTuMoiPath),
            getValueFromPath(tieudeBaidichPath),
            getValueFromPath(YoutubePath),
            getValueFromPath(weblinkPath),
            getValueFromPath(tieudeTiengTrungPath),
            getValueFromPath(authorPath),
            getValueFromPath(imgAuthorPath),
            getKeyValueFromFireBase(userDichPath),
            getKeyValueFromFireBase(noidungTiengTrungPath),
        ]);
    
        const embedLink = youtubeLink ? `https://www.youtube.com/embed/${getYoutubeId(youtubeLink)}` : null;
    
        const tuMoiNghiaGets = {};
        const tuMoiNghias = {};
        const tuMoiPinyins = {};
        const tumoiViduGets = {};
        const tuMoiVidus = {};
        const tuMoiViduDichs = {};
        const tuMoiViduPinyins = {};
        const hanviets = {};
    
        if (tuMois) {
            await Promise.all(tuMois.map(async (tuMoi) => {
                tuMoiNghiaGets[tuMoi.key] = await getKeyValueFromFireBase(`/${userTuMoiPath}/${tuMoi.key}/nghia`);
                tuMoiPinyins[tuMoi.key] = await getValueFromPath(`/${userTuMoiPath}/${tuMoi.key}/pinyin`);
                hanviets[tuMoi.key] = await getValueFromPath(`/${userTuMoiPath}/${tuMoi.key}/hanviet`);
                if (tuMoiNghiaGets[tuMoi.key]) {
                    await Promise.all(tuMoiNghiaGets[tuMoi.key].map(async (tuMoiNghia) => {
                        tuMoiNghias[tuMoiNghia.key] = await getValueFromPath(`/${userTuMoiPath}/${tuMoi.key}/nghia/${tuMoiNghia.key}/nghia`);
                        tumoiViduGets[tuMoiNghia.key] = await getKeyValueFromFireBase(`/${userTuMoiPath}/${tuMoi.key}/nghia/${tuMoiNghia.key}/vidu`);
                        if (tumoiViduGets[tuMoiNghia.key]) {
                            await Promise.all(tumoiViduGets[tuMoiNghia.key].map(async (tuMoiKey) => {
                                tuMoiViduDichs[tuMoiKey.key] = await getValueFromPath(`/${userTuMoiPath}/${tuMoi.key}/nghia/${tuMoiNghia.key}/vidu/${tuMoiKey.key}/nghia`);
                                tuMoiVidus[tuMoiKey.key] = await getValueFromPath(`/${userTuMoiPath}/${tuMoi.key}/nghia/${tuMoiNghia.key}/vidu/${tuMoiKey.key}/vidu`);
                                tuMoiViduPinyins[tuMoiKey.key] = await getValueFromPath(`/${userTuMoiPath}/${tuMoi.key}/nghia/${tuMoiNghia.key}/vidu/${tuMoiKey.key}/pinyin`);
                            }));
                        }
                    }));
                }
            }));
        }

        const tiengTrungs = {};
        const dichNghias = {};
        if (noiDungBaiDich) {
            await Promise.all(noiDungBaiDich.map(async (noidung) => {
                tiengTrungs[noidung.key] = await getValueFromPath(`/${noidungTiengTrungPath}/${noidung.key}/tiengTrung`);
                
            }));
        }
        if(baiDich){
            await Promise.all(baiDich.map(async (baidich) => {
                dichNghias[baidich.key] = await getValueFromPath(`/${userDichPath}/${baidich.key}`);
            }));
        }
    
        setState(prevState => ({
            ...prevState,
            webLink,
            tieudeTiengTrung,
            tieude,
            author,
            imgAuthor,
            youtubeLink,
            noiDungBaiDich,
            user,
            tuMoiNghias,
            tuMoiNghiaGets,
            tuMoiPinyins,
            tuMoiViduPinyins,
            tumoiViduGets,
            tuMoiVidus,
            tuMoiViduDichs,
            tuMois,
            baiDich,
            embedLink,
            hanviets,
            tiengTrungs,
            dichNghias,
        }));
        setLoading(false); 
    };
    

    const luuBaiDich = async () => {
        setLoading(true); 
        const { baiDich, dichNghias = {} } = state; // Ensure dichNghias is an object (as in your log)
        const user = localStorage.getItem("user");
        const userDichPath = `/users/dichthuat/${bodich}/listBaihoc/${baidich}/${user}/baidich`;
        console.log(dichNghias);
    
        try {
            const dichNghiaArray = Object.values(dichNghias).filter(dichNghia => dichNghia !== null);
    
            if (!dichNghiaArray.length) {
                throw new Error('No valid dichNghias to save.');
            }
    
            await Promise.all(dichNghiaArray.map((dichNghia, index) => {
                const phanDichPath = `${userDichPath}/${index}`;
                return AddDataToFireBaseNoKey(phanDichPath, dichNghia);
            }));
    
            await Swal.fire({
                position: "center",
                icon: "success",
                title: "Tạo bài mới thành công",
                showConfirmButton: false,
                timer: 1500
            });
    
        } catch (error) {
            setLoading(false); 
            console.error('Lỗi tạo bài mới:', error);
            await Swal.fire('Lỗi tạo bài mới: ' + error.message, "", "info");
        } finally {
            setLoading(false); 
        }
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

    const getYoutubeId = (link) => {
        var yt = link.split('=');
        const videoId = yt[1] ? yt[1].split('&')[0] : "null";
        return videoId;
    };

    const onChangeHandle = (event) => {
        setState(prevState => ({
            ...prevState,
            baiDich: event.target.value
        }));
    };
   
    const isThemTuMoi = () => {
        setOpenTumoiForm(!openTumoiForm);
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
    const onChangeHandlePhanDich = (event, index) => {
        // console.log(state.dichNghias)
        setState(prevState => ({
            ...prevState,
            dichNghias: {
                ...prevState.dichNghias,
                [index]: event.target.value
            }
        }));
    };
    
    const showNguyenVan = () => {
        const { tiengTrungs, dichNghias = [] } = state;
        const tiengTrungsArray = Object.values(tiengTrungs);
    
        if (tiengTrungsArray && tiengTrungsArray.length > 0) {
            return (
                <div className=''>
                    {tiengTrungsArray.map((tiengTrung, index) => (
                        <div className='phanDich' key={index}>
                            <div>
                                {tiengTrung || ''}
                            </div>
                            <textarea
                                value={dichNghias[index] || ''}
                                onChange={(event) => onChangeHandlePhanDich(event, index)}
                                placeholder='Nhập bài dịch của bạn'>
                            </textarea>
                            <hr/>
                        </div>
                    ))}
                </div>
            );
        } else {
            return null;
        }
    };
    
    
 

    const showTumoi = () => {
        const { tuMois, tuMoiNghias, tuMoiNghiaGets, tuMoiPinyins, tumoiViduGets, tuMoiVidus, tuMoiViduDichs, tuMoiViduPinyins, hanviets } = state;
        if (tuMois && tuMois.length > 0) {
            return tuMois.map((tuMoi, index) => {
                const tuMoiNghiaGet = tuMoiNghiaGets[tuMoi.key];
                const tuMoiPinyin = tuMoiPinyins[tuMoi.key];
                const hanviet = hanviets[tuMoi.key];
                const showMeaning = showMeanings[tuMoi.key];

                return (
                    <div className='tumoi-item' key={index}>
                        <div className='tumoi-display'>
                            <div className='tumoi-display-header'>
                                <h4>{index + 1}, {tuMoi.key}  【{hanviet}】</h4>
                                    <Button variant={showMeaning?'danger':'warning'} onClick={() => toggleMeanings(tuMoi.key)}>
                                    {showMeaning ? 'Ẩn bớt nghĩa của từ' : 'Hiển thị nghĩa của từ'}
                                    </Button>
                            </div>
                            
                            
                            
                            
                            {showMeaning && tuMoiNghiaGet && tuMoiNghiaGet.map((nghia, nghiaIndex) => {
                                const vidu = tumoiViduGets[nghia.key];
                                const nghiaTuMoi = tuMoiNghias[nghia.key];
                                const isExpanded = expandedItems[tuMoi.key + '-' + nghia.key];

                                return (
                                    <div className='tumoi-nghia' key={nghiaIndex}>
                                        <h5>{tuMoi.key}/ {tuMoiPinyin}</h5>
                                        <hr />
                                        <h4 className='tumoi-nghia-shower'>Nghĩa {nghiaIndex + 1}: {nghiaTuMoi}</h4>
                                        {vidu && vidu.map((vd, vdindex) => {
                                            const viduTiengTrung = tuMoiVidus[vd.key];
                                            const viduDich = tuMoiViduDichs[vd.key];
                                            const viduPinyin = tuMoiViduPinyins[vd.key];

                                            if (isExpanded || vdindex === 0) {
                                                return (
                                                    <div className='tumoi-vidu' key={vdindex}>
                                                        <h5>Ví dụ {vdindex + 1}</h5>
                                                        <p>{highlightText(viduTiengTrung, tuMoi.key)}</p>
                                                        <p>{viduPinyin}</p>
                                                        <p>{viduDich}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                        {!isExpanded ? (
                                            <Button variant="info" onClick={() => expandExamples(tuMoi.key, nghia.key)}>
                                                Hiển thị thêm ví dụ
                                            </Button>
                                        ) : (
                                            <Button variant="warning" onClick={() => collapseExamples(tuMoi.key, nghia.key)}>
                                                Ẩn bớt ví dụ
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            });
        } else return null;
    };

    const { tieude, baiDich, webLink, tieudeTiengTrung, author,
         imgAuthor, embedLink,noiDungBaiDich ,
         tiengTrungs, dichNghias,
         } = state;
    // console.log(state);
    return (
        <PageForm
            body={
                <div>
                    <div className='dichthuat-container row'>
                        <div className='col-5'>
                            <div>
                            <ItemCardYoutube
                                videoLink={embedLink ? embedLink : null}
                                webLink={webLink ? webLink : null}
                                tieudeTiengTrung={tieudeTiengTrung ? tieudeTiengTrung : null}
                                    author={author ? author : null}
                                imgAuthor={imgAuthor ? imgAuthor : null}
                                title={tieude ? tieude : null}
                            />
                            </div>
                            <div style={{display:'flex'}}>
                                            <Button className='button-css' variant="info" onClick={luuBaiDich}>
                                                Lưu bài dịch
                                            </Button>

                                            <Button className='button-css' variant="danger" onClick={publishDashboard}>
                                                Đăng bài
                                            </Button>
                                        </div>
                            
                        </div>
                       
                        
                        

                        <div className='col'>
                            <div className="card border-primary cardPhandich">
                                <div className="card-body">
                                    <div className='' style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                                        <h4 className="card-title">Phần Dịch</h4>
                                        {/* <div style={{display:'flex'}}>
                                            <Button className='button-css' variant="info" onClick={luuBaiDich}>
                                                Lưu bài dịch
                                            </Button>

                                            <Button className='button-css' variant="danger" onClick={publishDashboard}>
                                                Đăng bài
                                            </Button>
                                        </div> */}
                                        
                                    </div>
                                    
                                    {/* <textarea
                                        value={baiDich ? baiDich : ''}
                                        onChange={(event) => onChangeHandle(event)}
                                        placeholder='Nhập bài dịch của bạn'>
                                    </textarea> */}

                                    {showNguyenVan()}
                                   
                                </div>
                            </div>
                        </div>
                        
                    </div>

                    <div className='tumoi-area'>
                        <div className='tumoi-area-header'>
                            <h2 className='card-title'>Từ mới</h2>
                            {!openTumoiForm ? (
                                <Button variant="info" onClick={isThemTuMoi}>
                                    Thêm từ mới
                                </Button>
                            ) : (
                                <Button variant="danger" onClick={isThemTuMoi}>
                                    Hủy
                                </Button>
                            )}
                        </div>
                        <div className='row'>
                           
                            <div className='col'>
                                <div className='tumoi-container'>
                                    <div className='tumoi-header'></div>
                                    {showTumoi()}
                                </div>
                            </div>
                            {openTumoiForm ? (<TumoiHandle 
                                getData={getData}
                                luuBaiDich={()=>luuBaiDich()}
                                />) : null}
                        </div>
                    </div>
                    {loading ? (
                        <WaitingLoad />
                    ) : null}
                </div>
            }
        />
    );
};



