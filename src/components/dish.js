import React, { Component } from 'react'
import Lightbox from 'react-image-lightbox'
import { MdImage, MdEdit, MdDelete } from 'react-icons/md'
import Modal from 'react-modal'
import modalStyle from '../style/modal.css'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import 'react-image-lightbox/style.css'

const menuUrl = 'https://restaurant-menu-service.herokuapp.com/getDishes/Affecte'
const editUrl ='https://restaurant-menu-service.herokuapp.com/editDish'
const deleteUrl = 'https://restaurant-menu-service.herokuapp.com/deleteDish'

// Dish component
class Dish extends Component {
    constructor(props){
        super(props)
        this.state = {
            photoIndex: 0,
            isOpen: false,
            modalIsOpen: false
        }

        this.renderDialog = this.renderDialog.bind(this)
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.update = this.update.bind(this)
        this.delete = this.delete.bind(this)
        this.submit = this.submit.bind(this)
        this.confirmDel = this.confirmDel.bind(this)
    }

    
    // handle dialog open
    handleOpen() {
        this.setState({modalIsOpen: true})
    }

    // handle dialog close
    handleClose() {
        this.setState({modalIsOpen: false})
    }

    // delete dish
    delete() {
        // update parent
        this.props.onDelete(this.props.item.id)
        // service request
        fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dish_id: this.props.item.id,
                id: 1
            })
        })
        .catch(err => console.error(err))
    }

    // delete dish
    update() {
        // new data
        var newDish = {
            id: this.props.item.id,
            name: this.newDishName.value,
            category: this.newDishCategory.value,
            description: this.newDishDescription.value,
            price: this.newDishPrice.value,
            images: this.newDishImages.value.split(" ")
        }
        // service request
        fetch(editUrl, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: this.newDishName.value,
                category: this.newDishCategory.value,
                description: this.newDishDescription.value,
                price: this.newDishPrice.value,
                imagesURL: this.newDishImages.value,
                id: 1,
                dish_id: this.props.item.id
            })
        })
        .then(()=>{ 
            // get item's new id
            fetch(menuUrl)
            .then(res => res.json())
            .then(data => data.map(item => {
                if(item.name===this.newDishName.value){
                    newDish.id = item._id
                    this.props.onUpdate(newDish, this.props.item.id)
                    this.props.item.id = item._id
                    this.handleClose()
                }
            }))
            .catch(err => console.error(err))
        })
        .catch(err => console.error(err))
    }

    // confirm alert
    confirmDel() {
        confirmAlert({
          title: 'Confirm to delete',
          message: 'Are you sure you want to delete this dish?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.delete()
            },
            {
              label: 'No'
            }
          ]
        })
    }

    // render edit dish dialog
    renderDialog(){
        return(
            <div>
                <Modal
                    appElement={document.getElementById('root')}
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.handleClose}
                    contentLabel="Add new Dish"
                    style={modalStyle}
                    >
                    <div className='dialogAdd'>
                        <h2>Edit dish: {this.props.item.name}</h2>
                        <div className='decoration'></div>
                        <form onSubmit={this.submit}>
                            <label>Name: <input ref={input => this.newDishName = input} defaultValue={this.props.item.name} type='text'/></label>
                            <label>Category: 
                                <select name="category" ref={input => this.newDishCategory = input} defaultValue={this.props.item.category}>
                                    <option value="Starters" >Starters</option>
                                    <option value="Main Dishes" >Main Dishes</option>
                                    <option value="Desserts" >Desserts</option>
                                    <option value="Drinks" >Drinks</option>
                                </select>
                            </label>
                            <label>Price: <input ref={input => this.newDishPrice = input} defaultValue={this.props.item.price} type='number' step="0.01"/></label>
                            <label>Description: <textarea ref={input => this.newDishDescription = input} defaultValue={this.props.item.description} type='text'/></label>
                            <label>Images: <textarea ref={input => this.newDishImages = input} defaultValue={this.props.item.images.join(' ')} type='text'/></label>
                            <button onSubmit={this.submit}>Edit</button>
                        </form>
                        <button onClick={this.handleClose}>Close</button>
                    </div>
                </Modal>
            </div>
        )
    }

    // submit form to update dish
    submit(e) {
        e.preventDefault()
        confirmAlert({
            title: 'Confirm to update',
            message: 'Are you sure you want to update this dish?',
            buttons: [
            {
                label: 'Yes',
                onClick: () => this.update()
            },
            {
                label: 'No'
            }
            ]
        })
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
                        <button onClick={this.handleOpen}><MdEdit/></button>
                        {this.renderDialog()}
                        <button onClick={this.confirmDel}><MdDelete/></button>
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