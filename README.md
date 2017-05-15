# Import Couchbase backup into new Cluster

To run this code, you must create a .env in the root of cloned repository.

Example .env

POST_URL="http://mycouchbase-servers-gateway-sync-url"
POST_PORT=4984
FILE_RESTORE_NAME="flight_restrictions.json"
DB_JSON_NODE="flight-restrictions"
DB_NAME="facilities"

Once you've create the file, you are then able to take a backup of your local Couchbase server, via UI.  This will
produce a zip file.  You will need to extract the contents of the zip file into directory where repository is cloned.

We only need the .json file.

Once you have extracted the json file, you will need to identify the JSON object to be imported.

Once completed, and ready, then just execute

node index.js



