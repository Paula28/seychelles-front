import request from 'superagent';

export const API_URL = 'http://localhost:5000/';

const API = {
    get: (url, token) => request.get(`${API_URL}${url}`)
                .set('Authorization', `Bearer ${token}`)
                .then(res => res.body, err => Promise.reject(err)),
    post: (url, body = {}, opts = {}, token) => {
        const { passFullRes = false } = opts;
        return request.post(`${API_URL}${url}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(body)
            .then(res => (passFullRes ? res : res.body), err => Promise.reject(err));
    },
    put: (url, body = {}, token) => request.put(`${API_URL}${url}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(body)
        .then(res => res.body, err => Promise.reject(err)),
    patch: (url, body = {}, token) => request.patch(`${API_URL}${url}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(body)
        .then(res => res.body, err => Promise.reject(err)),
    delete: (url, token) => request.delete(`${API_URL}${url}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .then(res => res.body, err => Promise.reject(err)),
};

export function getAuthorizationHeader() {
    return `Bearer ${getToken()}`;
}

export function getToken() {
    return 'sth';
}

export default { ...API, getToken };
