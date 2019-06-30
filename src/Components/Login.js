import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { getGoogleLoginApiKey } from '../globalService';
import google from './style/Login.css'
import { Modal, Button, Form, Jumbotron, Container, Image } from 'react-bootstrap';
import { originURL } from '../globalService';

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userDetails: null,
            isAccessibility: true,
            accessibility: '1',
            phone: '',
            birthDay: '',
            isLoading: true
        }

        this.loginSuccess = this.loginSuccess.bind(this);
        this.loginFail = this.loginFail.bind(this);
        this.fetchUserData = this.fetchUserData.bind(this);
        this.setAccessibility = this.setAccessibility.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    fetchUserData() {
        console.log("Entered <Login></Login> fetchUserData()")
        let user = this.state.userDetails;
        console.log(user);
        console.log('for user: ' + user.email);
        const url = `${originURL}user/getAccountDetailsByEmail/${user.email}`;

        axios.post(url, { email: user.email, name: user.name, imageUrl: user.imageUrl })
            .then(response => {
                // NotificationManager.success(`${this.state.projectToAdd.title} has been created successfully`, '', 3000)
                if (response.status === 200) {
                    console.log(`User ${response.data.email} successfully looged in.`);
                    // sessionStorage Can be accessible from any windows and never expires
                    sessionStorage.setItem('userDetails', JSON.stringify(response.data._id));
                    // localStorage Can be accessible from same tab and expires when tab close
                    localStorage.setItem('userDetails', JSON.stringify(response.data._id));

                    if (response.data.accessibility !== null) {
                        this.props.history.push('/home');
                    }
                    else {
                        this.setState({ isAccessibility: false })
                    }
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
        NotificationManager.error('Login failed, try again please.', '', 3000, true);
        console.log(response);
    }

    setAccessibility(code) {
        alert(code);
    }

    handleInputChange(e) {
        e.persist();
        console.log(e);
        e.target.value !== '' &&
            this.setState(
                (prevState) => ({
                    ...prevState,
                    [e.target.name]: e.target.value,
                }), () => {
                    console.log(this.state);
                }
            )
    }

    handleRadioChange(e) {
        e.persist();
        e.target.checked &&
            this.setState(
                (prevState) => ({
                    [e.target.name]: e.target.value
                })
            )
    }

    handleClose() {
        this.setState({
            userDetails: null,
            isAccessibility: true,
            accessibility: false,
            phone: '',
            birthDay: '',
            isLoading: true
        });
    }

    handleSubmit() {
        // const accessibility = !this.state.accessibility ? 0 : 1;
        this.userid = JSON.parse(sessionStorage.getItem('userDetails'));

        const url = `${originURL}user/updateAccountDetails/${this.userid}`;
        axios.put(url, { birthDay: this.state.birthDay, accessibility: this.state.accessibility, phone: this.state.phone })
            .then(response => {
                console.log(response);
                this.props.history.push('/home');
            })
            .catch(error => {
                console.log(error);
            });
    }

    accessibilityModal() {
        return (
            <div>
                <Modal
                    show={!this.state.isAccessibility}
                    onHide={() => { this.setState({ isAccessibility: true }) }}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>One more moment and we're off...</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ display: 'block' }}>
                            <img alt="Profile" src={this.state.userDetails.imageUrl} style={{ height: '34px', width: '34px', borderRadius: '50%', display: 'block', margin: '0 auto' }}></img>
                            <h5 style={{ textAlign: 'center' }}> Hello, {this.state.userDetails.name} </h5>
                        </div>

                        <div style={{ display: 'block', marginTop: '25px' }}>
                            <h6>Please fill out the following fields: </h6>
                            <Form.Group controlId="formBirthDay">
                                <Form.Control required type="text" placeholder="Enter Birthday Date" value={this.state.birthDay} name="birthDay" onChange={this.handleInputChange} />
                            </Form.Group>
                            <Form.Group controlId="formPhoneNumber">
                                <Form.Control required type="tel" placeholder="Enter Phone Number" value={this.state.phone} name="phone" onChange={this.handleInputChange} />
                            </Form.Group>
                            <Form.Group controlId="formAccessibility">
                                <Form.Check custom inline id="formNotDisabled" type="radio" label="Not-Disabled" name="accessibility" checked={this.state.accessibility === '1'} value='1' onChange={this.handleRadioChange} />
                                <Form.Check custom inline id="formDisabled" type="radio" label="Disabled" name="accessibility" checked={this.state.accessibility === '2'} value='2' onChange={this.handleRadioChange} />
                            </Form.Group>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
              </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            I'm Done
              </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

    render() {
        return (
            <div id="root">
                <NotificationContainer />
                {!this.state.isAccessibility && this.accessibilityModal()}
                {/* <!-- Header --> */}
                <div>
                    <header className="masthead">
                        <div className="container d-flex h-100 align-items-center">
                            <div className="mx-auto text-center">
                                <Image src="./images/logo.png" fluid />
                                <h2 className="text-white-50 mx-auto mt-2 mb-5">An alternative navigation system which provides the user with safe directions by vibrations</h2>
                                <GoogleLogin
                                    render={renderProps => (
                                        <button onClick={renderProps.onClick} className="btn btn-primary js-scroll-trigger">Login with <i class="large google icon"></i></button>
                                    )}
                                    clientId={getGoogleLoginApiKey()}
                                    buttonText="Login"
                                    onSuccess={this.loginSuccess}
                                    onFailure={this.loginFail}>
                                </GoogleLogin>
                            </div>
                        </div>
                    </header>
                </div>
                <div>
                    <body>
                        <section id="projects" className="projects-section bg-light">
                            <div className="container">
                                <div className="row align-items-center no-gutters mb-4 mb-lg-5">
                                    <div className="col-xl-8 col-lg-7">
                                        <div className="embed-responsive embed-responsive-16by9">
                                            <iframe className="embed-responsive-item" src="https://drive.google.com/file/d/1G_EbGMAaICLLZlIJCPbYuPqLhEUh45ql/preview" allowfullscreen style={{height: '100%', width: '100%'}}></iframe>
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-lg-5">
                                        <div className="featured-text text-center text-lg-left">
                                            <h4>What are we?</h4>
                                            <p className="text-black-50 mb-0">Our system is design to provide users with navgiation instructions without endangering themselfs while riding on the streets</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section id="signup" class="signup-section">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-10 col-lg-8 mx-auto text-center">
                                        <h2 className="text-white mb-5">Developed By</h2>
                                        </div>
                                    </div>
                                </div>
                        </section>
                        <section className="contact-section bg-black">
                            <div className="container">
                                <div className="row">

                                    <div className="col-md-4 mb-3 mb-md-0">
                                        <div className="card py-4 h-100">
                                            <div className="card-body text-center">
                                                <a href="https://github.com/m0nkeykong" target="_blank"><h4 className="text-uppercase m-0">Haim Elbaz</h4><br></br>
                                                    <img className="rounded-circle" src="https://avatars1.githubusercontent.com/u/27493738?s=460&v=4" alt="profPic" width="90" height="90" /><br></br></a>
                                                <hr className="my-4"/>
                                                <div className="small text-black-50">AKA. Elbazon Ha Hason</div>
                                            </div>
                                            </div>
                                        </div>

                                    <div className="col-md-4 mb-3 mb-md-0">
                                        <div className="card py-4 h-100">
                                            <div className="card-body text-center">
                                                <a href="https://github.com/ronipolisanov" target="_blank"><h4 className="text-uppercase m-0">Roni Polisanov</h4><br></br>
                                                    <img className="rounded-circle" src="https://avatars3.githubusercontent.com/u/32986144?s=400&u=aba2a7d183a15bd4a2c99c4b9a540c5291e1cffa&v=4" alt="profPic" width="90" height="90" /><br></br></a>
                                                <hr className="my-4"/>
                                                <div className="small text-black-50">AKA. The Gever Of The Toar</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4 mb-3 mb-md-0">
                                        <div className="card py-4 h-100">
                                            <div className="card-body text-center">
                                                <a href="https://github.com/reutleib" target="_blank"><h4 className="text-uppercase m-0">Reut Leib</h4><br></br>
                                                <img className="rounded-circle" src="https://avatars2.githubusercontent.com/u/28447221?s=460&v=4" alt="profPic" width="90" height="90" /><br></br></a>
                                                <hr className="my-4"/>
                                                <div className="small text-black-50">AKA. The Tut</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </body>
                </div>
                <div>
                    <footer className="bg-black small text-center text-white-50">
                        <div className="container">
                            © 2019 - The Dept. of Software Engineering, Shenkar: Engineering. Design. Art.
                        </div>
                    </footer>
                    <footer>
                        
                    </footer>
                </div>
            </div>
            )
        }
    }
    
export default Login;