"use client"
import React, { Component } from 'react';
import DisplayThemeButtons from '@/app/login/LoginScript';
// import'@/app/login/Login.css';
import Swal from 'sweetalert2';
import imgPhat from '@/assets/image/phat3.png'
import { getContentFromFireBase } from '@/component/firebase/Firebase';
import { AddDataToFireBaseNoKey } from '@/component/firebase/Firebase';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation'

class Register extends Component {
    state = { user: null, error: null,showPassword:false,showConfirmPassword:false };
    componentDidUpdate(){
        if(this.state.user) {
            redirect('/login')
        }
    }
    togglePasswordVisibility = () => {
        this.setState(prevState => ({
            showPassword: !prevState.showPassword
        }));
    };
    toggleConfirmPasswordVisibility = () => {
        this.setState(prevState => ({
            showConfirmPassword: !prevState.showConfirmPassword
        }));
    };
   
    handleSubmit = async (event) => {
        event.preventDefault(); 
        const formData = new FormData(event.target);
        const name = formData.get('name');
        const username = formData.get('username');
        const password = formData.get('password');
        const email = formData.get('email');
        const confirmPassword = formData.get('confirmPassword');
        const UserNamePath = `/users/account/${username}/username`
        const PasswordPath = `/users/account/${username}/password`
        const EmailPath = `/users/account/${username}/email`
        const NamePath = `/users/account/${username}/name`

        // const isValidPassword = (password) => {
        //     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
        //     return passwordRegex.test(password);
        // };
        const isValidPassword = (password) => {
            const passwordRegex = /^.{8,}$/;
            return passwordRegex.test(password);
        };

        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };
        const isValidUsername = (username) => {
            const invalidCharsRegex = /[.#$[\]]/;
            return !invalidCharsRegex.test(username);
        };

        try {
            if(!name||!username||!password||!confirmPassword||!email){
                let error = {
                    message: "Vui lòng điền đầy đủ thông tin và thử lại"
                };
                Swal.fire(error.message, "", "info");
                this.setState({ error });
            }
            else if (!isValidUsername(username)) {
                let error = {
                    message: `Tên đăng nhập ${username} không được chứa các ký tự: '.', '#', '$', '[', hoặc ']'`
                };
                Swal.fire(error.message, "", "info");
                this.setState({ error });
            }
            else if (!isValidEmail(email)) {
                let error = {
                    message: "Email không hợp lệ, vui lòng thử lại"
                };
                Swal.fire(error.message, "", "info");
                this.setState({ error });
            }
            else if (password != confirmPassword){
                let error = {
                    message: "Mật khẩu xác nhận không giống nhau"
                };
                Swal.fire(error.message, "", "info");
                this.setState({ error });
            }
            else if (!isValidPassword(password)) {
                let error = {
                    // message: "Mật khẩu phải có ít nhất 8 ký tự, chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt"
                    message: "Mật khẩu phải có ít nhất 8 ký tự"
                };
                Swal.fire(error.message, "", "info");
                this.setState({ error });
            } 
            
            else {
                const respondUser = await this.getInfo(UserNamePath); 
                if (respondUser){
                    let error = {
                        message: `Tên đăng nhập: ${username} đã tồn tại, vui lòng dùng tài khoản khác`
                    };
                    Swal.fire(error.message, "", "info");
                    this.setState({ error });
                }
                else {
                    var addUser= await AddDataToFireBaseNoKey(UserNamePath,username)
                    var addPw= await AddDataToFireBaseNoKey(PasswordPath,password)
                    var addName= await AddDataToFireBaseNoKey(NamePath,name)
                    var addEmail= await AddDataToFireBaseNoKey(EmailPath,email)
                    if(!addUser||!addPw||!addEmail||!addName){
                        let error = {
                            message: "Đăng ký thất bại, vui lòng thử lại"
                        };
                        Swal.fire(error.message, "", "info");
                        this.setState({ error });
                    }
                    else{
                        await Swal.fire("Đăng ký thành công. Vui lòng đăng nhập lại để tiếp tục", "", "success");
                        this.setState({ user:true });
                    }

                }
                
            }
            
            } catch (error) {
                console.error('Lỗi đăng ký:', error);
                let errorMessage = {
                    message: 'Lỗi đăng ký: ' + error.message
                };
                Swal.fire(error.message, "", "info");
                this.setState({ error: errorMessage });
            }
    };
    getInfo = async (path)=>{
        // begin getcontentFromFirebase
        try {
            const data = await getContentFromFireBase(path);
            if (data !== null) {
                console.log("data return:", data);
                return data; // Trả về dữ liệu
            }
        } catch (error) {
            console.error("Có lỗi xảy ra:", error);
            throw error; // Ném lỗi để handleSubmit có thể bắt lỗi này
        }
    // end getcontentFromFirebase
    }

    render() {
        let { user, error,showPassword,showConfirmPassword } = this.state;
        return (
            <section className="container-show">
            <div className="login-container">
            {error && <p>{error.message}</p>}
            {/* <img src="https://www.foxlink.com/web/en/wp-content/uploads/2017/02/wlogo_foxlink_b.png" alt="" className="img-fluid header-logo-img" /> */}
                <div className="circle circle-one" />
                <div className="form-container">
                    <Image
                        src={imgPhat}
                        alt="illustration"
                        className="illustration"
                    />
                    <h1 className="opacity">Đăng ký</h1>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" name="name" placeholder="Họ Và Tên" />
                        <input type="text" name="email" placeholder="Email" />
                        <input type="text" name="username" placeholder="Tên đăng nhập" />
                        <div className='input-password'>
                            <input 
                            type={showPassword ? "text" : "password"}
                            name="password" 
                            placeholder="mật khẩu" 
                            /> 
                        
                            <div className={showPassword ? "hide" : "positsionPassword"}
                            onClick={this.togglePasswordVisibility}>
                                <i className="fa-solid fa-eye"/>
                            </div>
                            <div className={showPassword ? "positsionPassword" : "hide"}
                            onClick={this.togglePasswordVisibility}>
                                <i className="fa-regular fa-eye-slash"/>
                            </div>
                        </div>

                        <div className='input-password'>
                            <input 
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword" 
                            placeholder="Xác nhận mật khẩu" 
                            /> 
                        
                            <div className={showConfirmPassword ? "hide" : "positsionPassword"}
                            onClick={this.toggleConfirmPasswordVisibility}>
                                <i className="fa-solid fa-eye"/>
                            </div>
                            <div className={showConfirmPassword ? "positsionPassword" : "hide"}
                            onClick={this.toggleConfirmPasswordVisibility}>
                                <i className="fa-regular fa-eye-slash"/>
                            </div>
                        </div>
                        <button type="submit" className="opacity">Đăng ký</button>
                    </form>
                    <div className="register-forget opacity">
                        <Link href="/login">Đăng nhập</Link>
                    </div>
                </div>
                <div className="circle circle-two" />
            </div>
            <div className="theme-btn-container" />
            <DisplayThemeButtons />
            {/* <audio ref={ref => this.audioRef = ref} src={mp3File} /> */}
        </section>
        );
    }
}

export default Register;