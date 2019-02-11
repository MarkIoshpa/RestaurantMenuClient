import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import '../style/header.css'

// Header component
class Header extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            Login: false
        }
        this.responseGoogle = this.responseGoogle.bind(this)
        this.logout = this.logout.bind(this)
    }

    // google response
    responseGoogle = (response) => {
        this.setState({Login: true})
        this.props.login(response)
    }

    // google logout
    logout = () => {
        this.setState({Login: false})
        this.props.logout()
    }

    render() {
        return (
            <div id='header'>
                <ul>
                    <li><a href='#header'>Home</a></li>
                    <li><a href='#specials'>Specials</a></li>
                    <li><a href='#menu'>Menu</a></li>
                    <li> {!this.state.Login ? 
                        <GoogleLogin
                            clientId="552156037235-obu9stiupvt3cj6o8d5p9a2s7lmru4mj.apps.googleusercontent.com"
                            render={renderProps => (
                                <a onClick={renderProps.onClick}>Login</a>
                            )}
                            onSuccess={this.responseGoogle}
                        /> :     
                        <GoogleLogout
                        render={renderProps => (
                            <a onClick={renderProps.onClick}>Logout</a>
                        )}
                        onLogoutSuccess={this.logout}
                        />}
                    </li>
                </ul>
                <div className='headerMessage'>
                    <h1>Welcome, <br/> Check our Menu!</h1>
                    <div className='decoration'></div>
                </div>
                <div className='seperator'></div>
            </div>
        )
    }
}

export default Header
