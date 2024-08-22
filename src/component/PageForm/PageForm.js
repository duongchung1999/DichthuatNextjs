import './PageForm.css';
import NavHeader from '@/component/Header/NavHeader';
import MenuSide from '@/component/menuSide/MenuSide';
import React, { Component } from 'react';


class PageForm extends Component  {
  constructor(props) {
      super(props);
      this.state = {
          isMenuSideVisible: true
      };
  }

  toggleMenuSideVisibility = () => {
    console.log(234);
      this.setState(prevState => ({
          isMenuSideVisible: !prevState.isMenuSideVisible
      }));
  }

  render (){
    return (
      <div className="sb-nav-fixed">
        <NavHeader toggleMenuSide={this.toggleMenuSideVisibility}/>
        <div className='UserContainer d-md-inline-block'>
          <div className='UserContainer-block'>
            {/* {this.state.isMenuSideVisible && <MenuSide />} */}
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


