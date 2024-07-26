"use client"

import React, { Component } from 'react';
import PageForm from '@/component/PageForm/PageForm';

class ViewerWebsite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMenuOnClick: true
        };
    }
      menuOnClick = () =>{
        // console.log(123);
        this.setState(prevState =>({
            isMenuOnClick : !prevState.isMenuOnClick
        }))
    }
    render() {
        return (
            
            <PageForm body={
                <>
                    <iframe 
                        src="https://tudiendich.com/"
                        width="100%" 
                        height="1000px" 
                        style={{border: "none"}}
                        title="Hanzii"
                    ></iframe>
                </>}/>
            
        );
    }
}

export default ViewerWebsite;