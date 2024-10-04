"use client"
import React, { Component } from 'react';
import PageForm from '@/component/PageForm/PageForm';
import WaitingLoad from '@/component/WaitingLoad/WaitingLoad';
class ViewerWebsite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMenuOnClick: true,
            loading: true,
        };
    }
      menuOnClick = () =>{
        // console.log(123);
        this.setState(prevState =>({
            isMenuOnClick : !prevState.isMenuOnClick
        }))
    }
    handleIframeLoad = () => {
        this.setState({ loading: false }); // Khi iframe đã tải xong, cập nhật state
    }
    render() {
        return (
            
            <PageForm body={
                <div className='document-container'>
                    <a href="/hsk1.pdf">Giáo trình chuẩn HSK1</a>
                    <a href="/hsk2.pdf">Giáo trình chuẩn HSK2</a>
                    <a href="/hsk3.pdf">Giáo trình chuẩn HSK3</a>
                    <a href="/hsk4-1.pdf">Giáo trình chuẩn HSK4 tập 1</a>
                    <a href="/hsk4-2.pdf">Giáo trình chuẩn HSK4 tập 2</a>
                    <a href="/hsk5-tap1.pdf">Giáo trình chuẩn HSK5 tập 1</a>
                    <a href="/hsk5-2.pdf">Giáo trình chuẩn HSK5 tập 2</a>
                    <a href="/hsk6-1.pdf">Giáo trình chuẩn HSK6 tập 1</a>
                    <a href="/hsk6-2.pdf">Giáo trình chuẩn HSK6 tập 2</a>
                </div>}/>
            
        );
    }
}

export default ViewerWebsite;