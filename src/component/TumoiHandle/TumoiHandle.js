import React, { Component } from 'react';
import DichthuatFormInput from '@/component/DichthuatFormInput/DichthuatFormInput';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { AddDataToFireBaseNoKey } from '@/component/firebase/Firebase';
import WaitingLoad from '@/component/WaitingLoad/WaitingLoad';
import axios from 'axios';
import To_slug from '@/component/ToSlug/ToSlug';

class TumoiHandle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dichthuat: null,
            error: null,
            nav: false,
            userTuMoiPath: null,
            nghiaList: [{ nghia: '',  vidus: [{ vidu: '', nghiaVidu: ''  ,pinyinVidu: '',}] }],
            loading: false,
            tumoi: '',
            hanviet: '',
        };
    }

    componentDidMount() {
        this.loadLocalData();
    }

    onChangeHandleTuMoi = (event, nameState) => {
        this.setState({
            [nameState]: event.target.value
        });
    }
    
    onChangeHandle = (event, nameState, nghiaIndex, viduIndex) => {
        const newNghiaList = this.state.nghiaList.slice();
        if (viduIndex !== undefined) {
            newNghiaList[nghiaIndex].vidus[viduIndex][nameState] = event.target.value;
        } else {
            newNghiaList[nghiaIndex][nameState] = event.target.value;
        }
        this.setState({
            nghiaList: newNghiaList
        });
    }

    updateTumoi = async () => {
        this.setState({loading: true});
        const { tumoi, tumoiFbPath, userTuMoiPath, nghiaList, hanviet, pinyin } = this.state;
    
        try {
            if (!this.isNhapDayDuText()) {
                return;
            } else {
                await this.updateTumoiAtPath(userTuMoiPath, tumoi, nghiaList, hanviet, pinyin);
                await this.updateTumoiAtPath(tumoiFbPath, tumoi, nghiaList, hanviet, pinyin); // Thêm dòng này để cập nhật lần nữa với tumoiFbPath
    
                Swal.fire("Tạo bài mới thành công", "", "success");
                this.setState({ nav: true });
                this.props.getData();
            }
        } catch (error) {
            console.error('Lỗi tạo từ mới:', error);
            Swal.fire('Lỗi tạo từ mới: ' + error.message, "", "info");
            this.setState({ error: { message: 'Lỗi tạo từ mới: ' + error.message } });
        } finally {
            this.setState({loading: false});
        }
    }
    
    updateTumoiAtPath = async (path, tumoi, nghiaList, hanviet, pinyin) => {
        try {
            if (hanviet) {
                const hanvietPath = `${path}/${tumoi}/hanviet`;
                const pinyinPath = `${path}/${tumoi}/pinyin`;
                await AddDataToFireBaseNoKey(hanvietPath, hanviet);
                if (pinyin) {
                    await AddDataToFireBaseNoKey(pinyinPath, pinyin);
                }
            }
            for (let i = 0; i < nghiaList.length; i++) {
                const nghiaItem = nghiaList[i];
                const pinyinPath = `${path}/${tumoi}/nghia/${To_slug(nghiaItem.nghia)}/pinyin`;
                const nghiaPath = `${path}/${tumoi}/nghia/${To_slug(nghiaItem.nghia)}/nghia`;
    
                console.log(pinyinPath);
    
                await AddDataToFireBaseNoKey(nghiaPath, nghiaItem.nghia);
    
                for (let j = 0; j < nghiaItem.vidus.length; j++) {
                    const viduItem = nghiaItem.vidus[j];
                    const nghiaviduPath = `${path}/${tumoi}/nghia/${To_slug(nghiaItem.nghia)}/vidu/${To_slug(viduItem.vidu)}/nghia`;
                    const pinyinViduPath = `${path}/${tumoi}/nghia/${To_slug(nghiaItem.nghia)}/vidu/${To_slug(viduItem.vidu)}/pinyin`;
                    const viduPath = `${path}/${tumoi}/nghia/${To_slug(nghiaItem.nghia)}/vidu/${To_slug(viduItem.vidu)}/vidu`;
                    console.log(viduPath);
                    console.log(pinyinViduPath);
                    await AddDataToFireBaseNoKey(nghiaviduPath, viduItem.nghiaVidu);
                    await AddDataToFireBaseNoKey(pinyinViduPath, viduItem.pinyinVidu);
                    await AddDataToFireBaseNoKey(viduPath, viduItem.vidu);
                }
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật từ mới tại đường dẫn:', path, error);
            throw error;
        }
    }

    loadLocalData = () => {
        const dichthuat = localStorage.getItem("dichthuat");
        const tenbaihoc = localStorage.getItem("video");
        const user = localStorage.getItem("user");
        const tenBaihocPath = `/users/dichthuat/${dichthuat}/listBaihoc/${tenbaihoc}`;
        const tumoiFbPath =  `/users/tumoi/personal/${user}`;
        const userTuMoiPath = `${tenBaihocPath}/${user}/tumoi`;
        this.setState({ userTuMoiPath,tumoiFbPath });
    }

    isNhapDayDuText = () => {
        const { tumoi, nghiaList } = this.state;
        for (let i = 0; i < nghiaList.length; i++) {
            const nghiaItem = nghiaList[i];
            if (!tumoi || !nghiaItem.nghia ) {
                Swal.fire("Vui lòng điền đầy đủ thông tin và thử lại", "", "info");
                this.setState({ error: { message: "Vui lòng điền đầy đủ thông tin và thử lại" } });
                return false;
            } 

            for (let j = 0; j < nghiaItem.vidus.length; j++) {
                const viduItem = nghiaItem.vidus[j];
                if (!viduItem.vidu || !viduItem.nghiaVidu) {
                    Swal.fire("Vui lòng điền đầy đủ thông tin và thử lại", "", "info");
                    this.setState({ error: { message: "Vui lòng điền đầy đủ thông tin và thử lại" } });
                    return false;
                } else if (!this.isValidDichThuat(viduItem.vidu)) {
                    Swal.fire(`Ví dụ không được chứa các ký tự: . # $ [ ]`, "", "info");
                    this.setState({ error: { message: `Ví dụ không được chứa các ký tự: . # $ [ ]` } });
                    return false;
                }
            }
        }
        return true;
    }

    isValidDichThuat = (dichthuat) => {
        const invalidCharsRegex = /[.#$[\]]/;
        return !invalidCharsRegex.test(dichthuat);
    }

    addNghia = () => {
        this.setState((prevState) => ({
            nghiaList: [...prevState.nghiaList, { nghia: '', pinyin: '', vidus: [{ vidu: '', nghiaVidu: '', pinyinVidu: ''  }] }]
        }));
    }

    removeNghia = (index) => {
        this.setState((prevState) => {
            const newNghiaList = prevState.nghiaList.slice();
            newNghiaList.splice(index, 1);
            return { nghiaList: newNghiaList };
        });
    }

    addVidu = (nghiaIndex) => {
        const newNghiaList = this.state.nghiaList.slice();
        newNghiaList[nghiaIndex].vidus.push({ vidu: '', nghiaVidu: '', pinyinVidu: ''  });
        this.setState({
            nghiaList: newNghiaList
        });
    }

    removeLastVidu = (nghiaIndex) => {
        const newNghiaList = this.state.nghiaList.slice();
        if (newNghiaList[nghiaIndex].vidus.length > 1) {
            newNghiaList[nghiaIndex].vidus.pop();
        }
        this.setState({
            nghiaList: newNghiaList
        });
    }
    removeVidu = (nghiaIndex, viduIndex) => {
        const newNghiaList = this.state.nghiaList.slice();
        newNghiaList[nghiaIndex].vidus.splice(viduIndex, 1);
        this.setState({
            nghiaList: newNghiaList
        });
    }

    Search = async () => {
        const { tumoi } = this.state;
        const encodedChar = encodeURIComponent(tumoi);
    
        try {
            this.setState({ loading: true });
            const response = await axios.get(`https://api.hanzii.net/api/search/vi/${encodedChar}?type=word&page=1&limit=50`);
            if (response.data.found) {
                const resultContent = response.data.result[0].content;
                console.log(response.data.result)
                let nghiaDataList = [];
    
                // Lặp qua tất cả các phần tử trong content để thu thập means
                resultContent.forEach(contentItem => {
                    nghiaDataList = nghiaDataList.concat(contentItem.means);
                });
    
                const hanviet = response.data.result[0].cn_vi;
                const pinyin = response.data.result[0].pinyin;
    
                const nghiaList = nghiaDataList.map(nghiaData => ({
                    nghia: nghiaData.mean,
                    vidus: nghiaData.examples.map(example => ({
                        vidu: example.e,
                        pinyinVidu: example.p,
                        nghiaVidu: example.m
                    }))
                }));
    
                this.setState({ nghiaList, hanviet, pinyin });
            }
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error);
            Swal.fire('Lỗi khi tìm kiếm: ' + error.message, "", "info");
            this.setState({ error: { message: 'Lỗi khi tìm kiếm: ' + error.message } });
        } finally {
            this.setState({ loading: false });
        }
    }
    
    

    render() {
        return (
            <div className='col-12 col-md-6 col-lg-6 col-xxl-2 gy-6 gx-2'>
                {this.state.error && (
                    <div className='dichthuat-showError'>
                        Lỗi: "{this.state.error.message}"
                    </div>
                )}
                <Button variant="info" onClick={this.updateTumoi}>
                    Tạo từ mới
                </Button>
                <Button variant="danger" onClick={this.Search}>
                    Search
                </Button>
                <DichthuatFormInput
                    title="Từ mới"
                    name="tumoi"
                    placeHolder="Nhập từ mới"
                    value={this.state.tumoi}
                    onChangeHandle={(event) => this.onChangeHandleTuMoi(event, "tumoi")}
                />
                <DichthuatFormInput
                    title="Âm Hán Việt"
                    name="hanviet"
                    placeHolder="Nhập âm Hán Việt"
                    value={this.state.hanviet}
                    onChangeHandle={(event) => this.onChangeHandleTuMoi(event, "hanviet")}
                />
                <DichthuatFormInput
                                title={"Pinyin"}
                                name="pinyin"
                                placeHolder="Nhập pinyin"
                                value={this.state.pinyin}
                                onChangeHandle={(event) => this.onChangeHandleTuMoi(event, "pinyin")}
                            />
                {this.state.nghiaList.map((nghiaItem, nghiaIndex) => (
                    <div className="nghiaCuaTu card border-primary" key={nghiaIndex}>
                        <div className="card-body">
                            <DichthuatFormInput
                                title={`Nghĩa ${nghiaIndex + 1}`}
                                name="nghia"
                                placeHolder="Nhập nghĩa của từ"
                                value={nghiaItem.nghia}
                                onChangeHandle={(event) => this.onChangeHandle(event, "nghia", nghiaIndex)}
                            />
                            
                            {nghiaItem.vidus.map((viduItem, viduIndex) => (
                                <div className="viduCuaTu card border-primary" key={viduIndex}>
                                    <div className="card-body">
                                        <DichthuatFormInput
                                            title={`Ví dụ ${viduIndex + 1}`}
                                            name="vidu"
                                            placeHolder="Nhập Ví dụ"
                                            value={viduItem.vidu}
                                            onChangeHandle={(event) => this.onChangeHandle(event, "vidu", nghiaIndex, viduIndex)}
                                        />
                                        <DichthuatFormInput
                                            title={`Ý nghĩa ví dụ ${viduIndex + 1}`}
                                            name="nghiaVidu"
                                            placeHolder="Nhập nghĩa của ví dụ"
                                            value={viduItem.nghiaVidu}
                                            onChangeHandle={(event) => this.onChangeHandle(event, "nghiaVidu", nghiaIndex, viduIndex)}
                                        />
                                        <DichthuatFormInput
                                            title={`pinyin ví dụ ${viduIndex + 1}`}
                                            name="pinyinVidu"
                                            placeHolder="Nhập nghĩa của ví dụ"
                                            value={viduItem.pinyinVidu}
                                            onChangeHandle={(event) => this.onChangeHandle(event, "pinyinVidu", nghiaIndex, viduIndex)}
                                        />
                                        <Button variant="warning" onClick={() => this.removeVidu(nghiaIndex, viduIndex)}>
                                        Xóa ví dụ này
                                    </Button>
                                    </div>
                                </div>
                            ))}
                            <Button variant="info" onClick={() => this.addVidu(nghiaIndex)}>
                                Thêm ví dụ khác
                            </Button>
                            {/* <Button variant="warning" onClick={() => this.removeLastVidu(nghiaIndex)}>
                                Xóa ví dụ cuối
                            </Button> */}
                        </div>
                        <Button variant="danger" onClick={() => this.removeNghia(nghiaIndex)}>
                            Xóa nghĩa
                        </Button>
                    </div>
                ))}
                <Button variant="info" onClick={this.addNghia} style={{width:'100%'}}>
                    Thêm nghĩa khác
                </Button>

                {this.state.loading ? (
                    <WaitingLoad />
                ) : null}
            </div>
        );
    }
}

export default TumoiHandle;
