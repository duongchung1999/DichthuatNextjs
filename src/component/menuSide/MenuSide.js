import React, { Component } from 'react';
import './MenuSide.css';
// import { NavLink } from 'react-router-dom';
import Link from 'next/link';
import { isLogin } from '../publicFc/PublicFunction';
import { isAdmin } from '../publicFc/PublicFunction';


class MenuSide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewMenuSide2nd: false,
            flagLogin: false,
            flagAdmin: false,
        };
    }

    componentDidMount() {
        if (typeof window !== "undefined") {
            this.setState({
                viewMenuSide2nd: localStorage.getItem("viewItAsset") ? localStorage.getItem("viewItAsset") : false,
            });
        }
        if(isLogin()){
            this.setState({flagLogin:true})
        }
        if(isAdmin()){
            this.setState({flagAdmin:true})
        }
    }

    componentDidUpdate(prevState){
        if (prevState.viewMenuSide2nd !== this.state.viewMenuSide2nd) {
            this.renderItemAsset();
            if (typeof window !== "undefined") {
                localStorage.setItem('viewItAsset', this.state.viewMenuSide2nd);
            }
        }
    }
    viewItem = () =>{
        this.setState(prevState =>({
            viewMenuSide2nd: !prevState.viewMenuSide2nd
            
        }));
    }
    renderItemAsset = () =>{
        if(this.state.viewMenuSide2nd){
            return(
                <div className='menuSide-2nd'>
                    {this.state.flagAdmin&&<NavItem path="/stickynote" itemName="Sticky Notes" icon = {<i className="nav-icon fa-solid fa-file-pen"></i>}/>}
                    {this.state.flagAdmin&&<NavItem path="/convertText" itemName="Chuyển đổi text" icon = {<i class="nav-icon fa-solid fa-font"></i>}/>}
                    {this.state.flagAdmin&&<NavItem path="/tudiendich" itemName="Từ điển dịch" icon = {<i class="nav-icon fa-solid fa-shuffle"></i>}/>}
                    <NavItem path="/nhidonghocphat" itemName="Nhi đồng học Phật" icon = {<i className="nav-icon fa-solid fa-earth-americas"></i>}/>
                    <NavItem path="/jiaocheng" itemName="TKPS Gia Ngôn Lục" icon = {<i class="nav-icon fa-solid fa-book-journal-whills"></i>}/>
                    <NavItem path="/pdfGiaotrinh" itemName="PDF TKPS Gia Ngôn Lục" icon = {<i class="nav-icon fa-solid fa-file-pdf"></i>}/>
                    <NavItem path="/hanzi" itemName="Từ điển Hanzi" icon = {<i className="nav-icon fa-solid fa-language"></i>}/>
                
                </div>
            )
        }
        return null;
        
    }
    render() {
        const { isMenuSideVisible } = this.props;
        // var userName = localStorage.getItem("name");
        // const item = JSON.parse(userName)
        // console.log(userName);
        return (
            <div className={isMenuSideVisible ? 'layoutContainer d-none d-md-inline-block' : 'layoutContainer d-none d-md-inline-block'}>
            {/* <div className={isMenuSideVisible ? 'layoutContainer d-none d-md-inline-block' : 'layoutContainer d-none d-md-inline-block'}> */}
                <div className='menuSide sb-sidenav'>
                    <div className='menuSide-item'>
                        <ul className="menuSide-nav">
                
                           
                           
                            
                            <li className='menuSide-it-asset' onClick={this.viewItem}>
                                <a className='nav-link'>
                                    <i class="nav-icon fa-solid fa-toolbox"></i>
                                    Tài liệu tham khảo
                                    {this.renderItemAsset()}
                                    
                                    
                                </a>
                            </li>
                            {/* <NavItem path="/history" itemName="History" icon = {<i className="nav-icon fa-solid fa-clock-rotate-left"></i>}/> */}
                            
                        </ul>
                        
                    </div>

                    {/* <div className='menuSide-footer'>
                        <div className="small">Đăng nhập với</div>
                        <i className="fa-solid fa-diagram-project"></i>
                        <span className="ml-2">{userName?userName:"Guest"}</span>
                    </div> */}

                    
                </div>
            </div>
            
        );
    }
}

function NavItem(props){
    return(
        <li>
            <Link href={props.path} legacyBehavior>
                <a className="nav-link">{props.icon} {props.itemName}</a>
            </Link>
        </li>
    )
}


export default MenuSide;