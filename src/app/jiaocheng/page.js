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
                <>
                    <iframe 
                        src="https://book.bfnn.org/books/0486.htm"
                        width="100%" 
                        height="1000px" 
                        style={{border: "none"}}
                        title="Hanzii"
                        onLoad={this.handleIframeLoad} 
                    ></iframe>
                    {this.state.loading ? (
                        <WaitingLoad />
                    ) : null}
                </>}/>
            
        );
    }
}

export default ViewerWebsite;