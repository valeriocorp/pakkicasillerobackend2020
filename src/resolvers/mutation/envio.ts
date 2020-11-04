import { IResolvers } from 'graphql-tools';
import EnvioService from '../../services/envios.service';

const resolversEnvioMutation: IResolvers = {
    Mutation: {
        addEnvio(_, variables, context) {
          return new EnvioService(_, variables, context).insert();
        },
        updateEnvio(_, variables, context) {
          return new EnvioService(_, variables, context).modify();
        },
        deleteEnvio(_, variables, context) {
          return new EnvioService(_, variables, context).delete();
        },
        blockEnvio(_, {id, unblock, admin}, context) {
          return new EnvioService(_, {id, unblock, admin}, context).block(unblock, admin);
        },
      },

};

export default resolversEnvioMutation;