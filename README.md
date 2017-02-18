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