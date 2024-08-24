"use client";
import React, { Component } from 'react';
import PageForm from '@/component/PageForm/PageForm';
import { getValueFromPath, getKeyValueFromFireBase, AddDataToFireBaseNoKey, DeleteKeyFromFirebase } from '@/component/firebase/Firebase';
import WaitingLoad from '@/component/WaitingLoad/WaitingLoad';  
import ItemCardDashboard from '@/component/ItemCard/ItemCardDashboard';
import userImage from '@/assets/image/user.jpg'
import { formatDateTime } from '@/component/publicFc/PublicFunction';
import LikedView from '@/component/LikedView/LikedView';
import Image from 'next/image';

// import '../styles/globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: null,
            usernames: null,
            dateTimes: null,
            tieudes: null,
            links: null,
            likes: null,
            comments: null,
            weblinks: null,
            tieudeTiengTrungs: null,
            authors: null,
            imgAuthors: null,
            baidichs: null,
            error: null,
            nav: false,
            loading: false,
            commentTexts: {},
            isLikedMap: {}, 
            flagLogin:false,
            flagAdmin:false,
        };
    }

    componentDidMount() {
        this.getData();
    }
    getData = async () => {
        this.setState({ loading: true });
    
        const myUser = localStorage.getItem("user");
        const MyUserName = localStorage.getItem("name");
        const dashboardPath = `/users/dashboard`;
        const accountPath = `/users/account`;
    
        try {
            const datas = await getKeyValueFromFireBase(dashboardPath);
            const personDatas = await Promise.all(datas.map(async (data) => {
                const key = data.key;
                const baiviets = await getKeyValueFromFireBase(`${dashboardPath}/${key}`);
    
                const baivietDatas = await Promise.all(baiviets.map(async (baiviet) => {
                    const baivietKey = `${key}&${baiviet.key}`;
    
                    const [comments, likes, username, userImage, tieude, tieudeTiengTrung, author, imgAuthor, link, weblink, dateTime, id, baidich] = await Promise.all([
                        getKeyValueFromFireBase(`${dashboardPath}/${key}/${baiviet.key}/comment`),
                        getKeyValueFromFireBase(`${dashboardPath}/${key}/${baiviet.key}/like`),
                        getValueFromPath(`${accountPath}/${key}/name`),
                        getValueFromPath(`${accountPath}/${key}/img`),
                        getValueFromPath(`${dashboardPath}/${key}/${baiviet.key}/tieude`),
                        getValueFromPath(`${dashboardPath}/${key}/${baiviet.key}/tieudeTiengTrung`),
                        getValueFromPath(`${dashboardPath}/${key}/${baiviet.key}/author`),
                        getValueFromPath(`${dashboardPath}/${key}/${baiviet.key}/imgAuthor`),
                        getValueFromPath(`${dashboardPath}/${key}/${baiviet.key}/link`),
                        getValueFromPath(`${dashboardPath}/${key}/${baiviet.key}/weblink`),
                        getValueFromPath(`${dashboardPath}/${key}/${baiviet.key}/dateTime`),
                        getValueFromPath(`${dashboardPath}/${key}/${baiviet.key}/id`),
                        getValueFromPath(`${dashboardPath}/${key}/${baiviet.key}/baidich`)
                    ]);
    
                    let commentDetails = null;
                    let likeDetails = null;
                    let isLiked = false;
    
                    if (comments) {
                        commentDetails = await Promise.all(comments.map(async (comment) => {
                            const userKey = await  getValueFromPath(`${dashboardPath}/${key}/${baiviet.key}/comment/${comment.key}/user`);
                            const [username, userImage, cmt, dateTime] = await Promise.all([
                                
                                getValueFromPath(`${accountPath}/${userKey}/name`),
                                getValueFromPath(`${accountPath}/${userKey}/img`),
                                getValueFromPath(`${dashboardPath}/${key}/${baiviet.key}/comment/${comment.key}/cmt`),
                                getValueFromPath(`${dashboardPath}/${key}/${baiviet.key}/comment/${comment.key}/dateTime`)
                            ]);
    
                            return {
                                username,
                                userImage,
                                cmt,
                                dateTime,
                                id: comment.key,
                            };
                        }));
                    }
    
                    if (likes) {
                        likeDetails = await Promise.all(likes.map(async (like) => {
                            if (like.key === myUser) {
                                isLiked = true;
                            }
                            const [username, userImage] = await Promise.all([
                                getValueFromPath(`${dashboardPath}/${key}/${baiviet.key}/like/${like.key}/name`),
                                getValueFromPath(`${dashboardPath}/${key}/${baiviet.key}/like/${like.key}/image`)
                            ]);
    
                            return {
                                username,
                                userImage
                            };
                        }));
                    }
    
                    return {
                        baivietKey,
                        username,
                        userImage,
                        tieude,
                        tieudeTiengTrung,
                        author,
                        imgAuthor,
                        link,
                        weblink,
                        dateTime,
                        comment: commentDetails,
                        likes: likeDetails,
                        id,
                        baidich,
                        isLiked, // Add isLiked to the returned data
                    };
                }));
    
                return { key, baivietDatas };
            }));
    
            let allBaivietDatas = [];
            personDatas.forEach(personData => {
                allBaivietDatas = allBaivietDatas.concat(personData.baivietDatas);
            });
            allBaivietDatas.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    
            const weblinks = {};
            const tieudeTiengTrungs = {};
            const authors = {};
            const links = {};
            const imgAuthors = {};
            const usernames = {};
            const dateTimes = {};
            const tieudes = {};
            const comments = {};
            const likes = {};
            const ids = {};
            const userImages = {};
            const baidichs = {};
            const isLikedMap = {};
    
            allBaivietDatas.forEach(data => {
                weblinks[data.baivietKey] = data.weblink;
                tieudeTiengTrungs[data.baivietKey] = data.tieudeTiengTrung;
                authors[data.baivietKey] = data.author;
                links[data.baivietKey] = data.link;
                imgAuthors[data.baivietKey] = data.imgAuthor;
                usernames[data.baivietKey] = data.username;
                tieudes[data.baivietKey] = data.tieude;
                dateTimes[data.baivietKey] = data.dateTime;
                comments[data.baivietKey] = data.comment;
                likes[data.baivietKey] = data.likes;
                ids[data.baivietKey] = data.id;
                userImages[data.baivietKey] = data.userImage;
                baidichs[data.baivietKey] = data.baidich;
                isLikedMap[data.baivietKey] = data.isLiked;
            });
    
            this.setState({
                datas: allBaivietDatas,
                myUser,
                MyUserName,
                baidichs,
                weblinks,
                tieudeTiengTrungs,
                authors,
                imgAuthors,
                links,
                usernames,
                userImages,
                tieudes,
                dateTimes,
                comments,
                likes,
                ids,
                isLikedMap, // Update the isLikedMap state
                loading: false
            });
        } catch (error) {
            this.setState({ error, loading: false });
            console.error('Error fetching data:', error);
        }
    }
    

    removeClick = async (path, baivietKey, isComment = false) => {
        await DeleteKeyFromFirebase(path);
    
        if (isComment) {
            const commentId = path.split('/').pop(); // Get the comment ID from the path
            this.setState(prevState => ({
                comments: {
                    ...prevState.comments,
                    [baivietKey]: prevState.comments[baivietKey].filter(comment => comment.id !== commentId)
                }
            }));
        } else {
            this.setState(prevState => ({
                datas: prevState.datas.filter(data => data.baivietKey !== baivietKey),
                baidichs: this.filterOutKey(prevState.baidichs, baivietKey),
                weblinks: this.filterOutKey(prevState.weblinks, baivietKey),
                tieudeTiengTrungs: this.filterOutKey(prevState.tieudeTiengTrungs, baivietKey),
                authors: this.filterOutKey(prevState.authors, baivietKey),
                imgAuthors: this.filterOutKey(prevState.imgAuthors, baivietKey),
                links: this.filterOutKey(prevState.links, baivietKey),
                usernames: this.filterOutKey(prevState.usernames, baivietKey),
                userImages: this.filterOutKey(prevState.userImages, baivietKey),
                tieudes: this.filterOutKey(prevState.tieudes, baivietKey),
                dateTimes: this.filterOutKey(prevState.dateTimes, baivietKey),
                comments: this.filterOutKey(prevState.comments, baivietKey),
                likes: this.filterOutKey(prevState.likes, baivietKey),
                ids: this.filterOutKey(prevState.ids, baivietKey)
            }));
        }
    };
    
    
    
    filterOutKey = (obj, keyToRemove) => {
        const { [keyToRemove]: _, ...rest } = obj;
        return rest;
    }
    
    sendCmtHandle = async (path, baivietKey) => {
        const cmt = this.state.commentTexts[baivietKey];
        const myUser = localStorage.getItem("user");
        const MyUserName = localStorage.getItem("name");
        const MyUserImage = localStorage.getItem("userImage");
        
        if (myUser) {
            const CmtPath = `${path}/comment`;
            const indexs = await getKeyValueFromFireBase(CmtPath);
            const currentDateTime = new Date().toISOString();
            let id = null;
            if (indexs) {
                id = indexs.length + 1;
            } else {
                id = 1;
            }
            const commentId = `${id}-${formatDateTime(currentDateTime)}`;
    
            // await AddDataToFireBaseNoKey(`${CmtPath}/${commentId}/username`, MyUserName);
            await AddDataToFireBaseNoKey(`${CmtPath}/${commentId}/user`, myUser);
            await AddDataToFireBaseNoKey(`${CmtPath}/${commentId}/cmt`, cmt);
            // await AddDataToFireBaseNoKey(`${CmtPath}/${commentId}/userImage`, MyUserImage);
            await AddDataToFireBaseNoKey(`${CmtPath}/${commentId}/dateTime`, currentDateTime);
    
            // Update state with new comment
            const newComment = {
                username: MyUserName,
                userImage: MyUserImage,
                cmt: cmt,
                dateTime: currentDateTime,
                id: commentId,
            };
    
            this.setState(prevState => ({
                comments: {
                    ...prevState.comments,
                    [baivietKey]: [...(prevState.comments[baivietKey] || []), newComment] // Ensure it is an array
                },
                commentTexts: {
                    ...prevState.commentTexts,
                    [baivietKey]: ''
                }
            }));
            // this.setState({commentTexts:null})
        }
    };


    likeClick = async (path, baivietKey, isLiked) => {
        const myUser = localStorage.getItem("user");
        const MyUserName = localStorage.getItem("name");
        const MyUserImage = localStorage.getItem("userImage");

        if (myUser) {
            const likePath = `${path}/like`;
            
            if (!isLiked) {
                await AddDataToFireBaseNoKey(`${likePath}/${myUser}/name`, MyUserName);
                await AddDataToFireBaseNoKey(`${likePath}/${myUser}/image`, MyUserImage);
                
                // Update state with new like
                const newLike = {
                    username: MyUserName,
                    userImage: MyUserImage,
                };
                
                this.setState(prevState => ({
                    likes: {
                        ...prevState.likes,
                        [baivietKey]: [...(prevState.likes[baivietKey] || []), newLike]
                    },
                    isLikedMap: {
                        ...prevState.isLikedMap,
                        [baivietKey]: true,
                    }
                }));
            } else {
                await DeleteKeyFromFirebase(`${likePath}/${myUser}`);
                
                this.setState(prevState => ({
                    likes: {
                        ...prevState.likes,
                        [baivietKey]: prevState.likes[baivietKey].filter(like => like.username !== MyUserName),
                    },
                    isLikedMap: {
                        ...prevState.isLikedMap,
                        [baivietKey]: false,
                    }
                }));
            }
        }
    }
    // likedView = (likes) => {
    //     console.log(likes)
    //     return (
    //         <div className='likeView-controller'>
    //             {likes[0].username +" và "+(likes.length -1 )+" người khác"}
    //             <div className='likeView-detailes'>
    //                 {likes && likes.map((like, index) => (
    //                     <div key={index} className='liked-user'>
    //                         <span>{like.username}</span>
    //                     </div>
    //                 ))}
    //             </div>
                
    //         </div>
    //     );
    // }

    handleCommentChange = (baivietKey, e) => {
        // console.log(this.state.commentTexts)
        this.setState(prevState => ({
            commentTexts: {
                ...prevState.commentTexts,
                [baivietKey]: e.target.value
            }
        }));
    };

    showBaidich = () => {
        const { datas, baidichs, userImages, usernames, commentTexts, likes, dateTimes, comments, tieudes, tieudeTiengTrungs, ids, isLikedMap } = this.state;
    
        if (datas && datas.length > 0) {
            return datas.map((data, index) => {
                const baivietKey = data.baivietKey;
                const userKey = baivietKey.split('&')[0];
                const path = `/users/dashboard/${userKey}/${baivietKey.split('&')[1]}`;
                return (
                    <ItemCardDashboard
                        key={index}
                        username={usernames[baivietKey] || null}
                        dateTime={dateTimes[baivietKey] || null}
                        imgUser={userImages[baivietKey] || null}
                        comment={comments[baivietKey] ? this.showComment(path, comments[baivietKey], baivietKey) : null}
                        likes={likes[baivietKey] ? <LikedView likes={likes[baivietKey]} /> : null}
                        tieudeTiengTrung={tieudeTiengTrungs[baivietKey] || null}
                        link={baivietKey ? `/dashboard/${userKey}/${baivietKey.split('&')[1]}` : null}
                        title={tieudes[baivietKey] || null}
                        baidich={baidichs[baivietKey] || null}
                        img={ids[baivietKey] ? `https://img.youtube.com/vi/${ids[baivietKey]}/sddefault.jpg` : null}
                        removeClick={() => this.removeClick(path, baivietKey, false)}
                        sendCmtHandle={() => this.sendCmtHandle(path, baivietKey)}
                        commentText={commentTexts[baivietKey] || ''}
                        onChangeHandle={(e) => this.handleCommentChange(baivietKey, e)}
                        likeClick={() => this.likeClick(path, baivietKey, isLikedMap[baivietKey])}
                        isLiked={isLikedMap[baivietKey]}
                    
                    />
                );
            });
        } else {
            return null;
        }
    };
    
    
    showComment = (path, comments, baivietKey) => {
        return (
            <div>
                {comments && comments.map((comment, index) => (
                    <CommentItem
                        key={index}
                        imgUser={comment.userImage}
                        username={comment.username}
                        cmt={comment.cmt}
                        dateTime={comment.dateTime}
                        removeClick={() => this.removeClick(`${path}/comment/${comment.id}`, baivietKey, true)}
                    />
                ))}
            </div>
        );
    };
    

    render() {
        return (
            <PageForm  body={
                <div className='container'>
                    {this.showBaidich()}
                    {this.state.loading ? (
                        <WaitingLoad />
                    ) : null}
                </div>
            } />
        );
    }
}

export default Dashboard;

function CommentItem(props) {
    const renderTrash=()=>{
        const MyUserName = localStorage.getItem("name");
        if(MyUserName==props.username){
            return(
                <div className='itemCard-UserName-1'> 
                    <button
                        className="btn btn-options"
                        onClick={props.removeClick}
                        style={{padding:'0',margin:'0'}}
                    >
                        <i className="fa-solid fa-trash" />
                    </button>
                </div>
            )
        }
        else return null;
    }
    return (
        <div className='itemCard-UserName'>
            <div className='itemCard-UserName-2'>
                <Image src={props.imgUser ? props.imgUser : userImage} alt="img" width={500} height={500} />
                <div className='itemCard-UserName-container'>
                    <div className='itemCard-UserName-container-1'>
                        <h6 className='username-card1'>{props.username}</h6>
                        <p>{props.cmt}</p>
                    </div>
                    <span className='Time' style={{ margin: '0' }}>{formatDateTime(props.dateTime)}</span>
                </div>
            </div>
            
            {renderTrash()}

        </div>
    );
}

