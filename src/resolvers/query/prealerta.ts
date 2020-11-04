import { IResolvers } from 'graphql-tools';
import CotizacionService from '../../services/cotizacion.service';
import EnvioService from '../../services/envios.service';
import PrealertaService from '../../services/prealertas.service';

const resolversPrealertaQuery: IResolvers = {
    Query: {
        async prealertas(_, {page, itemsPage, active, id}, { db }) {
            return new PrealertaService(_, {
                pagination:{page, itemsPage}
            }, { db }).items(active, id);
        },
   //     async tag(_, { id }, { db }) {
   //         return new CotizacionService(_, { id }, { db }).details();
    //    }
    }
};

export default resolversPrealertaQuery;