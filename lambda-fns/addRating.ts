import { driver, process as gprocess } from "gremlin";
import RatingInput from "./Rating";
declare var process: {
  env: {
    NEPTUNE_ENDPOINT: string;
  };
};
export default async function addRating(ratingInput: RatingInput) {
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
  const __ = gprocess.statics;

  let result = await g
    .addE("rates")
    .from_(__.V().has("person", "PersonID", ratingInput.PersonID))
    .to(
      __.addV("rating")
        .property("ratingID", ratingInput.ratingID)
        .property("isHelpful", ratingInput.isHelpful)
        .property("ratingDate", ratingInput.ratingdate)
    )
    .addE("about")
    .from_(__.V().has("rating", "ratingID", ratingInput.ratingID))
    .to(__.V().has("review", "reviewID", ratingInput.ReviewID))
    .toList();
  console.log(result);
  return "Rating Added Sucessfully";
}
