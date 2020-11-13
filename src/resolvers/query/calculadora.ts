import { IResolvers } from 'graphql-tools';
import CalculadoraService from '../../services/calculadora.service';

const resolversCalculadoraQuery: IResolvers = {
    Query: {

        async calculadora(_, variable, { db }) {
            return new CalculadoraService(_, variable, { db }).details();
        }
    }
};

export default resolversCalculadoraQuery;