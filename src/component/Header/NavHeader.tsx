import React, { Component } from 'react';
import './NavHeader.css';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavHeaderProps {
    toggleMenuSide: () => void;
}

interface NavHeaderState {
    isDropdownOpen: boolean;
    logout: boolean;
}

class NavHeader extends Component<NavHeaderProps, NavHeaderState> {
    state: NavHeaderState = {
        isDropdownOpen: false,
        logout: false
    };

    toggleDropdown = () => {
        this.setState(prevState => ({ isDropdownOpen: !prevState.isDropdownOpen }));
    };

    toggleMenuSideVisibility = () => {
        this.props.toggleMenuSide();
    }

    loginFunction = () => {
        this.setState({ logout: true });
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
        this.setState({ logout: true });
    }

    componentDidUpdate(prevProps: NavHeaderProps, prevState: NavHeaderState) {
        if (this.state.logout && !prevState.logout) {
            useRouter().push('/login');
        }
    }

    render() {
        const { isDropdownOpen } = this.state;
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
                                <Link href="/changePassword" passHref legacyBehavior>
                                    <a className="dropdown-item">
                                        <i className="fa-solid fa-gears nav-icon"></i>
                                        Đổi mật khẩu
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <a className="dropdown-item" onClick={this.loginFunction}>
                                    <i className="fa-solid fa-arrow-right-to-bracket nav-icon"></i>
                                    Đăng nhập
                                </a>
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

const BtnLink: React.FC<{ toggleMenuSideVisibility: () => void }> = ({ toggleMenuSideVisibility }) => {
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

export default NavHeader;
