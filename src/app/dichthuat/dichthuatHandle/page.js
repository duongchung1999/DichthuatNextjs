"use client"
import React, { Component } from 'react';
import PageForm from '@/component/PageForm/PageForm';
import './DichthuatHandle.css'
import ItemCard from '@/component/ItemCard/ItemCard';
import { Button } from 'react-bootstrap';
import { getContentFromFireBase, AddDataToFireBaseNoKey} from '@/component/firebase/Firebase';
import Swal from 'sweetalert2';
import DichthuatFormInput from '@/component/DichthuatFormInput/DichthuatFormInput';
import To_slug from '@/component/ToSlug/ToSlug';
class DichThuatHandle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dichthuat: null,
            dichthuat_slug: null,
            youtubeLinkToGetImg: null ,
            webLink: null ,
            tieudeTiengTrung: null ,
            author: null ,
            imgAuthor: null ,
            id: null ,
            error:null,
            nav:false,
        };
    }
    componentDidMount(){
        this.setIdState();
    }
    onChangeHandle = (event, nameState) => {
        this.setState({
            [nameState]: event.target.value
        });
        // console.log(this.state);
        if(nameState==="youtubeLinkToGetImg"){
            const id = this.getYoutubeId(event.target.value);
            this.setState({id});
            console.log(id);
        }
        if(nameState ==="dichthuat"){
            const dichthuat_slug = To_slug(event.target.value);
            this.setState({dichthuat_slug});
        }
    }
    getYoutubeId = (link) =>{
        var yt = link.split('=');
        const videoId = yt[1] ? yt[1].split('&')[0] : "null";
        return videoId;
    }
    setIdState = () =>{
        if (this.state.youtubeLinkToGetImg){
            const id = this.getYoutubeId(this.state.youtubeLinkToGetImg);
            this.setState({id});
            console.log(id);
        }
    }
    updateBoDichMoi = async() =>{
        const { dichthuat,dichthuat_slug, youtubeLinkToGetImg, webLink,
            tieudeTiengTrung, author, imgAuthor, id} = this.state;

        const dichthuatPath = `/users/dichthuat/${dichthuat_slug}`
        
        const tieudePath = `${dichthuatPath}/tieude`
        const youtubeLinkToGetImgPath = `${dichthuatPath}/link`
        const webLinkPath = `${dichthuatPath}/weblink`
        const tieudeTiengTrungPath = `${dichthuatPath}/tieudeTiengTrung`
        const authorPath = `${dichthuatPath}/author`
        const imgAuthorPath = `${dichthuatPath}/imgAuthor`
        const idPath = `${dichthuatPath}/id`
        try{
            if(!this.isNhapDayDuText()){
                return;
            }
            else if(await this.isTieuDeExistInFirebase()){
                return;
            }
            else{
                var AddTieuDe = await AddDataToFireBaseNoKey(tieudePath,dichthuat)
                var AddyoutubeLinkToGetImg= await AddDataToFireBaseNoKey(youtubeLinkToGetImgPath,youtubeLinkToGetImg)
                var AddwebLink= await AddDataToFireBaseNoKey(webLinkPath,webLink)
                var AddtieudeTiengTrung= await AddDataToFireBaseNoKey(tieudeTiengTrungPath,tieudeTiengTrung)
                var Addauthor= await AddDataToFireBaseNoKey(authorPath,author)
                var AddimgAuthor= await AddDataToFireBaseNoKey(imgAuthorPath,imgAuthor)
                var Addid= await AddDataToFireBaseNoKey(idPath,id)
    
                if(!AddyoutubeLinkToGetImg||!AddwebLink||!AddtieudeTiengTrung
                    ||!Addauthor||!AddimgAuthor||!Addid||!AddTieuDe){
                        let error = {
                            message: "Tạo bài mới thất bại!"
                        };
                        Swal.fire(error.message, "", "info");
                        this.setState({ error });
                    }
                else {
                    Swal.fire("Tạo bài mới thành công", "", "success");
                    this.setState({ nav:true });
                }
            }
        }
        catch (error) {
            console.error('Lỗi tạo bài mới:', error);
            let errorMessage = {
                message: 'Lỗi tạo bài mới: ' + error.message
            };
            Swal.fire(error.message, "", "info");
            this.setState({ error: errorMessage });
        }
       

    }
    isTieuDeExistInFirebase =async() =>{
        const { dichthuat_slug, dichthuat} = this.state;
        const dichthuatPath = `/users/dichthuat/${dichthuat_slug}`
        const respond = await this.getInfo(dichthuatPath); 
            if (respond){
                let error = {
                    message: `Tên bộ dịch thuật "${dichthuat}" đã tồn tại, vui lòng tạo bộ dịch thuật khác`
                };
                Swal.fire(error.message, "", "info");
                this.setState({ error });
                return true;
            }
            else return false;
    }
    isNhapDayDuText = ()=>{
        const { dichthuat, youtubeLinkToGetImg, webLink,
            tieudeTiengTrung, author, imgAuthor, id} = this.state;
        
        
        
        if(!dichthuat||!webLink||!author||!id
            ||!imgAuthor||!tieudeTiengTrung||!youtubeLinkToGetImg){
                let error = {
                    message: "Vui lòng điền đầy đủ thông tin và thử lại"
                };
                Swal.fire(error.message, "", "info");
                this.setState({ error });
                return false;
            }
        else if (!this.isValidDichThuat(dichthuat)) {
            let error = {
                message: `Tên bài dịch "${dichthuat}" không được chứa các ký tự: '.', '#', '$', '[', hoặc ']'`
            };
            Swal.fire(error.message, "", "info");
            this.setState({ error });
        }
        else if (!this.isValidYoutubeLink(youtubeLinkToGetImg)) {
            let error = {
                message: `Đường link YouTube không hợp lệ "${youtubeLinkToGetImg}"`
            };
            Swal.fire(error.message, "", "info");
            this.setState({ error });
        }
        else return true;

    }
    isValidYoutubeLink = (link) => {
        const regex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
        return regex.test(link);
    }
    isValidDichThuat = (dichthuat) => {
        const invalidCharsRegex = /[.#$[\]]/;
        return !invalidCharsRegex.test(dichthuat);
    };
    
   

    getInfo = async (path)=>{
        // begin getcontentFromFirebase
        try {
            const data = await getContentFromFireBase(path);
            if (data !== null) {
                console.log("data return:", data);
                return data; // Trả về dữ liệu
            }
        } catch (error) {
            // console.error("Có lỗi xảy ra:", error);
            throw error; 
        }
    }
    
    render() {
        return (
            
            <PageForm body={
                <div>
                    {this.state.error&&(
                        <div className='dichthuat-showError'>
                           Lỗi: "{this.state.error.message}"
                        </div> 
                    )}
                    
                    <div className='dichthuat-container row row-cols-6 row-cols-xxxxxl-5 row-cols-xxxxl-4 row-cols-xl-3 row-cols-lg-2 gy-6 gx-xxl-2 gx-xl-3 gx-lg-2'>
                        {/* {this.showDichThuat()} */}
                        <DichthuatFormInput
                            title="Tiêu đề bộ dịch thuật mới"
                            name="dichthuat"
                            placeHolder="Nhập tiêu đề bộ dịch thuật mới"
                            onChangeHandle={(event) => this.onChangeHandle(event, "dichthuat")}
                        />
                        <DichthuatFormInput
                            title="Tiêu đề tiếng Trung của dịch thuật mới"
                            name="tieudeTiengTrung"
                            placeHolder="Nhập tiêu đề tiếng Trung của bộ dịch thuật mới"
                            onChangeHandle={(event) => this.onChangeHandle(event, "tieudeTiengTrung")}
                        />
                        <DichthuatFormInput
                            title="Tác giả"
                            name="author"
                            placeHolder="Nhập tên tác giả"
                            onChangeHandle={(event) => this.onChangeHandle(event, "author")}
                        />
                        <DichthuatFormInput
                            title="Đường link ảnh của tác giả"
                            name="imgAuthor"
                            placeHolder="Nhập link ảnh của tác giả"
                            onChangeHandle={(event) => this.onChangeHandle(event, "imgAuthor")}
                        />
                        <DichthuatFormInput
                            title="Đường link trang chủ của tác giả"
                            name="webLink"
                            placeHolder="Nhập đường link trang chủ của tác giả"
                            onChangeHandle={(event) => this.onChangeHandle(event, "webLink")}
                        />
                        <DichthuatFormInput
                            title="Đường link của một bài học trong bộ dịch"
                            name="youtubeLinkToGetImg"
                            placeHolder="Nhập đường link của một bài học trong bộ dịch"
                            onChangeHandle={(event) => this.onChangeHandle(event, "youtubeLinkToGetImg")}
                        />


                    </div>


                    <div className='dichthuatAdd-View'>
                        <ItemCard
                        webLink={this.state.webLink?this.state.webLink:null}
                        tieudeTiengTrung={this.state.tieudeTiengTrung?this.state.tieudeTiengTrung:null}
                        author={this.state.author?this.state.author:null}
                        imgAuthor={this.state.imgAuthor?this.state.imgAuthor:null}
                        link="#"
                        title={this.state.dichthuat?this.state.dichthuat:null}
                        img={this.state.id?`https://img.youtube.com/vi/${this.state.id}/sddefault.jpg`:null}
                        alt="IMG Link"
                        />
                        <div className='col-2 dichthuatAdd-button'>
                            <Button variant="info" onClick={this.updateBoDichMoi} >
                                        Add
                                        <i className="fa-solid fa-calendar-plus"></i>
                            </Button> 
                        </div>
                        

                    </div>
                </div>
            }/>
        );
    }
}

export default DichThuatHandle;

