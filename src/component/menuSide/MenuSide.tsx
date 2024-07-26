import React, { Component } from 'react';
import './MenuSide.css';
import Link from 'next/link';

interface MenuSideProps {
    isMenuSideVisible: boolean;
}

interface MenuSideState {
    viewMenuSide2nd: boolean;
}

class MenuSide extends Component<MenuSideProps, MenuSideState> {
    constructor(props: MenuSideProps) {
        super(props);
        this.state = {
            viewMenuSide2nd: localStorage.getItem("viewItAsset") === 'true'
        };
    }

    componentDidUpdate(prevProps: MenuSideProps, prevState: MenuSideState) {
        if (prevState.viewMenuSide2nd !== this.state.viewMenuSide2nd) {
            this.renderItemAsset();
            localStorage.setItem('viewItAsset', String(this.state.viewMenuSide2nd));
        }
    }

    viewItem = () => {
        this.setState(prevState => ({
            viewMenuSide2nd: !prevState.viewMenuSide2nd
        }));
    }

    renderItemAsset = () => {
        if (this.state.viewMenuSide2nd) {
            return (
                <div className='menuSide-2nd'>
                    <NavItem path="/convertText" itemName="Chuyển đổi text" icon={<i className="nav-icon fa-solid fa-font"></i>} />
                    <NavItem path="/tudiendich" itemName="Từ điển dịch" icon={<i className="nav-icon fa-solid fa-shuffle"></i>} />
                    <NavItem path="/pdfGiaotrinh" itemName="Giáo trình PDF" icon={<i className="nav-icon fa-solid fa-file-pdf"></i>} />
                    <NavItem path="/hanzi" itemName="Từ điển Hanzi" icon={<i className="nav-icon fa-solid fa-language"></i>} />
                    <NavItem path="/jiaocheng" itemName="TKPS Gia Ngôn Lục" icon={<i className="nav-icon fa-solid fa-book-journal-whills"></i>} />
                    <NavItem path="/stickynote" itemName="Sticky Notes" icon={<i className="nav-icon fa-solid fa-file-pen"></i>} />
                
                </div>
            );
        }
        return null;
    }

    render() {
        const { isMenuSideVisible } = this.props;
        const userName = localStorage.getItem("name");

        return (
            <div className={isMenuSideVisible ? 'layoutContainer d-none d-md-inline-block' : 'layoutContainer d-none d-md-inline-block'}>
                <div className='menuSide sb-sidenav'>
                    <div className='menuSide-item'>
                        <ul className="menuSide-nav">
                            <NavItem path="/" itemName="Bảng tin" icon={<i className="nav-icon fa-solid fa-newspaper"></i>} />
                            <NavItem path="/dichthuat" itemName="Dịch Thuật" icon={<i className="nav-icon fa-solid fa-house"></i>} />
                           
                            <NavItem path="/nhidonghocphat" itemName="Nhi đồng học Phật" icon={<i className="nav-icon fa-solid fa-earth-americas"></i>} />
                            <NavItem path="/tddkkc" itemName="Tịnh Độ Đại Kinh" icon={<i className="nav-icon fa-solid fa-book"></i>} />
                           

                            <li className='menuSide-it-asset' onClick={this.viewItem}>
                                <a className='nav-link'>
                                    <i className="nav-icon fa-solid fa-toolbox"></i>
                                    Cập nhật bài học
                                    {this.renderItemAsset()}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

interface NavItemProps {
    path: string;
    itemName: string;
    icon: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ path, itemName, icon }) => {
    return (
        <li>
            <Link href={path} legacyBehavior>
                <a className="nav-link">{icon} {itemName}</a>
            </Link>
        </li>
    );
}

export default MenuSide;
