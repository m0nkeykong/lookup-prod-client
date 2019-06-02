import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import {getGoogleLoginApiKey} from '../globalService';
import google from './style/Login.css'

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
        console.log("Entered <Login></Login> fetchUserData()")
        let user = this.state.userDetails;
        console.log(user);
        console.log('for user: ' + user.email);
        const url = `http://localhost:3000/user/getAccountDetailsByEmail/${user.email}`;

        axios.post(url, {email: user.email, name: user.name, imageUrl: user.imageUrl})
        .then(response => {
            // NotificationManager.success(`${this.state.projectToAdd.title} has been created successfully`, '', 3000)
            if(response.status === 200){
                console.log(`User ${response.data.email} successfully looged in.`);
                // console.log(response);
                // sessionStorage Can be accessible from any windows and never expires
                sessionStorage.setItem('userDetails', JSON.stringify(response.data._id));
                // localStorage Can be accessible from same tab and expires when tab close
                localStorage.setItem('userDetails', JSON.stringify(response.data._id));
                this.props.history.push('/auto');
            }
        })
        .catch(error => {
            console.log(error);
        });

        return;
    }

    loginSuccess(response) {
        console.log("Entered <Login></Login> loginSuccess()")
        this.setState({ userDetails: response.profileObj })
        this.fetchUserData();
    }

    loginFail(response) {
        console.log('Entered <Login></Login> loginFail()');
        NotificationManager.error('Login failed, try again please.', '', 3000);
        console.log(response);
    }

    render() {
        return (
            <div >
            <NotificationContainer />
                <div style={{ backgroundImage: `url(./images/logo.PNG)`, backgroundSize: 'cover', margin: '0 auto', width: '382px', height: '133px', marginTop: '130px' }}>
                </div>
                <p style={{ marginTop: '50px' }}></p>
                <div className="d-flex justify-content-center">
                    <GoogleLogin
                        render={renderProps => (
                            <button onClick={renderProps.onClick} className="loginBtn loginBtn--google">
                                Login with Google
                            </button>
                        )}
                        clientId={getGoogleLoginApiKey()}
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