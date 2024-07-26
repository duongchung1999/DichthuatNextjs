import './PageForm.css';
import NavHeader from '../Header/NavHeader';
import MenuSide from '../menuSide/MenuSide';
import React, { Component } from 'react';

interface PageFormProps {
    body: React.ReactNode;
}

interface PageFormState {
    isMenuSideVisible: boolean;
}

class PageForm extends Component<PageFormProps, PageFormState> {
    constructor(props: PageFormProps) {
        super(props);
        this.state = {
            isMenuSideVisible: true
        };
    }

    toggleMenuSideVisibility = () => {
        this.setState(prevState => ({
            isMenuSideVisible: !prevState.isMenuSideVisible
        }));
    }

    render() {
        return (
            <div className="sb-nav-fixed">
                <NavHeader toggleMenuSide={this.toggleMenuSideVisibility} />
                <div className='UserContainer d-md-inline-block'>
                    <div className='UserContainer-block'>
                        {this.state.isMenuSideVisible && <MenuSide isMenuSideVisible={this.state.isMenuSideVisible} />}
                        <div className='table-container col' id='table-container'>
                            <div className='table-container-header'>
                                {this.props.body}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PageForm;
