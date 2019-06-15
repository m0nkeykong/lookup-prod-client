import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import './style/ChooseExistingTrack.css'
import './style/PostNavigation.css'
import TiArrowBackOutline from 'react-icons/lib/ti/arrow-back-outline';
import {PostAsyncRequest, getUpdateTrackTimeURL, originURL,fetchDataHandleError} from '../globalService';
import { Card, Navbar, Nav,Breadcrumb } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import Menu from './Menu';
import './style/TrackDetails.css'

class PostNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      userDetails: [],
      addReport: [],
      isRankUpdated: false,
      isLoading: true
    }

    this.getUserDetails = this.getUserDetails.bind(this);
    this.rankUpdate = this.rankUpdate.bind(this);

    this.onSubmit = this.onSubmit.bind(this)
    this.handleChange  = this.handleChange.bind(this)
  }
  
  async componentDidMount(){
    // get user details
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
    console.log(`Entered <PostNavidation> componentDidMount(), fetching userid: ${this.userid}`);

    console.log("ID OF TRACK: ");
    console.log(this.props.location.idOfTrack);

    // Get the user details from database
    await this.getUserDetails();

    // Update user rank
    // await this.rankUpdate();

    // TODO: call route for update RANK
    // TODO: call route for update actual time
    // console.log("REPORT COMPO:");
    // console.log(this.state)

  }

  // Fetching the user data 
  getUserDetails(){
    var self = this;
    return new Promise(resolve => {
      self.userid = JSON.parse(sessionStorage.getItem('userDetails'));
      console.log(`Entered <LiveNavigation> getUserDetails(), fetching userid: ${self.userid}`);
      // Get the user details from database
      axios.get(`${originURL}user/getAccountDetails/${self.userid}`)
        .then(userResponse => {
          self.setState({ userDetails: userResponse.data, isLoading: false });
          console.log(userResponse.data);
          // resolve(self.userid);
        })
        .catch(error => {
          fetchDataHandleError(error);
        });
    });
  }

  // Update the user rank after finished the navigation
  rankUpdate(){
    var self = this;
    return new Promise(resolve => {
      console.log(`Entered <PostNavigation> rankUpdate(), Updating rank for userid: ${self.userid}`);
      // Updating the user rank 
      // @TODO: Get the total distance user navigated
      axios.put(`${originURL}user/rankUpdate/${self.userid}`, {totalDistance: this.state.tracks.totalDistance})
        .then(response => {
          self.setState({ isRankUpdated: true });
          console.log(response.data);
          // resolve(self.userid);
        })
        .catch(error => {
          fetchDataHandleError(error);
        });
    });
  }

  initialState(){
    this.setState(prevState => ({tracks: []}))
  }

  handleChange(event){
    this.setState({ [event.target.name]: event.target.value})
  }

  async onSubmit(e){
    e.preventDefault();
    var idOfTrack = this.props.location.idOfTrack;
    // add stars:
    var checkedStar = "";
    if(this.refs.star1.checked)
      checkedStar = "1";
    if(this.refs.star2.checked)
      checkedStar = "2";
    if(this.refs.star3.checked)
      checkedStar = "3";
    if(this.refs.star4.checked)
      checkedStar = "4";
    if(this.refs.star5.checked)
      checkedStar = "5";

    axios.put(getUpdateTrackTimeURL(idOfTrack,this.state.userDetails.accessibility,this.props.location.actualTime))
    .then(res => {
        console.log("result:");
        console.log(res);
    })
    .catch(error => {
    console.error(error);
    });

    axios.put(`http://localhost:3000/track/updateDefficultyLevel/${this.props.location.idOfTrack}/${checkedStar}`)
    .then(res => {
    })
    .catch(error => {
      console.error(error);
    });

    console.log("USER :");
    console.log(this.state.userDetails._id);
    console.log("REPORT:");
    console.log(this.state.addReport);

    if(this.state.addReport.length !== 0){
        let data1 = {userId:`${this.state.userDetails._id}`, report: `${this.state.addReport}` };
        var reportId = await PostAsyncRequest('reports/insertReport', data1);

        let data2 = {trackId:`${this.props.location.idOfTrack}`, reportId: `${reportId}` };
        reportId = await PostAsyncRequest('track/addReportToTrack', data2);
        
        this.initialState();
    }
  }

  render() {
    console.log("RENDER:");
    console.log(this.state);
    console.log(this.props.location.idOfTrack);

    return (
      <div>
        <div className="postContainer">
          {/* Show Menu And User Details When Page Stop Loading sessionStorage */}
          <Menu currentPage={"Post Navigation"}> </Menu>

          {/* Page BreadCrumbs */}
          <Breadcrumb>
            <Breadcrumb.Item href="/">Login</Breadcrumb.Item>
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/choose">Choose</Breadcrumb.Item>
            <Breadcrumb.Item href="">Live</Breadcrumb.Item>
            <Breadcrumb.Item active>Post</Breadcrumb.Item>
          </Breadcrumb>

          <div className="col-10 p-md-4">
            <NavLink to=
            //navigate to TrackDetails via TemplateComponent with the params
            // TODO: dont forgot to send the id of track 
            {{pathname: `${process.env.PUBLIC_URL}/trackDetails`,
              idOfTrack:this.props.location.idOfTrack}}
                activeStyle={this.active} 
                style={{padding:'6px', verticalAlign:'baseline'}}
                className="tring" >
                <TiArrowBackOutline size={29} color='black'/></NavLink>
            </div>


          <form onSubmit={this.onSubmit}>
          
                <h6>Vote for Difficulty Level</h6>
                <div className="row rating"> 
                    <input className="inputStarts" type="radio" name="stars" id="4_stars" value="4" ref="star5" onChange={this.handleChange} value={this.state.stars} />
                    <label className="stars" for="4_stars">4 stars</label>
                    <input className="inputStarts" type="radio" name="stars" id="3_stars" value="3" ref="star4" onChange={this.handleChange} value={this.state.stars} />
                    <label className="stars" for="3_stars">3 stars</label>
                    <input className="inputStarts" type="radio" name="stars" id="2_stars" value="2" ref="star3" onChange={this.handleChange} value={this.state.stars} />
                    <label className="stars" for="2_stars">2 stars</label>
                    <input className="inputStarts" type="radio" name="stars" id="1_stars" value="1" ref="star2" onChange={this.handleChange} value={this.state.stars} />
                    <label className="stars" for="1_stars">1 star</label>
                    <input className="inputStarts" type="radio" name="stars" id="0_stars" value="0" ref="star1" onChange={this.handleChange} value={this.state.stars} />
                    <label className="stars" for="0_stars">0 star</label>
                </div>

                <div className="row pt-3">     
                    <div class="col-10" style={{ margin:`20px auto`}}> 
                    <h6>Have you encountered a report <br></br>during the track?</h6>
                        <div class="col-12" id="add-report">
                            <div class="form-group">
                                <div class="col-12 pt-1">
                                    <textarea className="form-control textareaSize" placeholder="Tell us!" name="addReport" onChange={this.handleChange}  value={this.state.addReport} rows="5"></textarea>
                                </div>
                            </div>           
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="w-100 mb-md-4"></div>
                    <div className="col-12 mx-auto">
                        <button className='btn btn-primary' type='submit'>
                        Submit
                        </button>
                    </div>
                </div>

            </form>
        </div>
      </div>
    );
  }
}


export default PostNavigation;