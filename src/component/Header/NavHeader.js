"use client"
import React, { Component } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Link from 'next/link';
import './NavHeader.css';

const NavHeaderWrapper = () => {
    const router = useRouter();
    return <NavHeader router={router} />;
};

class NavHeader extends Component {
    state = {
        isDropdownOpen: false,
        logout: false,
    };

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
            this.props.router.push('/login');
        }
    }

    render() {
        const { isDropdownOpen, logout } = this.state;
        const userName = localStorage.getItem("name");

        return (
            <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <a className="navbar-brand header-logo" href="#!">
                        <span className="ml-2 header-logo-span"><h1>Dịch Thuật</h1></span>
                    </a>
                    <BtnLink toggleMenuSideVisibility={this.toggleMenuSideVisibility} />
                </div>
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

export default NavHeaderWrapper;
