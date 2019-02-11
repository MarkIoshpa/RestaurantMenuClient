import React, { Component } from 'react'
import Lightbox from 'react-image-lightbox'
import { MdImage, MdEdit, MdDelete } from 'react-icons/md'
import 'react-image-lightbox/style.css'

// Dish component
class Dish extends Component {
    constructor(props){
        super(props)
        this.state = {
            photoIndex: 0,
            isOpen: false,
        }
    }

    render(){
        const { photoIndex, isOpen } = this.state;

        return(
            <div className='dishItem'>
                <h2>{this.props.item.name}</h2>
                <button type="button" onClick={() => this.setState({ isOpen: true })}><MdImage/></button>
                <h3>{this.props.item.price}$</h3>
                <p>{this.props.item.description}</p>
                { this.props.editable &&
                    <div>
                        <button><MdEdit/></button>
                        <button><MdDelete/></button>
                    </div>
                }

                {isOpen && ( // lightbox to display images of dishes when open
                    <Lightbox
                        mainSrc={this.props.item.images[photoIndex]}
                        nextSrc={this.props.item.images[(photoIndex + 1) % this.props.item.images.length]}
                        prevSrc={this.props.item.images[(photoIndex + this.props.item.images.length - 1) % this.props.item.images.length]}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        onMovePrevRequest={() =>
                        this.setState({
                            photoIndex: (photoIndex + this.props.item.images.length - 1) % this.props.item.images.length,
                        })
                        }
                        onMoveNextRequest={() =>
                        this.setState({
                            photoIndex: (photoIndex + 1) % this.props.item.images.length,
                        })
                        }
                    />
                )}
            </div>
        )
    }
}

export default Dish