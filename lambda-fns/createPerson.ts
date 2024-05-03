import { driver, process as gprocess } from "gremlin";
import Person from "./Person";
declare var process: {
  env: {
    NEPTUNE_ENDPOINT: string;
  };
};
export default async function createPerson(person: Person) {
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
  let result = await g
    .addV("person")
    .property("PersonID", person.PersonID)
    .property("PersonName", person.PersonName)
    .property("Email", person.Email)
    .property("PersonCity", person.PersonCity)
    .next();
  return person;
}
