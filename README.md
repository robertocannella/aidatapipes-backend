# node-tut



## Application Setup

Follow these instructions when pulling a branch via VS CODE

* make project directory
* open project folder in VS CODE

run the following commands inside project folder as sudo
```
npm ci # not using the ci args will repack package-lock.json
run npm i -g nodemon
```

Mac:
```
xcode-select --install
```
Install Home Brew
```
brew tap mongodb/brew
brew install mongodb-community@5.0
brew services start mongodb-community@5.0

```
### Start
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

