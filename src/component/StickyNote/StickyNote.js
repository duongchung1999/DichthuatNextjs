import React, { Component } from 'react';
import Header from '../Header/Header';
import Container from './Container';
import AddSection from './AddSection';
import Confirm from './Confirm';
import { loadFileList } from '../../function/Firebase';
import { CreateNewSection } from '../../function/Firebase';
import { DeleteSection } from '../../function/Firebase';
import { ShowNewFile } from '../../function/Firebase';
import { SaveDataToFirebase } from '../../function/Firebase';
import NavHeader from '../Header/NavHeader';
import PageForm from '../PageForm/PageForm';

class StickyNote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMenuOnClick: true
        };
    }
    componentDidMount(){
        loadFileList();
    }

    addSection = () =>{
            const addButton = document.getElementById("add-section");
        const addSectionsForm = document.querySelector(".add-sections");
        const closeFormButton = document.querySelector(".js-add-sections-close");
        const yesButton = document.querySelector(".add-sections-yes");
        const noButton = document.querySelector(".add-sections-no");
        const inputSectionName = document.querySelector(".add-sections-input input");

        addButton.addEventListener("click", function () {
            addSectionsForm.style.display = "flex";
        });

        // Ẩn form khi nhấn nút "Close" hoặc nút "No"
        closeFormButton.addEventListener("click", function () {
            addSectionsForm.style.display = "none";
        });
        noButton.addEventListener("click", function () {
            addSectionsForm.style.display = "none";
        });

        // Ẩn form khi nhấn nút "Yes" và thực hiện các bước tiếp theo
        yesButton.addEventListener("click", function () {
            
            var sectionName = inputSectionName.value;
            CreateNewSection(sectionName);
            ShowNewFile(sectionName)
            addSectionsForm.style.display = "none";
        });
    }
    menuOnClick = () =>{
        // console.log(123);
        this.setState(prevState =>({
            isMenuOnClick : !prevState.isMenuOnClick
        }))
    }
    render() {
        return (
            <PageForm body={
            <>
                <Container addSection={this.addSection} Delete={Delete} menuOnClick={this.menuOnClick}/>
                <AddSection />
                <Confirm/>
            </>}/>
        );
    }
}

export default StickyNote;

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