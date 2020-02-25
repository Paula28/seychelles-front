import { Component, OnInit } from '@angular/core';
import API from '../services/Api';
import errorHandler from '../helpers/errorHandler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  public formType: string = 'login';
  userLogin = {
    email: '',
    password: '',
  };
  errorLogin = ''
  errorSignUp = ''
  confirmPasswordError = false

  userSignUp = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  ngOnInit(): void {
    this.checkUser();
  }

  checkUser() {
    var tokenObj = JSON.parse(sessionStorage.getItem('token'));
    if (tokenObj && tokenObj.token) {
      var token = tokenObj.token;
      API.get('auth/secure', token)
        .then((res) => {
          const location: any = '/home';
          window.location = location;
        })
        .catch((err) => {
        })
    }

  }

  changeFormType(formType) {
    this.formType = formType;
  }

  login() {
    this.errorLogin = '';
    if (!this.userLogin.email || !this.userLogin.password) {
      this.errorLogin = errorHandler[401];
      return;
    }
    API.post('auth/login', this.userLogin)
      .then((res) => {
        this.setToken(res.token);
      })
      .catch((err) => {
        this.errorLogin = errorHandler[err.status];
      })
  }

  checkUserSignUp() {
    let error = false;
    if (!this.userSignUp.email || !this.userSignUp.firstName || !this.userSignUp.lastName || !this.userSignUp.password || !this.userSignUp.confirmPassword) {
      error = true;
    }
    this.errorSignUp = errorHandler[401];
    return error;
  }
  signUp() {
    this.errorSignUp = '';
    if (!this.checkUserSignUp()) {
      API.post('auth/signup', { user: this.userSignUp })
        .then((res) => {
          this.setToken(res.token);
        })
        .catch((err) => {
          this.errorSignUp = errorHandler[err.status]
        })
    }
  }

  setToken(token) {
    var tokenObj = {
      token
    }
    sessionStorage.setItem('token', JSON.stringify(tokenObj));
    const location: any = '/home';
    window.location = location;
  }

  confirmPasswordHandler($event) {
    const { userSignUp } = this;
    if (userSignUp.password && $event) {
      this.confirmPasswordError = userSignUp.password !== $event;
    } else {
      this.confirmPasswordError = false;
    }
  }

}
