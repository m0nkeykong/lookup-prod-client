import React, { Component } from 'react'
import axios from 'axios'
import { fetchDataHandleError, originURL } from '../globalService'
import { Button } from 'semantic-ui-react'
import { NotificationContainer, NotificationManager } from 'react-notifications'
import 'react-notifications/lib/notifications.css'
import './style/FavoriteButton.css'

const _ = require('lodash')

class FavoriteButton extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            trackid: this.props.trackid,
            userDetails: [],
            isFavorite: null,
        }

        this.getUserDetails = this.getUserDetails.bind(this)
        this.favoriteToggle = this.favoriteToggle.bind(this)
        this.getFavoriteStatus = this.getFavoriteStatus.bind(this)
        this.fetchData = this.fetchData.bind(this)
    }

    // Fetch the updated user data from db
    getUserDetails() {
        var self = this
        return new Promise(resolve => {
            self.userid = JSON.parse(sessionStorage.getItem('userDetails'))
            // Get the user details from database
            axios
                .get(`${originURL}user/getAccountDetails/${self.userid}`)
                .then(userResponse => {
                    self.setState({ userDetails: userResponse.data })
                    console.log(userResponse.data)
                    resolve(userResponse.data)
                })
                .catch(error => {
                    this.setState({ isLoading: true })
                    console.error(error)
                })
        })
    }

    getFavoriteStatus(trackid) {
        var self = this
        return new Promise(resolve => {
            self.userid = JSON.parse(sessionStorage.getItem('userDetails'))
            // Get the user details from database
            axios
                .get(`${originURL}user/isFavorite/${self.userid}/${trackid}`)
                .then(isFavorite => {
                    self.setState({
                        isFavorite: isFavorite.data.isFavorite,
                        isLoading: false,
                    })
                    resolve(isFavorite.data)
                })
                .catch(error => {
                    this.setState({ isLoading: true })
                    fetchDataHandleError(error)
                })
        })
    }

    // Fetching all the needed data
    fetchData = async () => {
        this.userid = JSON.parse(sessionStorage.getItem('userDetails'))
        console.log(
            `Entered <FavoriteButton> componentDidMount(), fetching userid: ${
                this.userid
            }`
        )
        try {
            await this.getUserDetails()
            const trackid = await this.props.trackid
            await this.getFavoriteStatus(trackid)
        } catch (error) {
            this.setState({ isLoading: true })
            console.error(error)
        }
    }

    async componentDidMount() {
        await this.setState({ isLoading: true })
        await this.fetchData()
    }

    // Toggle the favorite button function
    favoriteToggle() {
        const userDetails = this.state.userDetails
        const self = this
        // User want remove track from favorites list
        if (this.state.isFavorite) {
            return new Promise(resolve => {
                axios
                    .put(
                        `${originURL}user/removeFavoriteTrack/${
                            userDetails._id
                        }`,
                        { trackid: self.state.trackid }
                    )
                    .then(favoritedTrack => {
                        self.setState({ isFavorite: false })
                        NotificationManager.info(
                            'Track removed from favorites.'
                        )
                        console.log(
                            `Track ${
                                self.state.trackid
                            } removed from favorites.`
                        )
                        resolve(favoritedTrack.data)
                    })
                    .catch(error => {
                        fetchDataHandleError(error)
                    })
            })
        }
        // User want add track to favorites list
        else {
            return new Promise(resolve => {
                axios
                    .put(
                        `${originURL}user/addFavoriteTrack/${userDetails._id}`,
                        { trackid: self.state.trackid }
                    )
                    .then(unFavoritedTrack => {
                        self.setState({ isFavorite: true })
                        NotificationManager.success('Track added to favorites.')
                        console.log(
                            `Track ${self.state.trackid} added to favorites.`
                        )
                        resolve(unFavoritedTrack.data)
                    })
                    .catch(error => {
                        fetchDataHandleError(error)
                    })
            })
        }
    }

    render() {
        return (
            <div>
                <NotificationContainer />

                {!this.state.isLoading && (
                    <Button
                        className='likeButton'
                        color={this.state.isFavorite ? 'red' : 'grey'}
                        onClick={this.favoriteToggle}
                        icon="heart"
                    />
                )}
            </div>
        )
    }
}

export default FavoriteButton
