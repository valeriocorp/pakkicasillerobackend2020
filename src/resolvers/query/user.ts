import { IResolvers } from 'graphql-tools';
import UsersService from '../../services/user.service';


const resolversUserQuerry: IResolvers = {
    Query: {
        async users(_, {page, itemsPage, active}, context){
            console.log(active);
             
            return new UsersService(_, {pagination:{page, itemsPage}}, context).items(active);
        },

        async login(_,{email, password},context){
           
            return new UsersService(_, {user: {email, password}}, context).login();

        },

        me(_, __, {token}) {
         
            return new UsersService(_, __, {token}).auth();

        },

 
     
    }

};


export default resolversUserQuerry;