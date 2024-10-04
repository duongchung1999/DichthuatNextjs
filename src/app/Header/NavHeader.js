'use client'
import React, { Component } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Link from 'next/link';
// import './NavHeader.css';
// import { isLogin } from '../publicFc/PublicFunction';
// import { isAdmin } from '../publicFc/PublicFunction';
import { redirect } from 'next/navigation'

// const NavHeaderWrapper = () => {
//     const router = useRouter();
//     return <NavHeader router={router} />;
// };

class NavHeader extends Component {
    state = {
        isDropdownOpen: false,
        logout: false,
        flagLogin: false,
        flagAdmin: false,
        userName: null, // Add userName to state
    };

    componentDidMount() {
        const userName = localStorage.getItem("name"); // Access localStorage in componentDidMount
        this.setState({ userName });
        this.isAdmin();
        this.isLogin();
    }
    isLogin(){
        const MyUserName = localStorage.getItem("name");
        if(MyUserName) this.setState({flagLogin:true})
    }
    
    isAdmin(){{
        const user = localStorage.getItem("user");
        if(user=="duong171099") this.setState({flagAdmin:true})
    }}

    toggleDropdown = () => {
        this.setState(prevState => ({ isDropdownOpen: !prevState.isDropdownOpen }));
    };

    toggleMenuSideVisibility = () => {
        this.props.toggleMenuSide();
    }

    loginFunction = () => {
        this.setState({
            logout: true
        });
    }

