# node-tut



## Application Setup

Follow these instructions when cloning via VS CODE

* make project directory
* open project folder in VS CODE

run the following commands inside project folder as sudo
```
// not using the ci args will repack package-lock.json
npm ci  
 
```

```
run npm i -g nodemon
```

## Mac M1:
Be sure to have xcode installed:
```
xcode-select --install
```
Install Home Brew
```
brew tap mongodb/brew
brew install mongodb-community@5.0
// start
brew services start mongodb-community@5.0
// stop
brew services stop mongodb-community@5.0

```
### Start MongoDB
```
mongod --config /opt/homebrew/etc/mongod.conf --fork
```


### Authentication
```
mongosh

use admin

use mydatabase
db.createUser(
    {
        user: "username",
        pwd: "password",
        roles: [
            { role: "readWrite", db: "mydatabase" }
        ]
    }
)
```




https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/

### Renwew Certificate
roberto@ubuntuserver:/etc/letsencrypt$ 

`sudo certbot certonly –force-renew -d dbs.aidatapipes.com`



