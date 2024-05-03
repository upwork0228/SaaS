import { driver, process as gprocess } from 'gremlin';
const __ = gprocess.statics;

import CuisineInput from './Cuisine'
declare var process: {
    env: {
        NEPTUNE_ENDPOINT: string
    }
}
export default async function addFriend(cuisine: CuisineInput) {
    let conn: driver.DriverRemoteConnection;
    let g: gprocess.GraphTraversalSource;
    const getConnectionDetails = () => {
        const database_url = 'wss://' + process.env.NEPTUNE_ENDPOINT + ':8182/gremlin';
        return { url: database_url, headers: {} };
    };
    const createRemoteConnection = () => {
        const { url, headers } = getConnectionDetails();
        return new driver.DriverRemoteConnection(
            url,
            {
                mimeType: 'application/vnd.gremlin-v2.0+json',
                pingEnabled: false,
                headers: headers
            });
    };
    const createGraphTraversalSource = (conn: driver.DriverRemoteConnection) => {
        return gprocess.traversal().withRemote(conn);
    };
    if (conn == null) {
        conn = createRemoteConnection();
        g = createGraphTraversalSource(conn);
    }
    let result = await g.addE('serves').from_(__.V().
        has('restaurant', 'restaurantID', cuisine.RestaurantID)).
        to(__.addV('cuisine').property('cuisineID', cuisine.CuisineID).
            property('cuisineName', cuisine.CuisineName)).next()
    return "cuisine added successfully";










}
