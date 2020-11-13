import { IResolvers } from 'graphql-tools';
import TrmService from '../../services/trmdia.service';

const resolversTrmQuery: IResolvers = {
    Query: {

        async trm(_, { id }, { db }) {
            return new TrmService(_, { id }, { db }).details();
        }
    }
};

export default resolversTrmQuery;