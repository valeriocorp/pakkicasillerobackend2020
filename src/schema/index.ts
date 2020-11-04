import 'graphql-import-node';
import { GraphQLSchema } from 'graphql';
import {makeExecutableSchema} from 'graphql-tools';
import resolvers from '../resolvers/index';

import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

const loadedFiles = loadFilesSync(`${__dirname}/**/*.graphql`);
const typeDefs = mergeTypeDefs(loadedFiles);



const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
    resolverValidationOptions:{
        requireResolversForResolveType: false
    }
});

export default schema;