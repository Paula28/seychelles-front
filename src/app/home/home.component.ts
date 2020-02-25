import { Component, OnInit } from '@angular/core';
import API from '../services/Api.js';
import _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  inputValue: string;
  data: any;
  showError: boolean;
  user: any;
  selectedImage = 1;
  interval: any;

  ngOnInit(): void {
    this.checkUser();
    this.setRandomImage();
  }

  setRandomImage() {
    this.interval = setInterval(() => {
      if (this.selectedImage === 3) {
        this.selectedImage = 1;
      } else {
        this.selectedImage++;
      }
    }, 5000);
  }

  checkUser() {
    var tokenObj = JSON.parse(sessionStorage.getItem('token'));
    if (!tokenObj || !tokenObj.token) {
      return this.resetToken();
    }
    var token = tokenObj.token;
    API.get('auth/getUser', token)
      .then((res) => {
        this.user = res.data.user;
        this.callApi()
      })
      .catch((err) => {
        this.resetToken()
      })
  }

  resetToken () {
    sessionStorage.removeItem('token');
    const location: any = '/login';
    window.location = location;
  }

  logOut() {
    this.resetToken()
  }

  callApi() {
    API.get('api')
      .then((res) => {
        const address = _.get(res, 'data.request.query', '');
        const time = _.get(res, 'data.location.localtime', '');
        const temperature = _.get(res, 'data.current.temperature', '')
        this.data = {
          address: `City: ${address}`,
          time: `Time: ${time}`,
          temperature: `Temperature ${temperature} C`
        }
        this.showError = false;
      })
      .catch(() => this.showError = true);
  }
}
