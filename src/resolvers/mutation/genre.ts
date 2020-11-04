import { IResolvers } from 'apollo-server-express';
import GenresService from '../../services/genre.service';




const resolversGenreMutation: IResolvers = {
    Mutation: {

        addGenre(_,variables, context){
            return new GenresService(_, variables, context).insert();
        },
        
        updateGenre(_,variables, context){
            return new GenresService(_, variables, context).modify();
        },
        deleteGenre(_,variables, context){
            return new GenresService(_, variables, context).delete();
        },
        blockGenre(_,variables, context){
            return new GenresService(_, variables, context).block();
        },
    }};


export default resolversGenreMutation;    