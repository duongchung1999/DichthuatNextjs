'use client'
import React, { useEffect, useState } from 'react';
import PageForm from '@/component/PageForm/PageForm';
import ItemCard from '@/component/ItemCard/ItemCard';
import { Button } from 'react-bootstrap';
import { getContentFromFireBase, AddDataToFireBaseNoKey, getValueFromPath} from '@/component/firebase/Firebase';
import Swal from 'sweetalert2';
import DichthuatFormInput from '@/component/DichthuatFormInput/DichthuatFormInput';
import To_slug from '@/component/ToSlug/ToSlug';

export default  function BaidichHandleClient({slug}) {
    const [state, setState] = useState({
        baidich: null,
        dichthuat: null,
        youtubeLink: null,
        webLink: null,
        tieudeTiengTrung: null,
        tieudeBaihoc: null,
        author: null,
        imgAuthor: null,
        id: null,
        error: null,
        nav: false,
        noiDungBaiDich:null,
    });
    // const slug = params.slug;

    useEffect(() => {
        getExistValue();
    }, []);

    const getExistValue = async (slug) => {
        try {
            const [author, imgAuthor, webLink] = await Promise.all([
                getValueFromPath(`/users/dichthuat/${slug}/author`),
                getValueFromPath(`/users/dichthuat/${slug}/imgAuthor`),
                getValueFromPath(`/users/dichthuat/${slug}/weblink`),
            ]);
            setState(prevState => ({ ...prevState, author, imgAuthor, webLink }));
        } catch (error) {
            console.error('Error fetching existing values:', error);
        }
    };

    const onChangeHandle = (event, nameState) => {
        setState(prevState => ({
            ...prevState,
            [nameState]: event.target.value
        }));
        if (nameState === "youtubeLink") {
            const id = getYoutubeId(event.target.value);
            setState(prevState => ({ ...prevState, id }));
        }
        if (nameState === "baidich") {
            const tieudeBaihoc = To_slug(event.target.value);
            setState(prevState => ({ ...prevState, tieudeBaihoc }));
        }
    };

    const getYoutubeId = (link) => {
        const yt = link.split('=');
        const videoId = yt[1] ? yt[1].split('&')[0] : "null";
        return videoId;
    };

    const updateBoDichMoi = async () => {
        const { noiDungBaiDich, baidich, tieudeBaihoc, youtubeLink, webLink, tieudeTiengTrung, author, imgAuthor, id } = state;
        const dichthuatPath = `/users/dichthuat/${slug}/listBaihoc/${tieudeBaihoc}`;
        const youtubeLinkPath = `${dichthuatPath}/link`;
        const tieudeTiengTrungPath = `${dichthuatPath}/tieudeTiengTrung`;
        const tieudeBaihocPath = `${dichthuatPath}/tieude`;
        const noiDungBaiDichPath = `${dichthuatPath}/noidung`;

        try {
            if (!isNhapDayDuText() || await isTieuDeExistInFirebase(tieudeBaihoc)) {
                return;
            }
            await Promise.all([
                AddDataToFireBaseNoKey(youtubeLinkPath, youtubeLink),
                AddDataToFireBaseNoKey(tieudeTiengTrungPath, tieudeTiengTrung),
                AddDataToFireBaseNoKey(tieudeBaihocPath, baidich),
                AddDataToFireBaseNoKey(noiDungBaiDichPath, noiDungBaiDich)
            ]);

            Swal.fire("Tạo bài mới thành công", "", "success");
            setState(prevState => ({ ...prevState, nav: true }));
        } catch (error) {
            console.error('Lỗi tạo bài mới:', error);
            Swal.fire(`Lỗi tạo bài mới: ${error.message}`, "", "info");
            setState(prevState => ({ ...prevState, error: { message: `Lỗi tạo bài mới: ${error.message}` } }));
        }
    };

    const isTieuDeExistInFirebase = async (tieudeBaihoc) => {
        const dichthuatPath = `/users/dichthuat/${slug}/listBaihoc/${tieudeBaihoc}`;
        const respond = await getInfo(dichthuatPath);
        if (respond) {
            Swal.fire(`Tên bài dịch thuật "${state.baidich}" đã tồn tại, vui lòng tạo bài dịch khác`, "", "info");
            setState(prevState => ({ ...prevState, error: { message: `Tên bài dịch thuật "${state.baidich}" đã tồn tại, vui lòng tạo bài dịch khác` } }));
            return true;
        }
        return false;
    };
    
    const isNhapDayDuText = () => {
        const { baidich, youtubeLink, tieudeTiengTrung } = state;

        if (!baidich || !tieudeTiengTrung || !youtubeLink) {
            let error = {
                message: "Vui lòng điền đầy đủ thông tin và thử lại"
            };
            Swal.fire(error.message, "", "info");
            setState(prevState => ({ ...prevState, error }));
            return false;
        } else if (!isValidDichThuat(baidich)) {
            let error = {
                message: `Tên bài dịch "${baidich}" không được chứa các ký tự: '.', '#', '$', '[', hoặc ']'`
            };
            Swal.fire(error.message, "", "info");
            setState(prevState => ({ ...prevState, error }));
            return false;
        } else if (!isValidYoutubeLink(youtubeLink)) {
            let error = {
                message: `Đường link YouTube không hợp lệ "${youtubeLink}"`
            };
            Swal.fire(error.message, "", "info");
            setState(prevState => ({ ...prevState, error }));
            return false;
        } else {
            return true;
        }
    };

    const isValidYoutubeLink = (link) => {
        const regex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
        return regex.test(link);
    };

    const isValidDichThuat = (dichthuat) => {
        const invalidCharsRegex = /[.#$[\]]/;
        return !invalidCharsRegex.test(dichthuat);
    };

    const getPlaylistId = (link) => {
        const urlParams = new URLSearchParams(new URL(link).search);
        return urlParams.get('list');
    };

    const getInfo = async (path) => {
        try {
            const data = await getContentFromFireBase(path);
            if (data !== null) {
                return data;
            }
        } catch (error) {
            throw error;
        }
    };
    const onChangeHandleTextArea = (event) => {
        setState(prevState => ({
            ...prevState,
            noiDungBaiDich: event.target.value
        }));
    };
    const { noiDungBaiDich} = state;

    return (
        <PageForm body={
            <div>
                {state.error && (
                    <div className='dichthuat-showError'>
                        Lỗi: &quot;{state.error.message}&quot;
                    </div>
                )}

                <div className='dichthuat-container row row-cols-6 row-cols-xxxxxl-5 row-cols-xxxxl-4 row-cols-xl-3 row-cols-lg-2 gy-6 gx-xxl-2 gx-xl-3 gx-lg-2'>
                    <DichthuatFormInput
                        title="Tiêu đề bài dịch mới"
                        name="baidich"
                        placeHolder="Nhập tiêu đề bài dịch mới"
                        onChangeHandle={(event) => onChangeHandle(event, "baidich")}
                    />
                    <DichthuatFormInput
                        title="Tiêu đề tiếng Trung của bài dịch mới"
                        name="tieudeTiengTrung"
                        placeHolder="Nhập tiêu đề tiếng Trung của bộ dịch thuật mới"
                        onChangeHandle={(event) => onChangeHandle(event, "tieudeTiengTrung")}
                    />
                    <DichthuatFormInput
                        title="Đường link youtube của bài dịch mới"
                        name="youtubeLink"
                        placeHolder="Nhập đường link của một bài học trong bộ dịch"
                        onChangeHandle={(event) => onChangeHandle(event, "youtubeLink")}
                    />
                    <div className='form-group dichthuat-formInput'>
                        <label>Nội dung bài dịch</label>
                        <textarea
                            value={noiDungBaiDich ? noiDungBaiDich : ''}
                            onChange={(event) => onChangeHandleTextArea(event)}
                            placeholder='Nhập bài dịch của bạn'>
                        </textarea>
                    </div>
                    
                </div>

                <div className='dichthuatAdd-View'>
                    <ItemCard
                        webLink={state.webLink ? state.webLink : null}
                        tieudeTiengTrung={state.tieudeTiengTrung ? state.tieudeTiengTrung : null}
                        author={state.author ? state.author : null}
                        imgAuthor={state.imgAuthor ? state.imgAuthor : null}
                        link="#"
                        title={state.baidich ? state.baidich : null}
                        img={state.id ? `https://img.youtube.com/vi/${state.id}/sddefault.jpg` : null}
                        alt="IMG Link"
                    />
                    <div className='col-2 dichthuatAdd-button'>
                        <Button variant="info" onClick={updateBoDichMoi} >
                            Add
                            <i className="fa-solid fa-calendar-plus"></i>
                        </Button>
                    </div>
                    {/* <YoutubeViewer link={state.webLink ? getPlaylistId(state.webLink) : null} /> */}
                </div>
            </div>
        } />
    );
}


function YoutubeViewer(props) {
    return (
        <div className='youtube-Viewer col-4'>
            <div className='youtube-Viewer-show'>
                <iframe
                    height={props.height}
                    src={`https://www.youtube.com/embed/videoseries?list=${props.link}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </div>
            <p>{props.title}</p>
        </div>
    );
}