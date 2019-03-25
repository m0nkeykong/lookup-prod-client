import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import google from './style/Login.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { BeatLoader } from 'react-spinners'; 

class Login extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            userDetails: null
        }

        this.loginSuccess = this.loginSuccess.bind(this);
        this.loginFail = this.loginFail.bind(this);
        this.fetchUserData = this.fetchUserData.bind(this);
    }
    
    fetchUserData() {
        // console.log('Fetching Docs', param);
        let user = JSON.parse(sessionStorage.getItem('userDetails'));
        console.log(user);
        console.log('for user: ' + user.email);
        const url = `http://localhost:3000/user/getAccountDetailsByEmail/${user.email}`;

        axios.post(url, {email: user.email, name: user.name, imageUrl: user.imageUrl})
        .then(response => {
            // NotificationManager.success(`${this.state.projectToAdd.title} has been created successfully`, '', 3000)
            console.log(`User ${response.data.email} successfully looged in.`);
            console.log(response);
            sessionStorage.setItem('userDetails', JSON.stringify(response));
            this.props.history.push('/homePage');
        })
        .catch(error => {
            console.log(error);
        });

        return;
    }

    loginSuccess(response) {
        console.log("Entered onSuccess={this.loginSuccess}")
        this.setState({ userDetails: response })
        sessionStorage.setItem('userDetails', JSON.stringify(this.state.userDetails.profileObj));

        this.fetchUserData();
    }

    loginFail(response) {
        NotificationManager.error('Login failed, try again please.', '', 3000);
        console.log('Entered onFailure={this.loginFail}, Failed to connect');
        console.log(response);
    }

    render() {
        return (
            <div >
            <NotificationContainer />
                <div style={{ backgroundImage: `url(./images/logo.PNG)`, backgroundSize: 'cover', margin: '0 auto', width: '382px', height: '133px', marginTop: '130px' }}>
                </div><p style={{ marginTop: '50px' }}></p>
                <div className="d-flex justify-content-center">
                    <GoogleLogin
                        render={renderProps => (
                            <button onClick={renderProps.onClick} className="loginBtn loginBtn--google">
                                Login with Google
                            </button>
                        )}
                        clientId={'442866448380-58htb784uls8qdsqafp75klhbe5g20m4.apps.googleusercontent.com'}
                        buttonText="Login"
                        onSuccess={this.loginSuccess}
                        onFailure={this.loginFail}>
                    </GoogleLogin>
                </div>
            </div>
        )
    }
}

export default Login;