import mongoose from "mongoose";
import config from "config";

//Database setup
export const DATABASEUSERNAME = config.get('db.dbUser');
export const DATABASEPASSWORD = config.get('db.dbPass');
export const DATABASEHOST = config.get('db.dbHost');
export const DATABASEPORT = config.get('db.dbPort');
export const DATABASENAME = 'datapipes';

// Connect to mongodb
export default async () => {
    let url = `mongodb://${DATABASEHOST}:${DATABASEPORT}/${DATABASENAME}`;

    mongoose.connect(url, {
        serverSelectionTimeoutMS: 5000,
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        authSource: "admin",
        user: DATABASEUSERNAME,
        pass: DATABASEPASSWORD
    })
        .then(() => { console.log("Database is connected!") })
        .catch((error) => {
            console.log(error);
        })
}
