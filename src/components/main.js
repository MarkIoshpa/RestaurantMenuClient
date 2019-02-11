import React, { Component } from 'react'
import Header from '../components/header'
import Specials from '../components/specials'
import Menu from '../components/menu'
import Footer from '../components/footer'

// Main component
class Main extends Component {
    constructor(props) {
        super(props)
        this.state = { editable: false }
        this.handleLogin = this.handleLogin.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
    }

    handleLogin = (response) => {
        this.setState({editable: true})
    }

    handleLogout = () => {
        this.setState({editable: false})
    }

    render() {
        return (
            <div>
                <Header login={this.handleLogin} logout={this.handleLogout}/>
                <Specials/>
                <Menu editable={this.state.editable}/>
                <Footer/>
            </div>
        )
    }

}

export default Main
