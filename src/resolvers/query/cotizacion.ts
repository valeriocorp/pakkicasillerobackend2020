import { IResolvers } from 'graphql-tools';
import CotizacionService from '../../services/cotizacion.service';

const resolversCotizacionQuery: IResolvers = {
    Query: {
        async cotizaciones(_, {page, itemsPage, active, id}, { db }) {
            return new CotizacionService(_, {
                pagination:{page, itemsPage}
            }, { db }).items(active,id);
        },
   //     async tag(_, { id }, { db }) {
   //         return new CotizacionService(_, { id }, { db }).details();
    //    }
    }
};

export default resolversCotizacionQuery;