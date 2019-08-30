import React, { Component } from 'react'
import '../style/ChooseExistingTrack.css'
import '../style/general.css'
import IoAndroidBicycle from 'react-icons/lib/io/android-bicycle'
import MdDirectionsWalk from 'react-icons/lib/md/directions-walk'
import {
    getAllTracksURL,
    getTracksByCityURL,
    getPointURL,
    getGoogleApiKey,
} from '../../globalService'
import { NavLink } from 'react-router-dom'
import { Card, Breadcrumb } from 'react-bootstrap'
import { BeatLoader } from 'react-spinners'
import Menu from './../Menu'
import axios from 'axios'
import FavoriteButton from './../FavoriteButton'
import { Icon, Label, Button } from 'semantic-ui-react'
import { Card as Cardi } from 'semantic-ui-react'
import { StaticGoogleMap, Marker, Path } from 'react-static-google-map'
import StarRating from 'react-star-ratings'
import BLE from './../BLE'

class ChooseExistingTrack extends Component {
    constructor(props) {
        super(props)
        this.state = {
            from: [],
            to: [],
            tracks: [],
            startPoint: [],
            endPoint: [],
            wayPoints: [],
            userDetails: [],
            travelMode: '',
            rating: [],
        }

        this.addTracks = this.addTracks.bind(this)
        this.viewTracks = this.viewTracks.bind(this)
        this.updateTracks = this.updateTracks.bind(this)
        this.getAllTracks = this.getAllTracks.bind(this)
        this.getReports = this.getReports.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getTimeOfTrack = this.getTimeOfTrack.bind(this)
        this.onSubmitStars = this.onSubmitStars.bind(this)
    }

