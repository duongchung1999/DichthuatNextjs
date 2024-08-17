"use client"
import React, { Component } from 'react';
import { DeleteSection } from '@/component/firebase/Firebase';
import { loadFileList } from '@/component/firebase/Firebase';
import { SaveDataToFirebase } from '@/component/firebase/Firebase';
import { loadSelectedFile } from '@/component/firebase/Firebase';


class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMenuSideVisible: true
        };
    }
   

    render() {
        return (
            <div className="content js-content">
                    <div id="header-select">
                        <h1>
                        Sticky Note
                        </h1>
                        {/* Thêm combobox */}
                        {/* <label for="fileList">Chọn tệp:</label> */}
                        <select id="fileList" className="menu-fileList" onChange={loadSelectedFile}>
                        {/* Danh sách tên file sẽ được thêm ở đây bằng mã JavaScript */}
                        </select>
                        <button
                        id="add-section"
                        className="buttoncss add-section"
                        onClick={this.props.addSection}
                        >
                            <i class="fa-solid fa-plus"></i>
                            <div className="add-section-note">Thêm bài mới</div>
                        </button>

                        <button id="delete-section" className="buttoncss"
                         onClick={Delete}>
                            <i class="fa-solid fa-trash"></i>
                            <div className="add-section-note">Xóa</div>
                        </button>

                        <button className="btn-save buttoncss" id="btn-right"
                        onClick={Save}>
                            <i class="fa-regular fa-floppy-disk"></i>
                            <div className="add-section-note">Lưu</div>
                        </button>
                    </div>
                    <div className="container1">
                        {/* <button class="btn-save" id="btn-left" ><i class="nav-icon ti-download"></i></button> */}
                        <textarea
                        className="left-textbox content-left richtext"
                        placeholder="Bài viết tiếng trung"
                        defaultValue={""}
                        />
                        {/* <button id="btn-content">Text Convert</button>
                            <button id="btn-save" ><i class="nav-icon ti-download"></i></button> */}
                        <textarea
                        className="right-textbox content-right richtext"
                        placeholder="Bài dịch"
                        defaultValue={""}
                        />
                    </div>
                    <div id="output" />
                    <div className="fbcomment text-xs-center">
                        <div className="row">
                        <div className="col-sm-12">
                            <h2>Phản hồi</h2>
                        </div>
                        <div className="col-sm-8 push-sm-2">
                            <div
                            className="fb-comments"
                            data-href="https://duongchung1999.github.io/Convert-Text-Web/contents/ContentViewer.html"
                            data-width={576}
                            data-numposts={5}
                            />
                        </div>
                        </div>
                    </div>
                    </div>
        );
    }
}

export default Container;
function Delete(){
    const deletesection = document.getElementById("delete-section");
    const confirmDialog = document.querySelector(".js-confirm");
    const confirmYes = document.querySelector(".js-delete-yes");
    const confirmNo = document.querySelector(".js-confirm-no");
    const confirmClose = document.querySelector(".js-close");
    const confirmHeaderText = document.querySelector(".js-confirm-header");
    const confirmContainer = document.querySelector(".confirm-container");

    var isClicked = false;
    // Hiển thị hộp thoại xác nhận khi người dùng click vào nút "Lưu"
    deletesection.addEventListener("click", function () {
        var fileList = document.getElementById('fileList');
        var deleteFile = fileList.value; 
        // alert(deleteFile);
        let headerText = `Bạn có chắc chắn muốn xóa ${deleteFile}?`;
        confirmHeaderText.textContent = headerText; 
        confirmDialog.style.display = "flex"; // Hiển thị hộp thoại xác nhận


        var isClicked = false;

        // Bắt sự kiện cho nút "Có" trong hộp thoại xác nhận
        confirmYes.addEventListener("click", function () {
            if (!isClicked) { // Kiểm tra xem đã click trước đó hay chưa
                isClicked = true; // Đặt biến isClicked thành true
                var fileList = document.getElementById('fileList');
                var deleteFile = fileList.value; 
                confirmHeaderText.textContent = `Xóa ${deleteFile} thành công`; 
                confirmHeaderText.style.height = "150px";
                confirmHeaderText.style.color = "#fff";
                confirmContainer.style.background = "#5f7e5c";
                confirmYes.style.display = "none";
                confirmNo.style.display = "none";
                setTimeout(function() {
                    DeleteSection(deleteFile);
                    loadFileList();
                    console.log("Người dùng chọn Có. Đang tiến hành bước tiếp theo.");
                    confirmYes.style.display = "flex";
                    confirmNo.style.display = "flex";
                    confirmHeaderText.style.height = "125px";
                    confirmHeaderText.style.color = "#000";
                    confirmContainer.style.background = "#fff";
                    confirmDialog.style.display = "none";
                    // isClicked = false;
                }, 1000);
            }
        });
    
        // Bắt sự kiện cho nút "Không" trong hộp thoại xác nhận
            confirmNo.addEventListener("click", function () {
            // Không làm gì hoặc xử lý khi người dùng từ chối
            console.log("Người dùng chọn Không. Hủy bỏ hành động.");
    
            // Đóng hộp thoại xác nhận
            confirmDialog.style.display = "none";
        });
    
            confirmClose.addEventListener("click", function () {
            console.log("Người dùng chọn Close. Hủy bỏ hành động.");
            confirmDialog.style.display = "none";
        });
    });
}

function Save(){
    const btnSave = document.getElementById("btn-right");
    const confirmDialog = document.querySelector(".js-confirm");
    const confirmYes = document.querySelector(".js-confirm-yes");
    const confirmNo = document.querySelector(".js-confirm-no");
    const confirmClose = document.querySelector(".js-close");
    const confirmHeaderText = document.querySelector(".js-confirm-header");
    const confirmContainer = document.querySelector(".confirm-container");

    let headerText = "Bạn có chắc chắn muốn lưu dữ liệu này?";
    // Hiển thị hộp thoại xác nhận khi người dùng click vào nút "Lưu"
    btnSave.addEventListener("click", function () {
        confirmHeaderText.textContent = headerText; 
        confirmDialog.style.display = "flex"; // Hiển thị hộp thoại xác nhận


        var isClicked = false;
        confirmYes.addEventListener("click", function () {
            if(!isClicked){
                isClicked = true;
                confirmHeaderText.textContent = "Lưu dữ liệu thành công"; 
                confirmHeaderText.style.height = "150px";
                confirmHeaderText.style.color = "#fff";
                confirmContainer.style.background = "#5f7e5c";
                confirmYes.style.display = "none";
                confirmNo.style.display = "none";
                setTimeout(function() {
                    SaveDataToFirebase();
                    console.log("Người dùng chọn Có. Đang tiến hành bước tiếp theo.");
                    confirmYes.style.display = "flex";
                    confirmNo.style.display = "flex";
                    confirmHeaderText.style.height = "125px";
                    confirmHeaderText.style.color = "#000";
                    confirmContainer.style.background = "#fff";
                    confirmDialog.style.display = "none";
                }, 1000); 
            }
        });

        // Bắt sự kiện cho nút "Không" trong hộp thoại xác nhận
        confirmNo.addEventListener("click", function () {
        // Không làm gì hoặc xử lý khi người dùng từ chối
        console.log("Người dùng chọn Không. Hủy bỏ hành động.");

        // Đóng hộp thoại xác nhận
        confirmDialog.style.display = "none";
        });

        confirmClose.addEventListener("click", function () {
        console.log("Người dùng chọn Close. Hủy bỏ hành động.");
        confirmDialog.style.display = "none";
        });
    });
}