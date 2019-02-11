import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import Dish from '../components/dish'
import '../style/menu.css'

const menuUrl = 'https://restaurant-menu-service.herokuapp.com/getDishes/Affecte'

// Menu component
class Menu extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            dishes: [], 
            category: 'Starters'
        }
        this.fetchData = this.fetchData.bind(this)
        this.eachDish = this.eachDish.bind(this)
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

    // render each dish component
    eachDish(item, i) {
        if(this.state.category === item.category){
            return (
                <div key={ `container${i}` }>
                    <div>
                        <Dish
                            item={item}
                            editable={this.props.editable}
                            index={i}
                        />
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div id='menu'>
              <h1>Menu</h1>
              <div className='decoration'></div>
              <div>
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
              { this.props.editable && <Link to='/add' className='add'>Add new dish</Link>}
              <div className="menuList">
                    { this.state.dishes.map(this.eachDish) }
                </div>
            </div>
        )
    }
}

export default Menu