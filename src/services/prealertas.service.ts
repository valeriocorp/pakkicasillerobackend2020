import { ACTIVE_VALUES_FILTER, COLLECTIONS } from './../config/constants';
import { findOneElement, asignDocumentId } from './../lib/db-operations';
import { IContextData } from '../interfaces/context-data.interface';
import slugify from 'slugify';
const trmcol = require('trmcol');
import ResolversOperationsService from './resolvers-operations.services';
import MailService from './mail.service';
class PrealertaService extends ResolversOperationsService {
    trmdia:string = '';
    collection = COLLECTIONS.PREALERTAS;
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }
       //Lista de prealerta
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
    
            const result = await this.list(this.collection, 'prealerta', page,itemsPage, filter);
            return {
                info: result.info,
                status: result.status,
                message: result.message,
                prealertas: result.items
            };
        }
        if (quien.role === 'COMERCIAL') {
            const idcasillero = quien.idCaseillero;
            console.log(idcasillero);
            let filter: object = {'quienPrealerta.idCaseillero': idcasillero,active: {$ne: false}};
            let filterAliado: object =  { 'quienPrealerta.quien.idCaseillero': idcasillero };
         if (active === ACTIVE_VALUES_FILTER.ALL) {
                filter = {};
            } else if(active === ACTIVE_VALUES_FILTER.INACTIVE) {
                filter = {active: {$eq: false}};
            }
            const page = this.getVariables().pagination?.page;
            const itemsPage = this.getVariables().pagination?.itemsPage;
    
            const result = await this.list(this.collection, 'prealerta', page,itemsPage, filter);
            const result2 = await this.list(this.collection, 'prealerta', page,itemsPage, filterAliado);
            const array3 = result.items?.concat(result2.items);
            const total1 = result.info?.total || 0;
            const total2 = result2.info?.total || 0;
            const infoTotal =  total1 + total2;
            result.info!.total = infoTotal;
            return {
                info: result.info,
                status: result.status,
                message: result.message,
                prealertas: array3
            };
        }
        if (quien.role === 'CLIENT') {
            console.log('Es un cliente')
            const idcasillero = quien.idCaseillero;
            console.log(idcasillero);
            let filter: object = {'quienPrealerta.idCaseillero': idcasillero, active: {$ne: false}};
            if (active === ACTIVE_VALUES_FILTER.ALL) {
                filter = {'quienPrealerta.idCaseillero': idcasillero,};
            } else if(active === ACTIVE_VALUES_FILTER.INACTIVE) {
                filter = {'quienPrealerta.idCaseillero': idcasillero,active: {$eq: false}};
            }
            const page = this.getVariables().pagination?.page;
            const itemsPage = this.getVariables().pagination?.itemsPage;
    
            const result = await this.list(this.collection, 'prealerta', page,itemsPage, filter);
            return {
                info: result.info,
                status: result.status,
                message: result.message,
                prealertas: result.items
            };
        }
   
    }
    async details() {
        const result = await this.get(this.collection);
        return { status: result.status, message: result.message, tag: result.item };
    }

    async insert() {
        const prealerta = this.getVariables().prealerta;
        console.log('cotizacion' + prealerta);
         //Comprobar que user no es null
         if (prealerta === null) {
            return {
                status: false,
                message: 'prealerta no definido procura definirlo',
                user: null
            };
        }
        // COmprobar que no existe
        const userCheck = await findOneElement(this.getdb(),this.collection,{idprealerta: prealerta?.idprealerta});
        if (userCheck !== null) {
            return {
                status: false,
                message: `La cotiacion ${prealerta?.idprealerta} ya existe`,
                user: null
            };
        }   
        // Si valida las opciones anteriores, venir aquí y crear el documento
              //Comprobar el ultimo usuario registrado para asignar ID
              prealerta!.id = await asignDocumentId(this.getdb(),this.collection, {creationDate: -1});                
               //crear el id de la prealerta del casillero
               let consecutivo = 1000 + parseInt(prealerta!.id, 10);
               prealerta!.idprealerta = 'PKPRECO'+ consecutivo;
               //crear la fecha de creacion de la prealerta
               prealerta!.creationDate = new Date().toISOString();
               //buscar la trm del dia
               await trmcol.query(prealerta!.creationDate)
               .then((trm: any) => {
                prealerta!.trm = trm.value;
               })
               .catch((err: any) => console.log(err));
               let trmNumber = parseInt(prealerta!.trm, 10);
               let totalnumber = parseInt(prealerta!.totalDOL, 10);
               let trmCol = trmNumber * totalnumber;
            //almacenar el dinero en colombianos
            prealerta!.totalCOl = trmCol.toString();
             //buscar quien hizo la prealerta
             const filter = {id: prealerta?.usuarioPrealerta};
             const quien = await this.who(COLLECTIONS.USERS,filter);
                prealerta!.quienPrealerta = quien; 
             //Estado de la prealerta
             prealerta!.state = false;   
               const result = await this.add(this.collection, prealerta || {}, 'prealerta');
               //Envio de correos al cliente quien hizo la prealerta al admin y a su comercial
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
                   prealerta: result.item
               };
      
    }
    async modify(){
        const prealerta = this.getVariables().prealerta;
        //Comprobar que prealerta no es nulo
        if (prealerta === null) {
            return {
                status: false,
                message: 'prealerta no definido procura definirlo',
                prealerta: null
            };
        }
        const filter = {id: prealerta?.id};
        const result = await this.update(this.collection, filter, prealerta || {}, 'prealerta');
        return {
            status: result.status,
            message: result.message,
            prealerta: result.item
        };
    }

     //Borrar la prealerta seleccionado
     async delete() {
        const id = this.getVariables().id;
        if (id === undefined || id === '') {
            return {
                status: false,
                message: 'Identificador de la prealerta no definido procura definirlo para eliminar la prealerta',
                prealerta: null
            };
        }
        const result = await this.del(this.collection, {id}, 'prealerta');
        return {
            status: result.status,
            message: result.message
        };
    }

    async block(unblock: boolean, admin: boolean){
        
        const id = this.getVariables().id;
        const prealerta = this.getVariables().prealerta;
        if (!this.checkData(String(id) || '')) {
            
            return {
                status: false,
                message: 'El ID de la prealerta no se ha especificado correctamente',
                genre: null
            };
            
        }
        
        let update = {active: unblock};
        const result = await this.update(this.collection, {id}, update, 'prealerta');
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

export default PrealertaService;