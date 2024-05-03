import { driver, process as gprocess } from "gremlin";
import RestaurantInput from "./Restaurant";
declare var process: {
  env: {
    NEPTUNE_ENDPOINT: string;
  };
};
export default async function addFriend(restaurant: RestaurantInput) {
  let conn: driver.DriverRemoteConnection;
  let g: gprocess.GraphTraversalSource;
  const getConnectionDetails = () => {
    const database_url =
      "wss://" + process.env.NEPTUNE_ENDPOINT + ":8182/gremlin";
    return { url: database_url, headers: {} };
  };

  const createRemoteConnection = () => {
    const { url, headers } = getConnectionDetails();
    return new driver.DriverRemoteConnection(url, {
      mimeType: "application/vnd.gremlin-v2.0+json",
      pingEnabled: false,
      headers: headers,
    });
  };
  const createGraphTraversalSource = (conn: driver.DriverRemoteConnection) => {
    return gprocess.traversal().withRemote(conn);
  };
  if (conn == null) {
    conn = createRemoteConnection();
    g = createGraphTraversalSource(conn);
  }
  let data = await g
    .addV("restaurant")
    .property("restaurantID", restaurant.RestaurantID)
    .property("restaurantName", restaurant.RestaurantName)
    .property("restaurantCity", restaurant.RestaurantCity)
    .next();
  return restaurant;
}
