import React, { Component } from 'react';

class AddSection extends Component {
    render() {
        return (
            <div className="add-sections js-add-sections">
                <div className="add-sections-container js-add-sections-container">
                    <div className="add-sections-close js-add-sections-close">
                        <i className="ti-close" />
                    </div>
                    <div className="add-sections-header js-add-sections-header">
                        <h2>Tạo bài dịch mới</h2>
                    </div>
                    <div className="add-sections-body js-add-sections-body">
                        <div className="add-sections-input">
                            <h3>Nhập tên bài học:</h3>
                            <input type="text" placeholder="Nhập tên bài mới bạn muốn tạo" />
                        </div>
                        <div className="add-sections-no js-add-sections-no">
                            <h1>No</h1>
                        </div>
                        <div className="add-sections-yes js-add-sections-yes">
                            <h1>Yes</h1>
                        </div>
                    </div>
                    <div className="add-sections-footer js-add-sections-footer" />
                </div>
            </div>
        );
    }
}

export default AddSection;