//const api_path = "judywei";
//const token = "0dQOiXvnFtfFgVHPNAQD9JEbjUw2";
//import axios from "axios";

//將api分為兩種情形，需要&不需要 Token



const userRequest = axios.create({
  baseURL: 'https://livejs-api.hexschool.io/api/livejs/v1/customer/judywei/',
  headers: {
    'Content-Type': 'application/json',
  }
})

const adminRequest = axios.create({
  baseURL: 'https://livejs-api.hexschool.io/api/livejs/v1/admin/judywei/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': "0dQOiXvnFtfFgVHPNAQD9JEbjUw2",
  }
})

export const apiGetProduct = () => userRequest.get('/products');
export const apiGetCartList = () => userRequest.get('/carts');
export const apiPostCartList = data => userRequest.post('/carts', data);
export const apiDeleteCartList = data => userRequest.delete(`/carts/${data}`);
export const apiDeleteAllCartList = () => userRequest.delete('/carts');
export const apiPostOrder = data => userRequest.post('/orders', data);

export const apiGetOrder = () => adminRequest.get('/orders');

export const apiDeleteOrder = data => adminRequest.delete(`/orders/${data}`);

export const apiDeleteAllOrder = () => adminRequest.delete(`/orders`);

export const apiPutOrder = data => adminRequest.put(`/orders/`, data);