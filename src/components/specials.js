import React, {Component} from 'react'
import '../style/specials.css'
import SpecialItem from '../components/specialItem'

const specialsUrl = 'https://restaurant-menu-service.herokuapp.com/getSpecialDishes/Affecte'

// Specials component
class Specials extends Component {
    constructor(props) {
        super(props)
        this.state = { specials: []}
        this.fetchData = this.fetchData.bind(this)
        this.eachSpecial = this.eachSpecial.bind(this)
    }

    // fetch data from service when component did mount
    componentDidMount() {
        this.fetchData(specialsUrl)
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
            specials: [
                ...prevState.specials, {
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

    // render each specialItem component
    eachSpecial(item, i) {
        return (
        <div className='specialContainer' key={ `container${i}` }>
            <div>
                <SpecialItem 
                    item={item}
                    index={i}
                />
            </div>
        </div>
        )
    }

    // specials render
    render() {
        return (
            <div id='specials'>
                <h1>This month specials</h1>
                <div className='decoration'></div>
                <div className="specialsList">
                    { this.state.specials.map(this.eachSpecial) }
                </div>
            </div>
        )
    }
}

export default Specials