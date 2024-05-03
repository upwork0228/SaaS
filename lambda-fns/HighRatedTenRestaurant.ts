const gremlin = require('gremlin')
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection
const Graph = gremlin.structure.Graph
var uri = process.env.NEPTUNE_ENDPOINT
const __ = gremlin.process.statics;

const tenhighRatedRestaurants = async (City:string) => {
  let dc = new DriverRemoteConnection(`wss://${uri}:8182/gremlin`, {})
  const graph = new Graph()
    const g = graph.traversal().withRemote(dc)
    try {
      console.log(City)
let result= await g.V().has('restaurant','restaurantCity',City).limit(10) .where(__.inE('about')). 
order().by(__.in_( 'about').values('reviewRating').mean()).
   toList();

      let tenhighRatedRestaurant = Array()
      for (const v of result) {
        const _properties = await g.V(v.id).properties().toList()
        let restaurant = _properties.reduce((acc, next) => {
          acc[next.label] = next.value
          return acc
        }, {})
        tenhighRatedRestaurant.push(restaurant)
      }
               console.log("Result",result)
               console.log("tenhighRatedRestaurant",tenhighRatedRestaurant)

      dc.close()
      return tenhighRatedRestaurant
    } catch (err) {
        console.log('ERROR', err)
        return null
    }
}

export default tenhighRatedRestaurants