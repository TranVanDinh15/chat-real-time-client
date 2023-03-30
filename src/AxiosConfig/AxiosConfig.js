import axios from 'axios';
const axiosInstance = (token) => {
    return axios.create({
        baseURL: process.env.REACT_APP_URL, // địa chỉ của server API
        timeout: 5000, // thời gian tối đa chờ đợi phản hồi từ server
        headers: { Authorization: `Bearer ${token}` }, // kiểu dữ liệu gửi đi
    });
};
export default axiosInstance;
