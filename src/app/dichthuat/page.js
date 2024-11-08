'use client'
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import PageForm from '@/component/PageForm/PageForm';
import ItemCard from '@/component/ItemCard/ItemCard';
import { getKeyValueFromFireBase } from '@/component/firebase/Firebase';
import { getValueFromPath } from '@/component/firebase/Firebase';
import WaitingLoad from '@/component/WaitingLoad/WaitingLoad';
import Link from 'next/link';

class DichThuatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dichthuats: [],
            youtubeLinkToGetImgs: {} ,
            webLinks: {} ,
            tieudeTiengTrungs: {} ,
            tieudes: {} ,
            authors: {} ,
            imgAuthors: {} ,
            ids: {} ,
            loading: true, 
            flagLogin:false,
        };
    }

    componentDidMount(){
        this.getDichThuat();
        this.isLogin();
        
    }
    componentWillUnmount() {
        // Hủy interval khi component unmount
        clearInterval(this.intervalId);
    }

    isLogin(){
        const MyUserName = localStorage.getItem("name");
        if(MyUserName) {
            this.setState({ flagLogin: true });
        };
        
    }
    
    isAdmin(){{
        const user = localStorage.getItem("user");
        if(user=="duong171099") return true;
        return false
    }}

    getDichThuat = async () => {
        try {
            this.setState({ loading: true });
            const convertPath = "/users/dichthuat";
            const allData = JSON.parse(localStorage.getItem("allData"));
            const dichthuatData = allData.find(item => item.key === "dichthuat");

            // const dichthuats = await getKeyValueFromFireBase(convertPath);
            const dichthuats = Object.entries(dichthuatData.value).map(([key, value]) => ({ key, value }));
            console.log(dichthuats)
    
            const dataPromises = dichthuats.map(async (dichthuat) => {
               
                const key = dichthuat.key;
                return {
                    key,
                    // youtubeLinkToGetImg: await getValueFromPath(`/users/dichthuat/${key}/link`),
                    // webLink: await getValueFromPath(`/users/dichthuat/${key}/webLink`),
                    // tieudeTiengTrung: await getValueFromPath(`/users/dichthuat/${key}/tieudeTiengTrung`),
                    // tieude: await getValueFromPath(`/users/dichthuat/${key}/tieude`),
                    // author: await getValueFromPath(`/users/dichthuat/${key}/author`),
                    // imgAuthor: await getValueFromPath(`/users/dichthuat/${key}/imgAuthor`),
                    // id: await getValueFromPath(`/users/dichthuat/${key}/id`),

                    youtubeLinkToGetImg: dichthuatData.value[key].link,
                    webLink: dichthuatData.value[key].webLink,
                    tieudeTiengTrung: dichthuatData.value[key].tieudeTiengTrung,
                    tieude: dichthuatData.value[key].tieude,
                    author: dichthuatData.value[key].author,
                    imgAuthor: dichthuatData.value[key].imgAuthor,
                    id: dichthuatData.value[key].id,
                };
            });
    
            const dataResults = await Promise.all(dataPromises);
    
            const webLinks = {};
            const tieudeTiengTrungs = {};
            const authors = {};
            const youtubeLinkToGetImgs = {};
            const imgAuthors = {};
            const ids = {};
            const tieudes = {};
    
            dataResults.forEach(data => {
                webLinks[data.key] = data.webLink;
                tieudeTiengTrungs[data.key] = data.tieudeTiengTrung;
                authors[data.key] = data.author;
                youtubeLinkToGetImgs[data.key] = data.youtubeLinkToGetImg;
                imgAuthors[data.key] = data.imgAuthor;
                ids[data.key] = data.id;
                tieudes[data.key] = data.tieude;
            });
    
            this.setState({ dichthuats,webLinks, tieudeTiengTrungs, authors, imgAuthors, youtubeLinkToGetImgs, ids, tieudes, loading: false });
        } catch (error) {
            console.error("Error getting dichthuat data: ", error);
            this.setState({ loading: false });
        }
    }

    to_slug = (slug) => {
        slug = slug.toLowerCase();
        slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
        slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
        slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
        slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
        slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
        slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
        slug = slug.replace(/đ/gi, 'd');
        slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
        slug = slug.replace(/ /gi, "-");
        slug = slug.replace(/\-\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-/gi, '-');
        slug = slug.replace(/\-\-/gi, '-');
        slug = '@' + slug + '@';
        slug = slug.replace(/\@\-|\-\@|\@/gi, '');
        return slug;
    }

    setDichThuatName = (name) => {
        // console.log("setDichthuatName")
        localStorage.setItem("dichthuat", name);
    }

    showDichThuat = () => {
        const { tieudes, dichthuats, youtubeLinkToGetImgs, webLinks, tieudeTiengTrungs, authors, imgAuthors, ids } = this.state;
        // console.log(this.state)
        if (tieudes && authors && dichthuats.length > 0) {
            // console.log(123)
            // console.log(dichthuats)
            return dichthuats.map((dichthuat, index) => {
                const webLink = webLinks[dichthuat.key];
                const tieude = tieudes[dichthuat.key];
                const tieudeTiengTrung = tieudeTiengTrungs[dichthuat.key];
                const author = authors[dichthuat.key];
                const imgAuthor = imgAuthors[dichthuat.key];
                const youtubeLinkToGetImg = youtubeLinkToGetImgs[dichthuat.key];
                const id = ids[dichthuat.key];
    
                return (
                    <ItemCard
                        cardClick={() => this.setDichThuatName(dichthuat.key)}
                        webLink={webLink}
                        tieudeTiengTrung={tieudeTiengTrung}
                        author={author}
                        imgAuthor={imgAuthor}
                        key={index}
                        link={`/dichthuat/dichthuatDetails/${this.to_slug(dichthuat.key)}`}
                        title={tieude || null}
                        titleDescription="Description"
                        img={id ? `https://img.youtube.com/vi/${id}/sddefault.jpg` : null}
                        alt="IMG Link"
                    />
                );
            });
        } else {
            return null;
        }
    }
    

    getYoutubeId = (link) => {
        var yt = link.split('=');
        const videoId = yt[1] ? yt[1].split('&')[0] : "null";
        return videoId;
    }
    renderAddButton = () =>{
        if(this.state.flagLogin){
            return(
                    <Link href="/dichthuat/dichthuatHandle">
                        <Button variant="info" >
                            Edit
                            <i className="fa-solid fa-calendar-plus"></i>
                        </Button>
                    </Link>     
            )
        }
        else return null
    }

    render() {
        return (
            <PageForm body={
                <div>
                    {this.renderAddButton()}

                    <div className='dichthuat-container row'>
                            {this.showDichThuat()}
                    </div>

                    {this.state.loading ? (
                        <WaitingLoad />
                    ) : null}
                </div>
            } />
        );
    }
}

export default DichThuatList;
