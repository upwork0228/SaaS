const gremlin = require('gremlin')
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection
const Graph = gremlin.structure.Graph
var uri = process.env.NEPTUNE_ENDPOINT

const listFriends = async (PersonID:string) => {
  let dc = new DriverRemoteConnection(`wss://${uri}:8182/gremlin`, {})
  const graph = new Graph()
    const g = graph.traversal().withRemote(dc)
    try {
      let data = await g.V().has('person','PersonID',PersonID).out('friend').toList()
      let friends = Array()
      for (const v of data) {
        const _properties = await g.V(v.id).properties().toList()
        let friend = _properties.reduce((acc, next) => {
          acc[next.label] = next.value
          return acc
        }, {})
        friends.push(friend)
      }
                
      dc.close()
      return friends
    } catch (err) {
        console.log('ERROR', err)
        return null
    }
}

export default listFriends