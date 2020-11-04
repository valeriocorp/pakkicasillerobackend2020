import { IResolvers } from 'graphql-tools';
import CotizacionService from '../../services/cotizacion.service';
import EnvioService from '../../services/envios.service';

const resolversEnvioQuery: IResolvers = {
    Query: {
        async envios(_, {page, itemsPage, active, id}, { db }) {
            return new EnvioService(_, {
                pagination:{page, itemsPage}
            }, { db }).items(active, id);
        },
   //     async tag(_, { id }, { db }) {
   //         return new CotizacionService(_, { id }, { db }).details();
    //    }
    }
};

export default resolversEnvioQuery;