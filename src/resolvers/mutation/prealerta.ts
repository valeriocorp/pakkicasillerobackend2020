import { IResolvers } from 'graphql-tools';
import PrealertaService from '../../services/prealertas.service';

const resolversPrealertaMutation: IResolvers = {
    Mutation: {
        addPrealerta(_, variables, context) {
          return new PrealertaService(_, variables, context).insert();
        },
        updatePrealerta(_, variables, context) {
          return new PrealertaService(_, variables, context).modify();
        },
        deletePrealerta(_, variables, context) {
          return new PrealertaService(_, variables, context).delete();
        },
        blockPrealerta(_, {id, unblock, admin}, context) {
          return new PrealertaService(_, {id, unblock, admin}, context).block(unblock, admin);
        },
      },

};

export default resolversPrealertaMutation;