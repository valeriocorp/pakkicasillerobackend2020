import { IResolvers } from 'graphql-tools';
import CotizacionService from '../../services/cotizacion.service';

const resolversCotizacionesMutation: IResolvers = {
    Mutation: {
        addCotizacion(_, variables, context) {
          return new CotizacionService(_, variables, context).insert();
        },
        updateCotizacion(_, variables, context) {
          return new CotizacionService(_, variables, context).modify();
        },
        deleteCotizacion(_, variables, context) {
          return new CotizacionService(_, variables, context).delete();
        },
        blockCotizacion(_, {id, unblock, admin}, context) {
          return new CotizacionService(_, {id, unblock, admin}, context).block(unblock, admin);
        },
      },

};

export default resolversCotizacionesMutation;