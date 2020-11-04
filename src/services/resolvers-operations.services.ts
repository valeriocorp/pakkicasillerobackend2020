import { findElement, findOneElement, insertOneElement, updateOneElement, deleteoneElement } from '../lib/db-operations';
import { IContextData } from '../interfaces/context-data.interface';
import { IVariables } from '../interfaces/variables.interface';
import { Db } from 'mongodb';
import { pagination } from '../lib/pagination';

class ResolversOperationsService {
    private variables : IVariables;
    private context : IContextData;

    constructor(root: object, variables: IVariables, context: IContextData){
            this.variables = variables;
            this.context = context;

    }
    protected getVariables(): IVariables {
        return this.variables;
    }

    protected getContext(): IContextData {
        return this.context;
    }
    protected getdb(): Db {
        return this.context.db!;
    }
    //Listar informacion
    protected async list(collection: string, listElement: string, page: number = 1, itemsPage: number = 20, filter: object = {active: {$ne: false}}) {
        try {

            const paginationData = await pagination(this.getdb(),collection,page,itemsPage, filter);
            return {
                info: {
                page: paginationData.page,
                pages: paginationData.pages,
                itemsPage: paginationData.itemsPage,
                total: paginationData.total
                },
                status: true,
                message: `Lista de ${listElement} correctamente cargada`,
                items: await findElement(this.getdb(), collection, filter,paginationData),
            };
        } catch (error) {
            return {
                info: null,
                status: false,
                message: `Lista de ${listElement} no cargo: ${error}`,
                items: null
            };
        }
    }
    //Obtener detalles del item
    protected async get(collection: string){
    
        const collectionLabel = collection.toLowerCase();
        try {
            return await findOneElement(this.getdb(),collection,{id: this.variables.id}).then(
                result => {
                    if (result) {
                        return {
                            status: true,
                            message: `${collectionLabel} fue cargada correctamente`,
                            item: result
                        };
                    }
                    return {
                        status: true,
                        message: `${collectionLabel} no aparece nada, parace que ese item no existe`,
                        item: null
                    };
                }
                
            );
        } catch (error) {
            return {
                status: false,
                message: `error inesperado al querer cargar los detalles de ${collectionLabel}`,
                item: null
            };
        }
    }
    protected async who(collection: string, filter: object){
    
        const collectionLabel = collection.toLowerCase();
        
            return await findOneElement(this.getdb(),collection,filter);
        
            }
  

    //añadir item
    protected async add(collection: string, document: object, item: string){
        try {

            return await insertOneElement(this.getdb(),collection,document).then(
                res => {
                    if (res.result.ok === 1) {
                        return {
                            status: true,
                            message: `Se añadio correctamente  el  ${item}.`,
                            item: document
                        };
                    }
                    return {
                        status: false,
                        message: `Error no se a podido insertar el  ${item}. intentalo de nuevo`,
                        item: null
                    };

                }
            );
            
        } catch (error) {
            return {
                status: false,
                message: `Error incesperado al insertar el ${item}. intentalo de nuevo`,
                item: null
            };
        }
    }


    //modificar item
    protected async update(collection: string, filter: object, objectUpdate: object, item: string){
        try {
            return await updateOneElement(
                this.getdb(),
                collection,
                filter,
                objectUpdate
            ).then(
                res => {
                     if (res.result.nModified === 1 && res.result.ok) {
                         return {
                             status: true,
                             message: `Elemento del ${item} actualizado correctamente`,
                             item: Object.assign({}, filter, objectUpdate)
                         };
                     }
                     return {
                        status: false,
                        message: `Elemento del ${item} no se a actualizado. comprueba que estas filtradoo corectamente o simplemente no ahi nada nuevo que actualizar`,
                        item: null
                    };
                }
            );
            
        } catch (error) {
            return {
                status: false,
                message: `Error incesperado al actualizar el ${item}. intentalo de nuevo`,
                item: null
            };
        }
    }

    //eliminar item

    protected async del(collection: string, filter: object, item: string){
        try {

            return await deleteoneElement(this.getdb(), collection, filter).then(
                res => {
                    if (res.deletedCount === 1) {
                        return {
                            status: true,
                            message: `Elemento del ${item} eliminado correctamente`,
                        };
                    }
                    return {
                        status: false,
                        message: `Elemento del ${item} no se ha borrado comprueba el filtro`,
                    };
                }
            );
            
        } catch (error) {
            return {
                status: false,
                message: `Error incesperado al eliminar el ${item}. intentalo de nuevo`,
            }; 
        }
    }
}

export default ResolversOperationsService;