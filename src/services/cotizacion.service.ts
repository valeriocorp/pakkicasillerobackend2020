import { ACTIVE_VALUES_FILTER, COLLECTIONS } from './../config/constants';
import { findOneElement, asignDocumentId } from './../lib/db-operations';
import { IContextData } from '../interfaces/context-data.interface';
import slugify from 'slugify';
const trmcol = require('trmcol');
import ResolversOperationsService from './resolvers-operations.services';
class CotizacionService extends ResolversOperationsService {
    trmdia:string = '';
    collection = COLLECTIONS.COTIZACION;
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }
     //Lista de cotizacion
     async items(active: string = ACTIVE_VALUES_FILTER.ACTIVE, id: string) {
        const filterquien = {id: id};
        const quien = await this.who(COLLECTIONS.USERS,filterquien);
       
        if (quien.role === 'ADMIN') {
            let filter: object = {active: {$ne: false}};
            if (active === ACTIVE_VALUES_FILTER.ALL) {
                filter = {};
            } else if(active === ACTIVE_VALUES_FILTER.INACTIVE) {
                filter = {active: {$eq: false}};
            }
            const page = this.getVariables().pagination?.page;
            const itemsPage = this.getVariables().pagination?.itemsPage;
    
            const result = await this.list(this.collection, 'cotizacion', page,itemsPage, filter);
            return {
                info: result.info,
                status: result.status,
                message: result.message,
                cotizaciones: result.items
            };
        }
        if (quien.role === 'COMERCIAL') {
            const idcasillero = quien.idCaseillero;
            console.log(idcasillero);
            let filter: object = {'quienCotiza.idCaseillero': idcasillero,active: {$ne: false}};
            let filterAliado: object =  { 'quienCotiza.quien.idCaseillero': idcasillero };
         if (active === ACTIVE_VALUES_FILTER.ALL) {
                filter = {};
            } else if(active === ACTIVE_VALUES_FILTER.INACTIVE) {
                filter = {active: {$eq: false}};
            }
            const page = this.getVariables().pagination?.page;
            const itemsPage = this.getVariables().pagination?.itemsPage;
    
            const result = await this.list(this.collection, 'cotizacion', page,itemsPage, filter);
            const result2 = await this.list(this.collection, 'cotizacion', page,itemsPage, filterAliado);
            const array3 = result.items?.concat(result2.items);
            const total1 = result.info?.total || 0;
            const total2 = result2.info?.total || 0;
            const infoTotal =  total1 + total2;
            result.info!.total = infoTotal;
            return {
                info: result.info,
                status: result.status,
                message: result.message,
                cotizaciones: array3
            };
        }
        if (quien.role === 'CLIENT') {
            console.log('Es un cliente')
            const idcasillero = quien.idCaseillero;
            console.log(idcasillero);
            let filter: object = {'quienCotiza.idCaseillero': idcasillero, active: {$ne: false}};
            if (active === ACTIVE_VALUES_FILTER.ALL) {
                filter = {'quienCotiza.idCaseillero': idcasillero,};
            } else if(active === ACTIVE_VALUES_FILTER.INACTIVE) {
                filter = {'quienCotiza.idCaseillero': idcasillero,active: {$eq: false}};
            }
            const page = this.getVariables().pagination?.page;
            const itemsPage = this.getVariables().pagination?.itemsPage;
    
            const result = await this.list(this.collection, 'cotizacion', page,itemsPage, filter);
            return {
                info: result.info,
                status: result.status,
                message: result.message,
                cotizaciones: result.items
            };
        }
   
    }
    async itemsQuien(){
        const cotizacion = this.getVariables().cotizacion;
        let filter: object = {'quienCotiza.idCaseillero': cotizacion?.quienCotiza?.idCaseillero};
       
        const page = this.getVariables().pagination?.page;
        const itemsPage = this.getVariables().pagination?.itemsPage;

        const result = await this.list(this.collection, 'cotizacion', page,itemsPage, filter);
        return {
            info: result.info,
            status: result.status,
            message: result.message,
            cotizaciones: result.items
        };
    }
    async details() {
        const result = await this.get(this.collection);
        return { status: result.status, message: result.message, tag: result.item };
    }

    async insert() {
        const cotizacion = this.getVariables().cotizacion;
        console.log('cotizacion' + cotizacion);
         //Comprobar que user no es null
         if (cotizacion === null) {
            return {
                status: false,
                message: 'Cotizacion no definido procura definirlo',
                user: null
            };
        }
        // COmprobar que no existe
        const userCheck = await findOneElement(this.getdb(),this.collection,{idCotizacion: cotizacion?.idCotizacion});
        if (userCheck !== null) {
            return {
                status: false,
                message: `La cotiacion ${cotizacion?.idCotizacion} ya existe`,
                user: null
            };
        }   
        // Si valida las opciones anteriores, venir aquí y crear el documento
              //Comprobar el ultimo usuario registrado para asignar ID
              cotizacion!.id = await asignDocumentId(this.getdb(),this.collection, {creationDate: -1});                
               //crear el id de la cotizacion del casillero
               let consecutivo = 1000 + parseInt(cotizacion!.id, 10);
               cotizacion!.idCotizacion = 'PKCOTCO'+ consecutivo;
               //crear la fecha de creacion de la cotizacion
               cotizacion!.creationDate = new Date().toISOString();
               //buscar la trm del dia
               await trmcol.query(cotizacion!.creationDate)
               .then((trm: any) => {
                   cotizacion!.trm = trm.value;
               })
               .catch((err: any) => console.log(err));
               let trmNumber = parseInt(cotizacion!.trm, 10);
               let totalnumber = parseInt(cotizacion!.totalDOL, 10);
               let trmCol = trmNumber * totalnumber;
            //almacenar el dinero en colombianos
               cotizacion!.totalCOl = trmCol.toString();
             //buscar quien hizo la cotizacion
             const filter = {id: cotizacion?.usuarioCotiza};
             const quien = await this.who(COLLECTIONS.USERS,filter);
                cotizacion!.quienCotiza = quien; 
               const result = await this.add(this.collection, cotizacion || {}, 'cotizacion');
               //Guardar el documento registro en la coleccion
               return {
                   status: result.status,
                   message: result.message,
                   cotizacion: result.item
               };
      
    }
    async modify(){
        const cotizacion = this.getVariables().cotizacion;
        //Comprobar que user no es nulo
        if (cotizacion === null) {
            return {
                status: false,
                message: 'Cotizacion no definido procura definirlo',
                user: null
            };
        }
        const filter = {id: cotizacion?.id};
        const result = await this.update(this.collection, filter, cotizacion || {}, 'cotizacion');
        return {
            status: result.status,
            message: result.message,
            user: result.item
        };
    }

     //Borrar la cotizacion seleccionado
     async delete() {
        const id = this.getVariables().id;
        if (id === undefined || id === '') {
            return {
                status: false,
                message: 'Identificador de la cotizacion no definido procura definirlo para eliminar la cotizacion',
                cotizacion: null
            };
        }
        const result = await this.del(this.collection, {id}, 'cotizacion');
        return {
            status: result.status,
            message: result.message
        };
    }

    async block(unblock: boolean, admin: boolean){
        
        const id = this.getVariables().id;
        const cotizacion = this.getVariables().cotizacion;
        if (!this.checkData(String(id) || '')) {
            
            return {
                status: false,
                message: 'El ID de la cotizacion no se ha especificado correctamente',
                genre: null
            };
            
        }
        
        let update = {active: unblock};
        const result = await this.update(this.collection, {id}, update, 'cotizacion');
        const action = (unblock) ? 'Desbloqueado' : 'Bloqueado';
        return {
            status: result.status,
            message: (result.status) ? `${action} correctamente` : `No se ha ${action.toLowerCase()} comprobar`,
        };
    }
    private checkData(value: string) {
        return (value === '' || value === undefined) ? false: true;
    }
    
}

export default CotizacionService;