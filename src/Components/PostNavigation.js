import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import './style/ChooseExistingTrack.css'
import './style/PostNavigation.css'
import TiArrowBackOutline from 'react-icons/lib/ti/arrow-back-outline'
import {
    PostAsyncRequest,
    getUpdateTrackTimeURL,
    originURL,
    fetchDataHandleError,
} from '../globalService'
import { Card, Navbar, Nav, Breadcrumb } from 'react-bootstrap'
import { BeatLoader } from 'react-spinners'
import Menu from './Menu'
import './style/TrackDetails.css'
import BLE from './BLE'
import StarRating from 'react-star-ratings'

class PostNavigation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tracks: [],
            userDetails: [],
            addReport: [],
            isRankUpdated: false,
            isLoading: true,
            rating: [],
        }

        this.getUserDetails = this.getUserDetails.bind(this)
        this.rankUpdate = this.rankUpdate.bind(this)

        this.onSubmit = this.onSubmit.bind(this)
        this.onSubmitStars = this.onSubmitStars.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    async componentDidMount() {
        // get user details
        this.userid = JSON.parse(sessionStorage.getItem('userDetails'))

        // Get the user details from database
        await this.getUserDetails()
    }

    // Fetching the user data
    getUserDetails() {
        var self = this
        return new Promise(resolve => {
            self.userid = JSON.parse(sessionStorage.getItem('userDetails'))
            // Get the user details from database
            axios
                .get(`${originURL}user/getAccountDetails/${self.userid}`)
                .then(userResponse => {
                    self.setState({
                        userDetails: userResponse.data,
                        isLoading: false,
                    })
                })
                .catch(error => {
                    fetchDataHandleError(error)
                })
        })
    }

    // Update the user rank after finished the navigation
    rankUpdate() {
        var self = this
        return new Promise(resolve => {
            // Updating the user rank
            axios
                .put(`${originURL}user/rankUpdate/${self.userid}`, {
                    totalDistance: this.state.tracks.totalDistance,
                })
                .then(response => {
                    self.setState({ isRankUpdated: true })
                })
                .catch(error => {
                    fetchDataHandleError(error)
                })
        })
    }

    onSubmitStars(value, name) {
        this.setState({ [name]: value })
    }

    initialState() {
        this.setState(prevState => ({ tracks: [] }))
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    async onSubmit(e) {
        e.preventDefault()
        var idOfTrack = this.props.location.idOfTrack
        // add stars:
        var checkedStar = ''
        if (JSON.stringify(this.state.rating) !== '[]') {
            checkedStar = JSON.stringify(this.state.rating)
        }

        axios
            .put(
                getUpdateTrackTimeURL(
                    idOfTrack,
                    this.state.userDetails.accessibility,
                    this.props.location.actualTime
                )
            )
            .then(res => {
            })
            .catch(error => {
                console.error(error)
            })

        axios
            .put(
                `http://localhost:3000/track/updateDefficultyLevel/${
                    this.props.location.idOfTrack
                }/${checkedStar}`
            )
            .then(res => {})
            .catch(error => {
                console.error(error)
            })

        if (this.state.addReport.length !== 0) {
            let data1 = {
                userId: `${this.state.userDetails._id}`,
                report: `${this.state.addReport}`,
            }
            var reportId = await PostAsyncRequest('reports/insertReport', data1)

            let data2 = {
                trackId: `${this.props.location.idOfTrack}`,
                reportId: `${reportId}`,
            }
            reportId = await PostAsyncRequest('track/addReportToTrack', data2)

            this.initialState()
        }
    }

    getRating() {
        if (this.state.rating.length !== 0) return this.state.rating
        return 0
    }

    render() {
        return (
            <div>
                <div className="postContainer">
                    {/* Show Menu And User Details When Page Stop Loading sessionStorage */}
                    <Menu currentPage={'Post Navigation'}> </Menu>

                    {/* Page BreadCrumbs */}
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Login</Breadcrumb.Item>
                        <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                        <Breadcrumb.Item href="/choose">Choose</Breadcrumb.Item>
                        <Breadcrumb.Item href="">Live</Breadcrumb.Item>
                        <Breadcrumb.Item active>Post</Breadcrumb.Item>
                        <BLE />
                    </Breadcrumb>

                    <form onSubmit={this.onSubmit}>
                        <h6>Vote for Difficulty Level</h6>
                        <StarRating
                            starRatedColor="#F8CE28"
                            starHoverColor="F8CE28"
                            numberOfStars={5}
                            starDimension="26px"
                            step={1}
                            name="rating"
                            rating={this.getRating()}
                            changeRating={this.onSubmitStars}
                        />

                        <div className="row pt-3">
                            <div class="col-10 firstDiv">
                                <h6>
                                    Have you encountered a report <br />
                                    during the track?
                                </h6>
                                <div class="col-12" id="add-report">
                                    <div class="form-group">
                                        <div class="col-12 pt-1">
                                            <textarea
                                                className="form-control textareaSize"
                                                placeholder="Tell us!"
                                                name="addReport"
                                                onChange={this.handleChange}
                                                value={this.state.addReport}
                                                rows="5"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="w-100 mb-md-4" />
                            <div className="col-12 mx-auto">
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default PostNavigation
