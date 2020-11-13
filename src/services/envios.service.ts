import { ACTIVE_VALUES_FILTER, COLLECTIONS } from './../config/constants';
import { findOneElement, asignDocumentId } from './../lib/db-operations';
import { IContextData } from '../interfaces/context-data.interface';
import slugify from 'slugify';
const trmcol = require('trmcol');
import ResolversOperationsService from './resolvers-operations.services';
class EnvioService extends ResolversOperationsService {
    //TODO:agregar al objeto envio condicion pago.
    trmdia:string = '';
    collection = COLLECTIONS.ENVIO;
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }
     //Lista de envios
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
    
            const result = await this.list(this.collection, 'envio', page,itemsPage, filter);
            return {
                info: result.info,
                status: result.status,
                message: result.message,
                envios: result.items
            };
        }
        if (quien.role === 'COMERCIAL') {
            const idcasillero = quien.idCaseillero;
            console.log(idcasillero);
            let filter: object = {'quienID': idcasillero,active: {$ne: false}};
            let filterAliado: object =  { 'quienIDAliado': idcasillero ,active: {$ne: false}};
         if (active === ACTIVE_VALUES_FILTER.ALL) {
                filter = {'quienID': idcasillero};
             filterAliado =  { 'quienIDAliado': idcasillero };
            } else if(active === ACTIVE_VALUES_FILTER.INACTIVE) {
              
                 filter = {'quienID': idcasillero, active: {$eq: false}};
                filterAliado =  { 'quienIDAliado': idcasillero ,active: {$eq: false}};
            }
            const page = this.getVariables().pagination?.page;
            const itemsPage = this.getVariables().pagination?.itemsPage;
    
            const result = await this.list(this.collection, 'envio', page,itemsPage, filter);
            const result2 = await this.list(this.collection, 'envio', page,itemsPage, filterAliado);
            const array3 = result.items?.concat(result2.items);
            const total1 = result.info?.total || 0;
            const total2 = result2.info?.total || 0;
            const infoTotal =  total1 + total2;
            result.info!.total = infoTotal;
            return {
                info: result.info,
                status: result.status,
                message: result.message,
                envios: array3
            };
        }
        if (quien.role === 'CLIENT') {
            console.log('Es un cliente')
            const idcasillero = quien.idCaseillero;
            console.log('su casillero' + idcasillero);
            let filter: object = {'quienID': idcasillero, active: {$ne: false}};
            if (active === ACTIVE_VALUES_FILTER.ALL) {
                filter = {'quienID': idcasillero,};
            } else if(active === ACTIVE_VALUES_FILTER.INACTIVE) {
                filter = {'quienID': idcasillero,active: {$eq: false}};
            }
            const page = this.getVariables().pagination?.page;
            const itemsPage = this.getVariables().pagination?.itemsPage;
    
            const result = await this.list(this.collection, 'envio', page,itemsPage, filter);
            return {
                info: result.info,
                status: result.status,
                message: result.message,
                envios: result.items
            };
        }
   
    }
    async details() {
        const result = await this.get(this.collection);
        return { status: result.status, message: result.message, tag: result.item };
    }

    async insert() {
        const envio = this.getVariables().envio;
        console.log('envio' + envio);
         //Comprobar que user no es null
         if (envio === null) {
            return {
                status: false,
                message: 'envio no definido procura definirlo',
                envio: null
            };
        }
        // COmprobar que no existe
        const userCheck = await findOneElement(this.getdb(),this.collection,{idEnvio: envio?.idEnvio});
        if (userCheck !== null) {
            return {
                status: false,
                message: `La cotiacion ${envio?.idEnvio} ya existe`,
                envio: null
            };
        }   
        // Si valida las opciones anteriores, venir aquí y crear el documento
              //Comprobar el ultimo usuario registrado para asignar ID
              envio!.id = await asignDocumentId(this.getdb(),this.collection, {creationDate: -1});                
               //crear el id de la envio del casillero
               let consecutivo = 1000 + parseInt(envio!.id, 10);
               envio!.idEnvio = 'PKCO'+ consecutivo;
               //crear la fecha de creacion de la envio
               envio!.creationDate = new Date().toISOString();
               //buscar la trm del dia
               await trmcol.query(envio!.creationDate)
               .then((trm: any) => {
                envio!.trm = trm.value;
               })
               .catch((err: any) => console.log(err));
               let trmNumber = parseInt(envio!.trm, 10);
               let totalnumber = parseInt(envio!.totalDOL, 10);
               let trmCol = trmNumber * totalnumber;
            //almacenar el dinero en colombianos
            envio!.totalCOl = trmCol.toString();
             //buscar quien hizo la envio
             const filter = {id: envio?.idprealerta};
             const quien = await this.who(COLLECTIONS.USERS,filter);
             envio!.quien = quien.name;
             envio!.quienID = quien.idCaseillero;
             envio!.quienAliado = quien.quien.name; 
             envio!.quienIDAliado = quien.quien.idCaseillero; 

             //Estado de la envio
             envio!.state = true;   
               const result = await this.add(this.collection, envio || {}, 'envio');
               //Envio de correos al cliente quien hizo la envio al admin y a su comercial
               const emailCliente = quien.email;
               console.log('Email del cliente'+emailCliente);
               const emailAdmin = 'valeriocompras@gmail.com';
               const emailAliado = quien.quien.email;
               console.log('email del aliado' + emailAliado);
               if (emailCliente === undefined || emailCliente === '') {
                return {
                    status: false,
                    message: 'El email no se ha definido correctamente'
                };
            }
       //     if (emailAdmin === undefined || emailAdmin === '') {
       //         return {
       //             status: false,
        //            message: 'El email no se ha definido correctamente'
       //         };
        //    }
            if (emailAliado === undefined || emailAliado === '') {
                return {
                    status: false,
                    message: 'El email no se ha definido correctamente'
                };
            }
            console.log('objeto cliente' + quien);
            //TODO: terminar el envio de correos electronicos
            const html = ` `;
            const mail = {
                subject: 'Activar usuario',
                to: emailAdmin,emailAliado,emailCliente,
                html
            };
        //    return new MailService().send(mail); 
    
               //Guardar el documento registro en la coleccion
               return {
                   status: result.status,
                   message: result.message,
                   envio: result.item
               };
      
    }
    async modify(){
        const envio = this.getVariables().envio;
        //Comprobar que user no es nulo
        if (envio === null) {
            return {
                status: false,
                message: 'envio no definido procura definirlo',
                user: null
            };
        }
        const filter = {id: envio?.id};
        const result = await this.update(this.collection, filter, envio || {}, 'envio');
        return {
            status: result.status,
            message: result.message,
            envio: result.item
        };
    }

     //Borrar la cotizacion seleccionado
     async delete() {
        const id = this.getVariables().id;
        if (id === undefined || id === '') {
            return {
                status: false,
                message: 'Identificador del envio no definido procura definirlo para eliminar el envio',
                envio: null
            };
        }
        const result = await this.del(this.collection, {id}, 'envio');
        return {
            status: result.status,
            message: result.message
        };
    }

    async block(unblock: boolean, admin: boolean){
        
        const id = this.getVariables().id;
        const envio = this.getVariables().envio;
        if (!this.checkData(String(id) || '')) {
            
            return {
                status: false,
                message: 'El ID de la envio no se ha especificado correctamente',
                genre: null
            };
            
        }
        
        let update = {active: unblock};
        const result = await this.update(this.collection, {id}, update, 'envio');
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

export default EnvioService;