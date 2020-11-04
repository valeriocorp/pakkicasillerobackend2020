import MongoClient from 'mongodb';
import chalk from 'chalk';
class Database {

    async init() {
        const MONGO_DV = process.env.DATABASE || 'mongodb://127.0.0.1:27017/online-shop';

        const client = await MongoClient.connect(
           MONGO_DV,
           {
               useNewUrlParser: true,
               useUnifiedTopology: true
           } 
        );

        const db = client.db();

        if (client.isConnected()) {
            console.log('======================DATABASE===================');
            console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
            console.log(`NAME DATABASE: ${chalk.greenBright(db.databaseName)}`);

            
        }

        return db;
    }
}


export default Database;