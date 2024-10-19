'use client'
import React, { Component } from 'react';
import ReplaceValue from '@/component/replaceValue/ReplaceValue';
import { getContentFromFireBase } from '@/component/firebase/Firebase';
import { Button } from 'react-bootstrap';

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            divisionNumber: 10, 
            sokytucat:null,
            soluongkytu:null,
        };
    }

    handleDivisionNumberChange = (event) => {
        this.setState({ divisionNumber: parseInt(event.target.value) || 10 }); 
    }

    textConvert = () => {
        var leftTextbox = document.querySelector('.content-left');
        var leftContent = leftTextbox.value;
        var modifiedContent = this.convertAndFormat(leftContent);
        var rightTextbox = document.querySelector('.content-right');
        var convertPath = "/users/user1/kecheng/convert/convert";

        getContentFromFireBase(convertPath)
            .then((data) => {
                if (data !== null) {
                    var sentences = data.split('\n');
                    sentences.forEach(st => {
                        var convert = st.split('=');
                        if (convert.length === 2) {
                            var regex = new RegExp(convert[0].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
                            modifiedContent = modifiedContent.replace(new RegExp(regex, 'gi'), convert[1]);
                            rightTextbox.value = modifiedContent;
                        }
                    });
                }
            })
            .catch((error) => {
                console.error("Có lỗi xảy ra:", error);
            });

        rightTextbox.value = modifiedContent;
    }

    convertAndFormat(text) {
        var sentences = text.split(/([.!?。？！])\s*/);
        var formattedContent = '';
        for (var i = 0; i < sentences.length; i += 2) {
            formattedContent += sentences[i].trim() + (sentences[i + 1] || '');
            if (i < sentences.length - 2) {
                formattedContent += '\n';
            }
        }
        formattedContent = ReplaceValue(formattedContent);
        return formattedContent;
    }

    pinyinConvert = () => {
        var pinyinText = document.querySelector('.content-left');
        var pinyinContent = pinyinText.value;
        var pinyinResult = document.querySelector('.content-right');
        var newText = ReplaceValue(pinyinContent);
        var convertPath = "/users/user1/kecheng/convert/convert";

        getContentFromFireBase(convertPath)
            .then((data) => {
                if (data !== null) {
                    var sentences = data.split('\n');
                    sentences.forEach(st => {
                        var convert = st.split('=');
                        if (convert.length === 2) {
                            var regex = new RegExp(convert[0].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
                            newText = newText.replace(regex, convert[1]);
                            pinyinResult.value = newText;
                        }
                    });
                }
            })
            .catch((error) => {
                console.error("Có lỗi xảy ra:", error);
            });

        pinyinResult.value = newText;
    }

    getNumberOfText = (text) => {
        var textWithoutPunctuation = text.replace(/[.,:!?。，：！、“”【】[\]‘’]/g, '');
        return textWithoutPunctuation.length;
    }

    getOneTenthText = () => {
        var leftTextbox = document.querySelector('.content-left');
        var text = leftTextbox.value;

        var textLength = this.getNumberOfText(text);
        this.setState({soluongkytu:textLength});
        // console.log("Toàn bài: ", textLength, "chữ");

        var oneTenthLength = Math.ceil(textLength / this.state.divisionNumber);
        console.log(oneTenthLength);

        for (let i = 0; i < textLength; i++) {
            var oneTenthText = text.slice(0, oneTenthLength + i);
            var lengthOfNewText = this.getNumberOfText(oneTenthText);

            if (lengthOfNewText === oneTenthLength) {
                var pinyinTextbox = document.querySelector('.content-right');
                pinyinTextbox.value = oneTenthText;
                // console.log("Bài sau khi cắt: ", this.getNumberOfText(oneTenthText), " chữ");
                var sokytucat = this.getNumberOfText(oneTenthText)
                this.setState({sokytucat});
                break;
            }
        }
    }

    render() {
        return (
            <div id="content">
                <div className='btnMenuSide'>
                    <h2>Convert Text</h2>
                </div>
                
                <div className="container1">
                    <div className='row' style={{width:'100%'}}>
                        <div className='col-5' style={{padding:'0'}}>
                            <textarea
                                className="left-textbox content-left text-box-height"
                                placeholder="Nội dung cần chuyển đổi"
                                defaultValue={""}
                            />
                        </div>

                        <div className='col-2' style={{padding:'0'}}>
                            <div className='btnConvert'>
                                <Button className="btn-content" variant="warning" onClick={this.textConvert}>
                                    Chuyển đổi văn bản
                                </Button>
                                {/* <Button id="btn-pinyin" variant="warning" onClick={this.pinyinConvert}>
                                    Pinyin Convert
                                </Button> */}
                                <Button className="btn-content" variant="warning" onClick={this.getOneTenthText}>
                                    Cắt đoạn văn
                                </Button>
                                <br/>
                                Nhập ước số cần chia
                                <input
                                    type="number"
                                    className="form-control"
                                    name="divisionNumber"
                                    aria-describedby="helpId"
                                    placeholder="0"
                                    onChange={this.handleDivisionNumberChange}
                                />
                                <br/>
                                Số lượng ký tự toàn bài
                                <input
                                    type="number"
                                    className="form-control"
                                    name="divisionNumber"
                                    aria-describedby="helpId"
                                    placeholder="0"
                                    // onChange={this.handleDivisionNumberChange}
                                    value={this.state.soluongkytu}
                                    disabled
                                />
                                <br/>
                                Số lượng ký tự sau khi cắt
                                 <input
                                    type="number"
                                    className="form-control"
                                    name="divisionNumber"
                                    aria-describedby="helpId"
                                    placeholder="0"
                                    // onChange={this.handleDivisionNumberChange}
                                    value={this.state.sokytucat}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className='col-5' style={{padding:'0'}}>
                            <textarea
                                className="right-textbox content-right text-box-height"
                                placeholder="Nội dung sau khi chuyển đổi"
                                defaultValue={""}
                            />
                        </div>
                    </div>
                </div>

                {/* <div className="container1">
                    <div className='row' style={{width:'100%'}}>
                        <div className='col-5' style={{padding:'0'}}>
                            <textarea
                                className="left-textbox pinyin-left text-box-height"
                                placeholder="Pinyin cần chuyển đổi"
                                defaultValue={""}
                            />
                        </div>

                        <div className='col-2' style={{padding:'0'}}>
                            <div className='btnConvert'>
                                <Button id="btn-pinyin" variant="warning" onClick={this.pinyinConvert}>
                                    Pinyin Convert
                                </Button>
                            </div>
                        </div>

                        <div className='col-5' style={{padding:'0'}}>
                            <textarea
                                className="right-textbox pinyin-right text-box-height"
                                placeholder="Pinyin sau khi chuyển đổi"
                                defaultValue={""}
                            />
                        </div>
                    </div>
                </div> */}
            </div>
        );
    }
}

export default Content;
