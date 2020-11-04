import GMR from 'graphql-merge-resolvers';
import resolversUserMutation from './user';
import resolversGenreMutation from './genre';
import resolversTagMutation from './tag';
import resolversEmailMutation from './email';
import resolversCotizacionesMutation from './cotizacion';
import resolversEnvioMutation from './envio';
import resolversPrealertaMutation from './prealerta';
const mutationResolvers = GMR.merge([
    resolversUserMutation,
    resolversGenreMutation,
    resolversTagMutation,
    resolversEmailMutation,
    resolversCotizacionesMutation,
    resolversEnvioMutation,
    resolversPrealertaMutation
]);

export default mutationResolvers;