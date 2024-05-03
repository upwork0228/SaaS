const gremlin = require('gremlin')
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection
const Graph = gremlin.structure.Graph
var uri = process.env.NEPTUNE_ENDPOINT

const ListPersons = async () => {
  let dc = new DriverRemoteConnection(`wss://${uri}:8182/gremlin`, {})
  const graph = new Graph()
    const g = graph.traversal().withRemote(dc)
    try {
      let data = await g.V().hasLabel('person').toList()

      let persons = Array()
      for (const v of data) {
        const _properties = await g.V(v.id).properties().toList()
        let person = _properties.reduce((acc, next) => {
          acc[next.label] = next.value
          return acc
        }, {})
        persons.push(person)
      }
                
      dc.close()
      return persons
    } catch (err) {
        console.log('ERROR', err)
        return null
    }
}

export default ListPersons