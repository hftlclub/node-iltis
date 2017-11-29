# ILTIS Backend

REST Server Backend for ILTIS (Internes Lagertransaktions- und Informationssystem). 

## Development

Execute the following commands to configure the standalone-server:

```
git clone https://github.com/hftlclub/node-iltis.git
cd node-iltis
npm install
cp config.example.js config.js
```

Modify the MySQL settings in your config file.

Start the server via the following command:

```
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your brower.

## Database
### Initiate Database
CREATE TABLES:
* `http://[::]:3000/init`

CREATE TABLES, INSERT SAMPLES:
* `http://[::]:3000/init?samples=<samplefile>`

### Reset Database
DROP, CREATE TABLES:
* `http://[::]:3000/reset`

DROP, CREATE TABLES, INSERT SAMPLES:
* `http://[::]:3000/reset?samples=<samplefile>`

### Sample files: Terms of use
* Sample files should be located in the repositories `database`-folder and have the file-extension `.sql`
* There is no need to name the file-extension in `?samples=<samplefile>`. This is optional. The backend will split the parameters content and extract the filename without its extension and map it to right path and extension to avoid code injections.