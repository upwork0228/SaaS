const gremlin = require('gremlin')
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection
const Graph = gremlin.structure.Graph
var uri = process.env.NEPTUNE_ENDPOINT
const __ = gremlin.process.statics;
const { order: { desc } } = gremlin.process;

const latestReview = async (RestaurantID: string) => {
  let dc = new DriverRemoteConnection(`wss://${uri}:8182/gremlin`, {})
  const graph = new Graph()
  const g = graph.traversal().withRemote(dc)
  try {
    //let data = await g.V().hasLabel('person').toList()
    let result = await g.V().has('restaurant', 'restaurantID', RestaurantID).in_('about').
      order().
      by('reviewDate', desc).
      limit(3).toList()
console.log('Result',result,)
console.log('RestaurantID',RestaurantID)

    let latestReviews = Array()
    for (const v of result) {
      const _properties = await g.V(v.id).properties().toList()
      let review = _properties.reduce((acc, next) => {
        acc[next.label] = next.value
        return acc
      }, {})
      latestReviews.push(review)
    }

    dc.close()
    console.log(latestReviews)

    return latestReviews
  } catch (err) {
    console.log('ERROR', err)
    return null
  }
}

export default latestReview