import { ACTIVE_VALUES_FILTER, COLLECTIONS } from './../config/constants';
import { findOneElement, asignDocumentId } from './../lib/db-operations';
import { IContextData } from '../interfaces/context-data.interface';
import slugify from 'slugify';
const trmcol = require('trmcol');
import ResolversOperationsService from './resolvers-operations.services';
import { ICalculadora } from '../interfaces/calculadora.interface';
class CalculadoraService extends ResolversOperationsService {
    trmdia:string = '';
    
    collection = COLLECTIONS.CALCULADORA;
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
        const result = await this.getCalculadora(this.collection);
        const calculadoraDeterminados: ICalculadora = result.item;
        const calculadoraValores = this.getVariables().calculadora;
        if (calculadoraValores?.cantidad) {
            calculadoraValores.valorSeguro = 0;
            calculadoraValores.fleteNacional = 0;
            calculadoraValores.valorComision = 0;
            //leydolar
            if (calculadoraValores.valor < calculadoraDeterminados.leyDolar) {
              //flete variable
              calculadoraValores.flete = calculadoraDeterminados.fleteVariable;
              calculadoraValores.iva = 0;
              calculadoraValores.arancel = 0;
            }
            if (calculadoraValores.valor >= calculadoraDeterminados.leyDolar) {
              //iva
              calculadoraValores.iva = calculadoraDeterminados.iva/100;
              calculadoraValores.iva = calculadoraValores.valor * calculadoraValores.iva;
              //arancel
              calculadoraValores.arancel = calculadoraValores.valor * calculadoraDeterminados.arancel;
              calculadoraValores.flete = calculadoraDeterminados.fleteVariable;
            }
            //Si es con compra 
            if (calculadoraValores.compramos) {
              //valorComision
              calculadoraValores.valorComision = calculadoraDeterminados.valorComision / 100;
              calculadoraValores.valorComision = calculadoraValores.valor * calculadoraValores.valorComision;
            }
            //condicionMinimoComision
            if (calculadoraValores.valorComision < calculadoraDeterminados.condicionMinimoComision ) {
              //minimoValorComision
              calculadoraValores.valorComision = calculadoraDeterminados.minimoValorComision;
            }
            if (calculadoraValores.nacional) {
              //fleteNacional
              if (calculadoraValores.valor < calculadoraDeterminados.fleteNacional) {
                //valorFleteNacional --- seguroFleteNacional
                calculadoraValores.fleteNacional = calculadoraDeterminados.seguroFleteNacional / 1000;
                let sumaNacional = calculadoraValores.fleteNacional * calculadoraValores.valor; 
                calculadoraValores.fleteNacional = sumaNacional + calculadoraDeterminados.valorFleteNacional;
              }
              if (calculadoraValores.valor >= calculadoraDeterminados.fleteNacional) {
                calculadoraValores.fleteNacional = calculadoraDeterminados.seguroFleteNacional / 1000;
                let sumaNacional = calculadoraValores.fleteNacional * calculadoraValores.valor; 
                calculadoraValores.fleteNacional = sumaNacional + calculadoraDeterminados.valorFleteNacional;


              }
         //     this.calculadora.total = this.calculadora.flete * this.calculadora.cantidad + this.valorNacional;
            }
            if (calculadoraValores.seguro) {
              //BaseSeguro
              calculadoraValores.valorSeguro = calculadoraValores.valor / calculadoraDeterminados.BaseSeguro;
              //valorSeguro
              calculadoraValores.valorSeguro = calculadoraValores.valorSeguro * calculadoraDeterminados.valorSeguro;
         }
         let impuestos = calculadoraValores.iva + calculadoraValores.arancel;
            console.log('Impuestos: ' + impuestos * calculadoraValores.cantidadArticulo);
            console.log('flete: ' + calculadoraValores.flete * calculadoraValores.cantidadArticulo);
            console.log('Cantidad: ' + calculadoraValores.cantidadArticulo) ;
            console.log('Seguro: ' + calculadoraValores.valorSeguro *  calculadoraValores.cantidadArticulo);
            console.log('Nacional: ' + calculadoraValores.fleteNacional *  calculadoraValores.cantidadArticulo);
            console.log('comision: ' + calculadoraValores.valorComision *  calculadoraValores.cantidadArticulo);
      
            calculadoraValores.total = calculadoraValores.flete + calculadoraValores.valorSeguro + calculadoraValores.fleteNacional + calculadoraValores.valorComision;
            calculadoraValores.total = calculadoraValores.total * calculadoraValores.cantidadArticulo;
            console.log('total: ' + calculadoraValores.total);
            const calculadoraObject = {
                iva: impuestos * calculadoraValores.cantidadArticulo,
                peso : calculadoraValores?.peso,
                cantidad : calculadoraValores?.cantidad,
                valor : calculadoraValores?.valor,
                flete : calculadoraValores.flete * calculadoraValores?.cantidadArticulo,
                total : calculadoraValores.total,
                cantidadArticulo : calculadoraValores?.cantidadArticulo,
                valorLibra : calculadoraDeterminados.valorLibra,
                leyDolar : calculadoraDeterminados?.leyDolar,
                reglaLibra : calculadoraDeterminados.reglaLibra,
                compramos : calculadoraValores.compramos,
                valorComision: calculadoraValores.valorComision *  calculadoraValores.cantidadArticulo,
                fleteVariable : calculadoraDeterminados?.fleteVariable,
                maxValor :calculadoraDeterminados.maxValor,
                maxPeso : calculadoraDeterminados.maxPeso,
                arancel: calculadoraDeterminados?.arancel,
                minimoValorComision : calculadoraDeterminados?.minimoValorComision,
                condicionMinimoComision :  calculadoraDeterminados?.condicionMinimoComision,
                nacional : calculadoraValores.nacional,
                fleteNacional : calculadoraDeterminados.fleteNacional,
                valorFleteNacional : calculadoraValores.fleteNacional *  calculadoraValores.cantidadArticulo,
                seguroFleteNacional : calculadoraDeterminados.seguroFleteNacional,
                seguro : calculadoraValores.seguro,
                BaseSeguro : calculadoraDeterminados.BaseSeguro,
                valorSeguro : calculadoraValores.valorSeguro *  calculadoraValores.cantidadArticulo,
                
            };
                    
        return { status: result.status, message: result.message, calculadora: calculadoraObject };
          }

    }

    async insert() {
        const calculadora = this.getVariables().calculadora;
        console.log('calculadora' + calculadora);
         //Comprobar que user no es null
         if (calculadora === null) {
            return {
                status: false,
                message: 'calculadora no definido procura definirlo',
                user: null
            };
        }
        // COmprobar que no existe
        const userCheck = await findOneElement(this.getdb(),this.collection,{id: calculadora?.id});
        if (userCheck !== null) {
            return {
                status: false,
                message: `La calculadora ${calculadora?.id} ya existe`,
                user: null
            };
        }   
        // Si valida las opciones anteriores, venir aquí y crear el documento
              //Comprobar el ultimo usuario registrado para asignar ID
              calculadora!.id = await asignDocumentId(this.getdb(),this.collection, {creationDate: -1});                

               //buscar la trm del dia
               let trmDia = '';
               await trmcol.query(new Date().toISOString())
               .then((trm: any) => {
                   trmDia = trm.value;
               })
               .catch((err: any) => console.log(err));
 
               const result = await this.add(this.collection, calculadora || {}, 'calculadora');
               //Guardar el documento registro en la coleccion
               return {
                   status: result.status,
                   message: result.message,
                   calculadora: result.item
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

export default CalculadoraService;