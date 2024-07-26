import React, { Component } from 'react';

class Confirm extends Component {
    render() {
        return (
            <div className="confirm js-confirm">
                <div className="confirm-container js-confirm-container">
                    <div className="container-close js-close">
                        <i className="ti-close" />
                    </div>
                    <div className="confirm-header js-confirm-header">123</div>
                    <div className="confirm-body js-confirm-body">
                        <div className="confirm-no js-confirm-no">
                            <h1>No</h1>
                        </div>
                        <div className="confirm-yes js-confirm-yes js-delete-yes">
                            <h1>Yes</h1>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Confirm;