    LogoutFunction = () => {
        localStorage.clear();
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Logout Success",
            showConfirmButton: false,
            timer: 1500
        });
        this.setState({
            logout: true
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.logout && !prevState.logout) {
            // this.props.router.push('/login');
            redirect('/login');
        }
    }
    renderItemAsset = () =>{
        if(this.state.viewMenuSide2nd){
            return(
                <div className='menuSide-2nd'>
                    {this.state.flagAdmin&&<NavItem path="/stickynote" itemName="Sticky Notes" icon = {<i className="nav-icon fa-solid fa-file-pen"></i>}/>}
                    {this.state.flagAdmin&&<NavItem path="/convertText" itemName="Chuyển đổi text" icon = {<i className="nav-icon fa-solid fa-font"></i>}/>}
                    {this.state.flagAdmin&&<NavItem path="/tudiendich" itemName="Từ điển dịch" icon = {<i className="nav-icon fa-solid fa-shuffle"></i>}/>}
                    {this.state.flagAdmin&&<NavItem path="/document" itemName="Documents" icon = {<i className="nav-icon fa-regular fa-folder-open"></i>}/>}
                    <NavItem path="/nhidonghocphat" itemName="Nhi đồng học Phật" icon = {<i className="nav-icon fa-solid fa-earth-americas"></i>}/>
                    <NavItem path="/tddkkc" itemName="淨土大經科註" icon = {<i className="nav-icon fa-solid fa-book"></i>}/>
                    <NavItem path="/jiaocheng" itemName="淨空法師嘉言錄" icon = {<i className="nav-icon fa-solid fa-book-journal-whills"></i>}/>
                    <NavItem path="/pdfGiaotrinh" itemName="PDF TKPS Gia Ngôn Lục" icon = {<i className="nav-icon fa-solid fa-file-pdf"></i>}/>
                    <NavItem path="/hanzi" itemName="Từ điển Hanzi" icon = {<i className="nav-icon fa-solid fa-language"></i>}/>
                    {this.state.flagAdmin&&<NavItem path="/hsk5-tap1.pdf" itemName="HSK5 Tap1" icon = {<i className="nav-icon fa-solid fa-pencil"></i>}/>}
                
                </div>
            )
        }
        return null;
        
    }
    viewItem = () =>{
        this.setState(prevState =>({
            viewMenuSide2nd: !prevState.viewMenuSide2nd
            
        }));
    }

    render() {
        const { isDropdownOpen, logout, userName } = this.state; // Use userName from state

        return (
            <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Link href="/" className='navbar-brand header-logo'>
                        <span className="ml-2 header-logo-span"><h1>Dịch Thuật</h1></span>
                    </Link>
                    {/* <a className="navbar-brand header-logo" href="#!">
                        <span className="ml-2 header-logo-span"><h1>Dịch Thuật</h1></span>
                    </a> */}
                    <BtnLink toggleMenuSideVisibility={this.toggleMenuSideVisibility} />
                </div>
                <ul className='menuSide-column'>
                    <NavItem path="/" itemName="Bảng tin" icon = {<i className="nav-icon fa-solid fa-newspaper"></i>}/>
                    <NavItem path="/dichthuat/dichthuatDetails/tdk2014" itemName="Tịnh Độ Đại Kinh Khoa Chú 2014" icon = {<i className="nav-icon fa-solid fa-book"></i>}/>
                    {this.state.flagLogin&&<NavItem path="/dichthuat" itemName="Dịch Thuật" icon = {<i className="nav-icon fa-solid fa-pen-to-square"></i>}/>}
                    <li  onClick={this.viewItem}>
                                <a className='nav-link1'>
                                    <i className="nav-icon fa-solid fa-toolbox"></i>
                                    <div className='isShowitemName'>
                                    Tài liệu tham khảo
                                    </div>
                                    
                                    {this.renderItemAsset()}
                                    {/* <div className='menuSide-2nd'>
                                        {this.state.flagAdmin&&<NavItem path="/stickynote" itemName="Sticky Notes" icon = {<i className="nav-icon fa-solid fa-file-pen"></i>}/>}
                                        {this.state.flagAdmin&&<NavItem path="/convertText" itemName="Chuyển đổi text" icon = {<i class="nav-icon fa-solid fa-font"></i>}/>}
                                        {this.state.flagAdmin&&<NavItem path="/tudiendich" itemName="Từ điển dịch" icon = {<i class="nav-icon fa-solid fa-shuffle"></i>}/>}
                                        <NavItem path="/nhidonghocphat" itemName="Nhi đồng học Phật" icon = {<i className="nav-icon fa-solid fa-earth-americas"></i>}/>
                                        <NavItem path="/jiaocheng" itemName="TKPS Gia Ngôn Lục" icon = {<i class="nav-icon fa-solid fa-book-journal-whills"></i>}/>
                                        <NavItem path="/pdfGiaotrinh" itemName="PDF TKPS Gia Ngôn Lục" icon = {<i class="nav-icon fa-solid fa-file-pdf"></i>}/>
                                        <NavItem path="/hanzi" itemName="Từ điển Hanzi" icon = {<i className="nav-icon fa-solid fa-language"></i>}/>
                                    
                                    </div> */}
                                    
                                    
                                </a>
                            </li>
                </ul>
                <ul className="navbar-nav ms-md-0 me-3 me-lg-4">
                    <li className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle"
                            id="navbarDropdown"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            onClick={this.toggleDropdown}
                            aria-expanded={isDropdownOpen ? "true" : "false"}
                        >
                            {userName ? userName : null} <i className="fas fa-user fa-fw" />
                        </a>
                        <ul
                            className={`dropdown-menu ${isDropdownOpen ? 'dropdown-menu-end show' : ''}`}
                            aria-labelledby="navbarDropdown"
                        >
                            <li>
                                <Link className="dropdown-item" href="/changePassword" passHref legacyBehavior>
                                    <div className="dropdown-item">
                                        <i className="fa-solid fa-gears nav-icon"></i>
                                        Đổi mật khẩu
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <div className="dropdown-item" onClick={this.loginFunction}>
                                    <i className="fa-solid fa-arrow-right-to-bracket nav-icon"></i>
                                    Đăng nhập
                                </div>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <a className="dropdown-item" onClick={this.LogoutFunction}>
                                    <i className="fa-solid fa-arrow-right-from-bracket nav-icon"></i>
                                    Đăng xuất {userName ? " " + userName : null}
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        );
    }
}

const BtnLink = ({ toggleMenuSideVisibility }) => {
    return (
        <button
            className="btn btn-link btn-sm order-lg-0 me-4 me-lg-0"
            id="sidebarToggle"
            onClick={toggleMenuSideVisibility}
        >
            <i className="fas fa-bars" />
        </button>
    );
};

function NavItem(props){
    return(
        <li>
            <Link href={props.path} legacyBehavior>
                <a className="nav-link1">
                    {props.icon}
                    <div className='isShowitemName'>
                        {props.itemName}
                    </div> 
                    
                    </a>
            </Link>
        </li>
    )
}
function NavItemDiv(props){
    return(
        <Link href={props.path} legacyBehavior>
                <a className="nav-link1">
                    {props.icon}
                    <div className='isShowitemName'>
                        {props.itemName}
                    </div> 
                    
                    </a>
            </Link>
    )
}
export default NavHeader;
