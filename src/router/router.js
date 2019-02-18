import React from 'react'
import {Route} from 'react-router-dom'
import MainPage from '../components/main'

// React router
const ReactRouter = () => {
    return (
        <React.Fragment>
            <Route exact path='/2018-2019/dcs/dev_281/' component={MainPage}/>
        </React.Fragment>
    )
}


export default ReactRouter