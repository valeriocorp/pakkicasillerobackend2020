import {Db} from 'mongodb';
import { IPaginationOptions } from '../interfaces/pagination-options.interface';
/**
 * Ontener el ID que vamos autilizar en el nuevo objeto
 * @param database Base de datos con la que estamos trabajando 
 * @param collection colleccion donde queremos buscar el ultimo elemento
 * @param sort Como queremos ordenarlo {<propiedad>: -1}
 */
export const asignDocumentId = async(

    database: Db,
    collection: string,
    sort: object = {registerDate: -1}
) => {
    const lastElement = await database.collection(collection).
    find().
    limit(1).
    sort(sort).
    toArray();
if (lastElement.length === 0) {
return '1';

} return String(+lastElement[0].id + 1);     
};

//TODO:Comentar las funciones de base de datos 
export const findOneElement = async(
    database: Db,
    collection: string,
    filter: object
) => {

    return await database.collection(collection).
                findOne(filter);

};

export const insertOneElement = async(
    database: Db,
    collection: string,
    document: object
) => {
    return await database.
            collection(collection).
            insertOne(document);
};

export const updateOneElement = async(
    database: Db,
    collection: string,
    filter: object,
    updateObject: object
) => {
    return await database.
            collection(collection).
            updateOne(
                filter,
                {$set: updateObject}
            );
};

export const insertManyElements = async(
    database: Db,
    collection: string,
    document: Array<object>
) => {
    return await database.
            collection(collection).
            insertMany(document);
};


export const findElement = async(
    database: Db,
    collection: string,
    filter: object = {},
    paginationOptions: IPaginationOptions = {
        page: 1,
        pages: 1,
        itemsPage: -1,
        skip: 0,
        total: -1
    }
) => {
    if (paginationOptions.total === -1) {
        return await database.collection(collection).
        find(filter).toArray();
    }
     return await database.collection(collection).find(filter).limit(paginationOptions.itemsPage)
     .skip(paginationOptions.skip).toArray();
};

export const deleteoneElement = async(
    database: Db,
    collection: string,
    filter: object = {}
) => {
    return await database.collection(collection).
    deleteOne(filter);
};


export const countElement = async (
    database: Db,
    collection: string,
    filter: object = {}
) => {
    return await database.collection(collection).countDocuments(filter);
};