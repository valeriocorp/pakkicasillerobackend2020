import { IResolvers } from 'apollo-server-express';
import CalculadoraService from '../../services/calculadora.service';




const resolversCalculadoraMutation: IResolvers = {
    Mutation: {

        addCalculadora(_,variables, context){
            return new CalculadoraService(_, variables, context).insert();
        },
        
        updateCalculadora(_,variables, context){
            return new CalculadoraService(_, variables, context).modify();
        },
        deleteCalculadora(_,variables, context){
            return new CalculadoraService(_, variables, context).delete();
        },
        blockCalculadora(_,{id, unblock, admin}, context){
            return new CalculadoraService(_, {id}, context).block(unblock, admin);
        },
    }};


export default resolversCalculadoraMutation;    