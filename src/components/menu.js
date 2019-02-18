import React, {Component} from 'react'
import Dish from '../components/dish'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Modal from 'react-modal'
import modalStyle from '../style/modal.css'
import '../style/menu.css'

const menuUrl = 'https://restaurant-menu-service.herokuapp.com/getDishes/Affecte'
const addUrl ='https://restaurant-menu-service.herokuapp.com/addDish'

// Menu component
class Menu extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            dishes: [],             // data of displayed dishes
            category: 'Starters',   // selected category to be displayed
            modalIsOpen: false,     // add new dish is open or closed
        }
        this.fetchData = this.fetchData.bind(this)
        this.add = this.add.bind(this)
        this.delete = this.delete.bind(this)
        this.update = this.update.bind(this)
        this.renderMenuNav = this.renderMenuNav.bind(this)
        this.renderDialog = this.renderDialog.bind(this)
        this.eachDish = this.eachDish.bind(this)
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.save = this.save.bind(this)
        this.submit = this.submit.bind(this)
    }

    // fetch data from service when component did mount
    componentDidMount() {
        this.fetchData(menuUrl)
    }

    // function to fetch data from url
    fetchData(url) {
        fetch(url)
        .then(res => res.json())
        .then(data => data.map(item => 
            this.add(
                {
                    id: item._id,
                    name: item.name,
                    category: item.category,
                    description: item.description,
                    price: item.price,
                    images: item.images
                }
            )
        ))
        .catch(err => console.error(err))
    }

    // function adds data to state
    add({id = null, name = 'default name', price = 0, category = 'default', description = 'default', images = null}) {
        this.setState(prevState => ({
            dishes: [
                ...prevState.dishes, {
                    id: id,
                    name: name,
                    category: category,
                    description: description,
                    price: price,
                    images: images
                }
            ]
        }))
    }

    // function deletes dish from state
    delete(id){
        this.setState(prevState => ({
            dishes: prevState.dishes.filter(dish => dish.id !== id)
          }))
    }

    // function updates dish in state
    update(newDish, id) {
        this.setState(prevState => ({
          dishes: prevState.dishes.map(data => data.id !== id ? data : newDish )
        }))
      }

    // render each dish component
    eachDish(item, i) {
        if(this.state.category === item.category){
            return (
                <div key={ `container${i}` }>
                    <div>
                        <Dish
                            item={item}
                            editable={this.props.editable}
                            onUpdate={this.update}
                            onDelete={this.delete}
                            index={i}
                        />
                    </div>
                </div>
            )
        }
    }

    // handle dialog open
    handleOpen() {
        this.setState({modalIsOpen: true})
    }

    // handle dialog close
    handleClose() {
        this.setState({modalIsOpen: false})
    }

    // save added dish
    save() {
        // service request
        fetch(addUrl, {
            method: 'POST',
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
                id: 1
            })
        })
        .then(()=>{ 
            // get item's new id
            fetch(menuUrl)
            .then(res => res.json())
            .then(data => data.forEach(item => {
                if(item.name===this.newDishName.value){
                    // add dish to state
                    this.add(
                        {
                            id: item._id,
                            name: this.newDishName.value,
                            category: this.newDishCategory.value,
                            description: this.newDishDescription.value,
                            price: this.newDishPrice.value,
                            images: this.newDishImages.value.split(" ")
                        })
                    this.handleClose()
                }
            }))
            .catch(err => console.error(err))
        })
        .catch(err => console.error(err))
        
    }

    // submit form to add dish
    submit(e) {
        e.preventDefault()
        confirmAlert({
          title: 'Confirm to submit',
          message: 'Are you sure you want to add this dish?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.save()
            },
            {
              label: 'No'
            }
          ]
        })
    }

    // render navigation menu
    renderMenuNav(){
        return(
            <div className='menuNav'>
                <ul>
                    <li>
                        <button 
                            onClick={(e) => this.setState({category: 'Starters'})} 
                            className={(this.state.category === 'Starters') ? 'buttonClicked' : '' }
                        >Starters</button>
                    </li>
                    <li>
                        <button 
                            onClick={(e) => this.setState({category: 'Main Dishes'})}
                            className={(this.state.category === 'Main Dishes') ? 'buttonClicked' : '' }
                        >Main Dishes</button>
                    </li>
                    <li>
                        <button 
                            onClick={(e) => this.setState({category: 'Desserts'})}
                            className={(this.state.category === 'Desserts') ? 'buttonClicked' : '' }
                        >Desserts</button>
                    </li>
                    <li>
                        <button 
                            onClick={(e) => this.setState({category: 'Drinks'})}
                            className={(this.state.category === 'Drinks') ? 'buttonClicked' : '' }
                        >Drinks</button>
                    </li>
                </ul>
            </div>
        )
    }

    // render add dish dialog
    renderDialog(){
        return(
            <div>
                <button onClick={this.handleOpen} className='add'>Add new dish</button>
                <Modal // modal to display add form
                    appElement={document.getElementById('root')}
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.handleClose}
                    contentLabel="Add new Dish"
                    style={modalStyle}
                    >
                    <div className='dialogAdd'>
                        <h2>Add new Dish</h2>
                        <div className='decoration'></div>
                        <form onSubmit={this.submit}> 
                            <label>Name: <input ref={input => this.newDishName = input} type='text'/></label>
                            <label>Category: 
                                <select ref={input => this.newDishCategory = input}>
                                    <option value="Starters">Starters</option>
                                    <option value="Main Dishes">Main Dishes</option>
                                    <option value="Desserts">Desserts</option>
                                    <option value="Drinks">Drinks</option>
                                </select>
                            </label>
                            <label>Price: <input ref={input => this.newDishPrice = input} type='number' step="0.01"/></label>
                            <label>Description: <textarea ref={input => this.newDishDescription = input} type='text'/></label>
                            <label>Images: <textarea ref={input => this.newDishImages = input} type='text'/></label>
                            <button onClick={this.submit}>Add</button>
                        </form>
                        <button onClick={this.handleClose}>Close</button>
                    </div>
                </Modal>
            </div>
        )
    }

    render() {
        return (
            <div id='menu'>
                <div className='menuHeader'>
                    <h1>Menu</h1>
                    <div className='decoration'></div>
                </div>
                { this.renderMenuNav() }
                { this.props.editable && this.renderDialog() }
                <div className="menuList">
                    { this.state.dishes.map(this.eachDish) }
                </div>
            </div>
        )
    }
}

export default Menu