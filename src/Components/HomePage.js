import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import Menu from './Menu'
import { originURL } from '../globalService'
import { Breadcrumb } from 'react-bootstrap'
import { rank } from '../MISC'
import { Statistic, List, Icon, Image, Button } from 'semantic-ui-react'
import BLE from './BLE'
import './style/HomePage.css'

class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tracks: [],
            userDetails: [],
            isLoading: true,
        }
    }

    componentDidMount() {
        this.userid = JSON.parse(sessionStorage.getItem('userDetails'))

        // Get the user details from database
        axios
            .get(`${originURL}user/getAccountDetails/${this.userid}`)
            .then(userResponse => {
                userResponse.data.createdDate = userResponse.data.createdDate.split(
                    'T'
                )[0]
                this.setState({
                    userDetails: userResponse.data,
                    isLoading: false,
                })
            })
            .catch(error => {
                console.error(error)
            })
    }

    render() {
        const userDetails = { ...this.state.userDetails }
        return (
            <div className='firstDiv'>
                {/* Page Menu */}
                <Menu currentPage={'Home'}> </Menu>

                {/* Page BreadCrumbs */}
                <Breadcrumb>
                    <Breadcrumb.Item href="../">Login</Breadcrumb.Item>
                    <Breadcrumb.Item active>Home</Breadcrumb.Item>
                    <BLE />
                </Breadcrumb>

                {!this.state.isLoading && (
                    <div className='secDiv'>
                        <h2 className='firstH2'>
                            {userDetails.name}
                        </h2>
                        <NavLink
                            to={{
                                pathname: `${process.env.PUBLIC_URL}/profile`,
                            }}
                            className='firstNavLink'
                        >
                            <Button circular icon="settings" />
                        </NavLink>
                        <Image
                            className='firstImage'
                            src={this.state.userDetails.profilePicture}
                            size="tiny"
                            circular
                            centered
                        />
                        <div className='thirdDiv'>
                            <p>
                                <strong>
                                    <List.Icon name="users" size="large" />{' '}
                                    Acount Created Date:{' '}
                                </strong>{' '}
                                {userDetails.createdDate}{' '}
                            </p>
                            <p>
                                <strong>
                                    <List.Icon name="mail" size="large" />{' '}
                                    Email:{' '}
                                </strong>{' '}
                                {userDetails.email}{' '}
                            </p>
                            <p>
                                <strong>
                                    <List.Icon
                                        name="universal access"
                                        size="large"
                                    />{' '}
                                    Accessibility:{' '}
                                </strong>{' '}
                                {userDetails.accessibility === 1
                                    ? 'Not Disabled'
                                    : 'Disabled'}{' '}
                            </p>
                            <p>
                                <strong>
                                    <List.Icon name="smile" size="large" />{' '}
                                    Rank:{' '}
                                </strong>{' '}
                                {' ' + rank[userDetails.rank]}
                            </p>
                            <p>
                                <strong>
                                    <List.Icon name="birthday" size="large" />{' '}
                                    Birth Day Date:{' '}
                                </strong>{' '}
                                {userDetails.birthDay}
                            </p>
                        </div>
                        <div
                            className='fourthDiv'
                        >
                            <Statistic
                                color={'green'}
                                className='stats'
                            >
                                <Statistic.Value>
                                    {userDetails.trackRecords.length}
                                    <Icon name="check" />
                                </Statistic.Value>
                                <Statistic.Label>
                                    Cretaed tracks
                                </Statistic.Label>
                            </Statistic>
                            <Button.Group>
                                <Button color="teal">
                                    <NavLink
                                        to={{
                                            pathname: `${
                                                process.env.PUBLIC_URL
                                            }/auto`,
                                        }}
                                        className='secButton'
                                    >
                                        Auto generate
                                    </NavLink>
                                </Button>
                                <Button.Or />
                                <Button color="olive">
                                    <NavLink
                                        to={{
                                            pathname: `${
                                                process.env.PUBLIC_URL
                                            }/custom`,
                                        }}
                                        className='thirdButton'
                                    >
                                        Custom generate
                                    </NavLink>
                                </Button>
                            </Button.Group>
                            <Statistic
                                color={'red'}
                                className='secStats'
                            >
                                <Statistic.Value>
                                    {userDetails.favoriteTracks.length}
                                    <Icon name="like" />
                                </Statistic.Value>
                                <Statistic.Label>
                                    Favorite tracks
                                </Statistic.Label>
                            </Statistic>
                            <Button.Group>
                                <Button color="red">
                                    <NavLink
                                        to={{
                                            pathname: `${
                                                process.env.PUBLIC_URL
                                            }/favorites`,
                                        }}
                                        className='secNavLink'
                                    >
                                        Favorite list
                                    </NavLink>
                                </Button>
                                <Button.Or />
                                <Button color="orange">
                                    <NavLink
                                        to={{
                                            pathname: `${
                                                process.env.PUBLIC_URL
                                            }/mytracks`,
                                        }}
                                        className='firstButton'
                                    >
                                        My tracks
                                    </NavLink>
                                </Button>
                            </Button.Group>
                            <Statistic
                                color={'blue'}
                                className='thirdStats'
                            >
                                <Statistic.Value>
                                    {userDetails.totalDistance}m
                                </Statistic.Value>
                                <Statistic.Label>
                                    Total navigated distance{' '}
                                </Statistic.Label>
                            </Statistic>
                            <Button color="blue">
                                <NavLink
                                    to={{
                                        pathname: `${
                                            process.env.PUBLIC_URL
                                        }/choose`,
                                    }}
                                    className='thirdNavLink'
                                >
                                    Search tracks
                                </NavLink>
                            </Button>
                        </div>
                    </div>
                )

                // Progress Bar: Baby, Tyro, Warrior, Knight, Royalty
                // About Levels
                }
            </div>
        )
    }
}

export default HomePage
