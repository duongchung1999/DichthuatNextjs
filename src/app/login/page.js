"use client"
import React, { Component, useEffect } from 'react';
// import './Login.css';
import DisplayThemeButtons from './LoginScript';
import Swal from 'sweetalert2';
import mp3File from '@/assets/mp3/guzheng2.mp3'
import imgPhat from '@/assets/image/phat3.png'
import { getContentFromFireBase } from '@/component/firebase/Firebase';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { redirect } from 'next/navigation'

class Login extends Component {
    state = { 
        user: null, 
        error: null, 
        showPassword: false
    };
    togglePasswordVisibility = () => {
        this.setState(prevState => ({
            showPassword: !prevState.showPassword
        }));
    };
    componentDidMount() {
        let user = localStorage.getItem("user");
        if (user) {
            this.setState({ user: true });
            redirect('/')
        }
        window.addEventListener('click', this.playAudio);
    }
    // componentWillUnmount() {
    //     // Remove the event listener when the component unmounts
    //     window.removeEventListener('click', this.playAudio);
    // }
    componentDidUpdate(){
        if(this.state.user) {
            redirect('/')
        }
    }

    playAudio = () => {
        if (this.audioRef) {
            this.audioRef.play();
            // Remove the event listener after audio starts playing
            window.removeEventListener('click', this.playAudio);
        }
    };
    setWithExpiry(key, value, ttl) {
        const now = new Date()
        const item = {
            value: value,
            expiry: now.getTime() + ttl // thời gian hết hạn
        }
        localStorage.setItem(key, JSON.stringify(item))
    }
    
    // Lấy giá trị từ localStorage
    getWithExpiry(key) {
        const itemStr = localStorage.getItem(key)
        // Nếu không tồn tại, hoặc đã hết hạn, trả về null
        if (!itemStr) {
            return null
        }
        const item = JSON.parse(itemStr)
        const now = new Date()
        // Kiểm tra xem thời gian hết hạn đã đến chưa
        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key)
            return null
        }
        return item.value
    }
    
    handleSubmit = async (event) => {
        event.preventDefault(); 
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        const getUserNamePath = `/users/account/${username}/username`
        const getPasswordPath = `/users/account/${username}/password`
        const getNamePath = `/users/account/${username}/name`
        const getEmailPath = `/users/account/${username}/email`
        const getRolePath = `/users/account/${username}/role`
        const getUserImagePath = `/users/account/${username}/img`

        try {
            
            const respondUser = await this.getInfo(getUserNamePath); 
            const respondPassword = await this.getInfo(getPasswordPath); 
            const resName = await this.getInfo(getNamePath); 
            const resEmail = await this.getInfo(getEmailPath); 
            const role = await this.getInfo(getRolePath);
            const image = await this.getInfo(getUserImagePath);
            if (respondUser) {
                if (respondPassword === password){
                    localStorage.setItem('user',respondUser);
                    localStorage.setItem('name',resName);
                    localStorage.setItem('email',resEmail);
                    if(role) localStorage.setItem('role',role);
                    if(image) localStorage.setItem('userImage',image);
                    // this.setWithExpiry('name', resName, 300 * 60 * 1000)
                    // if(role) this.setWithExpiry('role', role, 300 * 60 * 1000)
                    await Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Đăng nhập thành công",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    
                    this.setState({ user:true });
                }
                else {
                    let error = {
                        message: "Mật khẩu không chính xác, vui lòng thử lại"
                    };
                    Swal.fire({
                        position: "center",
                        icon: "info",
                        title: error.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.setState({ error });
                }


                

                } 
            else {
                let error = {
                    message: "Người dùng không tồn tại"
                };
                Swal.fire({
                    position: "center",
                    icon: "info",
                    title: error.message,
                    showConfirmButton: false,
                    timer: 1500
                });
                this.setState({ error });
                }
            } catch (error) {
                // console.error('Error logging in:', error);
                let errorMessage = {
                    message: 'Lỗi đăng nhập: ' + error.message
                };
                Swal.fire({
                    position: "center",
                    icon: "info",
                    title: error.message,
                    showConfirmButton: false,
                    timer: 1500
                  });
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
        let { user, error,showPassword } = this.state;
        return (
            <section className="container-show">
            <div className="login-container">
            {error && <p>{error.message}</p>}
            {/* <img src={imgRen} alt="" className="img-fluid header-logo-img" /> */}
                <div className="circle circle-one" />
                <div className="form-container">
                    <Image
                        src={imgPhat}
                        alt="illustration"
                        className="illustration"
                    />
                    <h1 className="opacity">Luyện dịch</h1>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <input type="text" name="username" placeholder="Tên đăng nhập" />
                        </div>
                        <div className='input-password'>
                            <input 
                            type={showPassword ? "text" : "password"}
                            name="password" 
                            placeholder="Mật khẩu" 
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
                        
                        
                        <button type="submit" className="opacity">Đăng nhập</button>
                    </form>
                    <div className="register-forget opacity">
                        {/* <a href="">REGISTER</a> */}
                        <Link href="/register">Đăng ký</Link>
                        <a href="">Quên mật khẩu</a>
                    </div>
                </div>
                <div className="circle circle-two" />
            </div>
            <div className="theme-btn-container" />
            <DisplayThemeButtons />
            <audio ref={ref => this.audioRef = ref} src={mp3File} />
        </section>
        );
    }
}

export default Login;