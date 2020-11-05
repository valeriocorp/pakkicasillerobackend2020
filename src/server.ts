import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import environments from './config/environment';
import {ApolloServer,PubSub} from 'apollo-server-express';
import schema from './schema';
import expressPlayground from 'graphql-playground-middleware-express';
import Database from './lib/database';
import { Icontext } from './interfaces/context.interface';
import chalk from 'chalk';
//Configuracion de las variables de entorno (lectura)
if (process.env.NODE_ENV !== 'production') {

    const env = environments;
    console.log(env);
}

async function init(){
    
const app = express();
const pubsub = new PubSub();
app.use('*',cors());

app.use(compression());

const database = new Database();
const db = await database.init();



const context = async({req, connection}: Icontext) =>{
        const token = (req) ? req.headers.authorization : connection.authorization;
        return {db, token,pubsub};
};

const server = new ApolloServer({
    schema,
    introspection: true,
    context
});

server.applyMiddleware({app});

app.get('/', expressPlayground({
    endpoint: '/graphql'
}));

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);
const PORT = process.env.PORT || 2004;

httpServer.listen(
    {
        port: PORT
    },
    () => {
        console.log('======================SERVER API GRAPHQL===================');
        console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
        console.log(`MESSAGE: ${chalk.greenBright('API - ONLINE SHOP CONNECTED!!')}`);
        console.log(`URL: ${chalk.greenBright(`http://localhost:${PORT}`)}`);
        
    }
);
}

init();