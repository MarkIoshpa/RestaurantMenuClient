import React from 'react'
import {Route} from 'react-router-dom'
import MainPage from '../components/main'

// React router
const ReactRouter = () => {
    return (
        <React.Fragment>
            <Route exact path='/' component={MainPage}/>
        </React.Fragment>
    )
}


export default ReactRouter