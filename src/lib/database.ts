import MongoClient from 'mongodb';
import chalk from 'chalk';
class Database {

    async init() {
        const MONGO_DV = process.env.DATABASE || 'mongodb+srv://Fvalerio103526:Fvalerio103526@pruebas.olkkf.mongodb.net/casillero?retryWrites=true&w=majority';

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