    onSubmit(e) {
        // e.preventDefault();
        e.preventDefault()
        var checkedTravelMode = this.refs.bicycling.checked
            ? 'Bicycling'
            : 'Walking'

        var checkedStar = 'NO'
        if (JSON.stringify(this.state.rating) !== '[]') {
            checkedStar = JSON.stringify(this.state.rating)
        }

        fetch(
            getTracksByCityURL(
                this.state.from,
                this.state.to,
                checkedTravelMode,
                checkedStar,
                this.state.userDetails.accessibility
            )
        )
            .then(res => {
                return res.json()
            })
            .then(data => {
                var self = this
                this.setState({ tracks: [] })
                if (data.length === 0) {
                    self.addTracks('', '', '', '', '', '', '', '')
                } else if (data.message === 'No tracks found') {
                    self.addTracks('', '', '', '', '', '', '', '')
                } else if (data.message === 'This page was not found')
                    self.addTracks('', '', '', '', '', '', '', '')
                else {
                    data.map(json => {
                        let jsonParse = json[0]
                        self.addTracks(
                            jsonParse._id,
                            jsonParse.title,
                            jsonParse.travelMode,
                            jsonParse.reports,
                            jsonParse.description,
                            json[1],
                            json[2],
                            '',
                            jsonParse.difficultyLevel.star,
                            jsonParse.disabledTime,
                            jsonParse.nonDisabledTime
                        )
                    })
                }
            })
        this.setState({ rating: [] })
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmitStars(value, name) {
        this.setState({ [name]: value })
    }

    addTracks(
        _id,
        _title,
        _type,
        _reports,
        _description,
        _startPoint,
        _endPoint,
        _wayPoints,
        _difficultyLevel,
        _disabledTime,
        _nonDisabledTime
    ) {
        this.setState(prevState => ({
            tracks: [
                ...prevState.tracks,
                {
                    id: this.state.tracks.length + 1,
                    idOfTrack: _id,
                    title: _title,
                    travelMode: _type,
                    reports: _reports,
                    description: _description,
                    startPoint: _startPoint,
                    endPoint: _endPoint,
                    wayPoints: _wayPoints,
                    difficultyLevel: _difficultyLevel,
                    disabledTime: _disabledTime,
                    nonDisabledTime: _nonDisabledTime,
                },
            ],
        }))
    }

    updateTracks(newTrack, i) {
        this.setState(() => ({
            tracks: this.state.tracks.map(trck =>
                trck.id !== i ? trck : { ...trck, name: newTrack }
            ),
        }))
    }

    getReports(reports) {
        let html = []
        // Outer loop to create parent
        for (let i = 0; i < reports.length; i++) {
            html.push(<p> &#8227; &#9;{reports[i]}</p>)
        }
        return html
    }

    getIconType(type) {
        if (type === 'WALKING')
            return <MdDirectionsWalk size={20} color="black" />
        else return <IoAndroidBicycle size={20} color="black" />
    }

    getPointsById(point) {
        fetch(getPointURL(point))
            .then(res => {
                return res.json()
            })
            .then(data => {
                this.setState({ startPoint: data })
            })
    }

    getStarsForDifficultyLevel(diffLever) {
        let html = []
        let diffNumber = Math.round(diffLever)
        let limitOfStars = 5

        for (let i = 0; i < limitOfStars; i++) {
            if (i < diffNumber)
                html.push(
                    <span
                        key={'spen1' + i}
                        className="fa fa-star colorStarOrange"
                    />
                )
            else html.push(<span key={'spen2' + i} className="fa fa-star" />)
        }
        return html
    }

    getStarsForAccesability() {
        let html = []

        for (let i = 0; i < 3; i++)
            html.push(
                <span
                    key={'spen3' + i}
                    className="fa fa-star colorStarOrange starAccesability"
                />
            )
        for (let i = 0; i < 2; i++)
            html.push(
                <span
                    key={'spen4' + i}
                    className="fa fa-star colorStarGrey starAccesability"
                />
            )

        return html
    }

    getTimeOfTrack(disabledTime, nonDisabledTime) {
        let html = []
        let num

        // if user is nonDisabledTime
        if (this.state.userDetails.accessibility === 0)
            num = nonDisabledTime.actual
        else num = disabledTime.actual

        var hours = num / 60
        var rhours = Math.floor(hours)
        var minutes = (hours - rhours) * 60
        var rminutes = Math.round(minutes)

        html.push(
            <span key={'uniqKey'} className="">
                {rhours}:{rminutes}
            </span>
        )
        return html
    }

    trackRecord(track) {
        let location = []
        location.push({
            lat: track.startPoint.lat.toString(),
            lng: track.startPoint.lng.toString(),
        })
        location.push({
            lat: track.endPoint.lat.toString(),
            lng: track.endPoint.lng.toString(),
        })
        return location
    }

    viewTracks(track, i) {
        if (track.title === '') {
            return (
                <div key={'viewTracks'}>
                    <h3 className="textCenter">
                        {' '}
                        There are no tracks to display
                    </h3>
                </div>
            )
        } else if (
            (this.state.userDetails.rank < 2) &
            (track.difficultyLevel === 5)
        ) {
            return <div />
        } else {
            return (
                <div
                    key={'container' + i}
                    className="margin"
                    style={{ margin: `20px auto` }}
                >
                    <Cardi style={{ margin: '0 auto', padding: '5px' }}>
                        <StaticGoogleMap
                            maptype="roadmap"
                            apiKey={getGoogleApiKey()}
                            size="340x240"
                            language="en"
                        >
                            <Marker
                                size="mid"
                                location={{
                                    lat: track.startPoint.lat.toString(),
                                    lng: track.startPoint.lng.toString(),
                                }}
                                color="green"
                                label="A"
                            />

                            <Marker
                                size="mid"
                                location={{
                                    lat: track.endPoint.lat.toString(),
                                    lng: track.endPoint.lng.toString(),
                                }}
                                color="red"
                                label="B"
                            />
                            <Path points={[this.trackRecord(track)]} />
                        </StaticGoogleMap>

                        <Cardi.Content>
                            <Cardi.Header>
                                {track.title.toString()}
                            </Cardi.Header>
                            <Cardi.Meta>
                                <div>
                                    {this.getStarsForDifficultyLevel(
                                        track.difficultyLevel
                                    )}
                                    <span
                                        className="date"
                                        style={{ float: 'right' }}
                                    >
                                        {track.travelMode.toString() ===
                                        'WALKING' ? (
                                            <Icon
                                                title="Walking"
                                                name="male"
                                                color="blue"
                                                size="large"
                                            />
                                        ) : (
                                            <Icon
                                                name="bicycle"
                                                color="blue"
                                                size="large"
                                            />
                                        )}
                                    </span>
                                </div>
                            </Cardi.Meta>

                            <Cardi.Description>
                                <Label.Group>
                                    <Label
                                        style={{ width: '55px' }}
                                        size="large"
                                        color="teal"
                                    >
                                        From
                                    </Label>
                                    <Label size="large">
                                        {' '}
                                        {` ${
                                            track.startPoint.street
                                                ? track.startPoint.street + ', '
                                                : ''
                                        } ${
                                            track.startPoint.city
                                                ? track.startPoint.city + ''
                                                : ''
                                        }`}{' '}
                                    </Label>
                                </Label.Group>
                                <Label.Group>
                                    <Label
                                        style={{ width: '55px' }}
                                        size="large"
                                        color="teal"
                                    >
                                        To
                                    </Label>
                                    <Label size="large">
                                        {' '}
                                        {` ${
                                            track.endPoint.street
                                                ? track.endPoint.street + ', '
                                                : ''
                                        } ${
                                            track.endPoint.city
                                                ? track.endPoint.city + ''
                                                : ''
                                        }`}{' '}
                                    </Label>
                                </Label.Group>
                                <Label.Group>
                                    <Label size="large" color="teal">
                                        Duration
                                    </Label>
                                    <Label size="large">
                                        {' '}
                                        {this.state.userDetails
                                            .accessibility === 1
                                            ? track.nonDisabledTime.actual.toString() +
                                              ' minutes'
                                            : track.disabledTime.actual.toString() +
                                              ' minutes'}{' '}
                                    </Label>
                                </Label.Group>
                                <Label.Group>
                                    <Label size="large" color="grey">
                                        Description
                                    </Label>
                                    <Label size="large">
                                        {' '}
                                        {track.description.toString()}{' '}
                                    </Label>
                                </Label.Group>
                                <FavoriteButton trackid={track.idOfTrack} />
                            </Cardi.Description>
                        </Cardi.Content>
                        <Cardi.Content extra />

                        <NavLink
                            to=//navigate to TrackDetails via TemplateComponent with the params
                            {{
                                pathname: `${
                                    process.env.PUBLIC_URL
                                }/trackDetails`,
                                idOfTrack: track.idOfTrack,
                            }}
                            activeStyle={this.active}
                            className=""
                        >
                            <Button primary style={{ width: '100%' }}>
                                Live Navigation
                            </Button>
                        </NavLink>
                    </Cardi>
                </div>
            )
        }
    }

    getAllTracks() {
        fetch(getAllTracksURL())
            .then(res => {
                return res.json()
            })
            .then(data => {
                var self = this
                data.map(json => {
                    self.addTracks(
                        json.track._id,
                        json.track.title,
                        json.track.type,
                        json.track.reports,
                        json.track.description,
                        json.startPoint,
                        json.endPoint,
                        json.wayPoints,
                        json.track.difficultyLevel.star
                    )
                }) // endOf data.map((data)
            })
    }

    componentDidMount() {
        // user session
        this.userid = JSON.parse(sessionStorage.getItem('userDetails'))

        // Get the user details from database
        axios
            .get(`http://localhost:3000/user/getAccountDetails/${this.userid}`)
            .then(userResponse => {
                this.setState({
                    userDetails: userResponse.data,
                    loading: false,
                })
            })
            .catch(error => {
                console.error(error)
            })
    }

    handleChange(event) {
        this.setState({ [event.target.name]: [] })
        this.setState({ [event.target.name]: event.target.value })
    }

    getRating() {
        if (this.state.rating.length !== 0) return this.state.rating
        return 0
    }

    render() {
        return (
            <div>
                <Card>
                    {/* Show Menu And User Details When Page Stop Loading sessionStorage */}
                    <Menu currentPage={'Choose Existing'}> </Menu>

                    {/* Page BreadCrumbs */}
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Login</Breadcrumb.Item>
                        <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                        <Breadcrumb.Item active>Choose</Breadcrumb.Item>
                        <BLE />
                    </Breadcrumb>

                    <Card.Body className="text-center">
                        <Card.Title>
                            <h6> Choose Origin and Destination </h6>
                        </Card.Title>

                        <form onSubmit={this.onSubmit}>
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <div className="rowForm">
                                            <input
                                                required
                                                placeholder="Origin"
                                                className="mt-2 form-control float-left"
                                                type="text"
                                                name="from"
                                                onChange={this.handleChange}
                                                value={this.state.from}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <div className="rowForm">
                                            <input
                                                required
                                                placeholder="Destination"
                                                className="mt-2 form-control float-left"
                                                type="text"
                                                name="to"
                                                onChange={this.handleChange}
                                                value={this.state.to}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-wrap justify-content-md-center text-center">
                                <div className="form-group custom-control custom-radio mr-4 justify-content-md-center text-center">
                                    <input
                                        className="marginInherit radioTravelMode"
                                        type="radio"
                                        ref="walking"
                                        name="type"
                                        id="walking"
                                        autoComplete="off"
                                        onChange={this.handleChange}
                                        value={this.state.walking}
                                        required
                                    />
                                    <label className="">Walking</label>
                                </div>
                                <div className="form-group custom-control custom-radio mr-4 justify-content-md-center radioTravelMode text-center">
                                    <input
                                        className="marginInherit radioTravelMode"
                                        type="radio"
                                        ref="bicycling"
                                        name="type"
                                        id="bicycling"
                                        autoComplete="off"
                                        onChange={this.handleChange}
                                        value={this.state.bicycling}
                                    />
                                    <label className="">Bicycling</label>
                                </div>
                            </div>

                            {this.state.userDetails.accessibility === '2' ? (
                                <div className="container">
                                    <h6>Choose Difficulty Level</h6>
                                    <p className="starCenter">
                                        {this.getStarsForAccesability()}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <h6>Choose Difficulty Level</h6>
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
                                </div>
                            )}

                            <div className="row">
                                <div className="w-100 mb-md-4" />
                                <div className="col-12 mx-auto">
                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                    >
                                        Search Now
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Card.Body>

                    <Card.Header />

                    <div className="w-100 mb-md-4 pt-3" />
                    <div className="col-12 mx-auto">
                        {this.state.tracks.map(this.viewTracks)}
                    </div>

                    <Card.Body style={{ textAlign: 'center' }}>
                        {this.state.loading ? (
                            <div className="col-12 mx-auto">
                                {this.state.tracks.map(this.viewTracks)}
                            </div>
                        ) : (
                            <div className="sweet-loading">
                                {' '}
                                <BeatLoader color={'#123abc'} />{' '}
                            </div>
                        )}
                    </Card.Body>
                    <Card.Footer id="locationUpdate" className="text-muted" />
                </Card>
            </div>
        )
    }
}

export default ChooseExistingTrack
