import React, { Component } from 'react';

function DichthuatFormInput(props){
    return(
            <div className="form-group dichthuat-formInput">
                <label htmlFor="">{props.title}</label>
                <input
                    type="text"
                    className="form-control"
                    name={props.name}
                    id=""
                    aria-describedby="helpId"
                    placeholder={props.placeHolder}
                    onChange={props.onChangeHandle}
                    // value={props.value}
                    defaultValue={props.defaultValue}
                />
                {/* <small id="helpId" className="form-text text-muted">
                    Help text
                </small> */}
            </div>
    )
}
export default DichthuatFormInput