import React, { Component } from 'react'

// Special Item component to display special dishes
class SpecialItem extends Component {
    render(){
        return(
            <div className='specialItem'>
                <img src={this.props.item.images[0]} title={this.props.item.name} alt={this.props.item.name}></img>
                <div className='specialInfo'>
                    <h2>{this.props.item.name}</h2>
                    <p>{this.props.item.description}</p>
                    <h3>{this.props.item.price}$</h3>
                </div>
            </div>
        )
    }
}

export default SpecialItem