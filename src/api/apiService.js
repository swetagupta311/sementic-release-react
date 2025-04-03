import axios from "axios";

const api=axios.create({
       baseURL:"https://pmi.wizsuite.com/api/v1"
})

api.interceptors.request.use((config) => {   

    const token = localStorage.getItem('token'); 
    const excludeEndpoints = ['/auth/signin', '/signup', '/forgotpassword','/resetPassword'];
      
    if (token && !excludeEndpoints.includes(config.url)) {
        config.headers.Authorization = `Bearer ${token}`;
    }
        return config;

}, (error) => {
    return Promise.reject(error);
});


export default api;