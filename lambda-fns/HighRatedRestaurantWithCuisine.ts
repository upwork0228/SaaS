const gremlin = require('gremlin')
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection
const Graph = gremlin.structure.Graph
var uri = process.env.NEPTUNE_ENDPOINT
const __ = gremlin.process.statics;
const { order: { desc } } = gremlin.process;

const HighRatedRestaurantsWithCuisine = async (City: string, Cuisine: string) => {
  let dc = new DriverRemoteConnection(`wss://${uri}:8182/gremlin`, {})
  const graph = new Graph()
  const g = graph.traversal().withRemote(dc)
  try {
    console.log('City',City)
    console.log("Cuisine",Cuisine)
    let result = await g.V().has('restaurant', 'restaurantCity', City).order().
      by(__.V().in_('about').values('reviewRating').mean(), desc).where(__.out('serves').
      has('cuisineName', Cuisine)).toList();
    let highRatedRestaurantWithCuisine = Array()
    for (const v of result) {
      const _properties = await g.V(v.id).properties().toList()
      let restaurant = _properties.reduce((acc, next) => {
        acc[next.label] = next.value
        return acc
      }, {})
      highRatedRestaurantWithCuisine.push(restaurant)
    }
    dc.close()
    console.log("Result",result,highRatedRestaurantWithCuisine)
    return highRatedRestaurantWithCuisine
  } catch (err) {
    console.log('ERROR', err)
    return null
  }
}

export default HighRatedRestaurantsWithCuisine