import GMR from 'graphql-merge-resolvers';
import resolversUserQuerry from './user';
import resolversProductQuerry from './product';
import resolversGenreQuery from './genre';
import resolversTagQuery from './tag';
import resolversCotizacionQuery from './cotizacion';
import resolversEnvioQuery from './envio';
import resolversPrealertaQuery from './prealerta';
import resolversTrmQuery from './trm';
import resolversCalculadoraQuery from './calculadora';

const queryResolvers = GMR.merge([
    resolversUserQuerry,
    resolversProductQuerry,
    resolversGenreQuery,
    resolversTagQuery,
    resolversCotizacionQuery,
    resolversEnvioQuery,
    resolversPrealertaQuery,
    resolversTrmQuery,
    resolversCalculadoraQuery
]);

export default queryResolvers;