import axios from 'axios';
import { Local_API } from '../Config/Env';

const userApiService = Local_API

class APIServices {
    async getContent() {
        try {
            const serviceData = {
                method: 'GET',
                url: userApiService + '/api/playlist',
            };
            return await axios(serviceData);
        }
        catch (error) {
            return error.response
        }
    }
    async postContent(name, type, url, duration) {
        let paramData = {
            'name': name,
            'type': type,
            'url': url,
            'duration': parseInt(duration)
        }
        try {
            return await axios.post(userApiService + '/api/add', {
                paramData
            });
        }
        catch (error) {
            return error.response
        }
    }

}

export default APIServices;
