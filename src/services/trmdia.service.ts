import ResolversOperationsService from './resolvers-operations.services';
import { IContextData } from '../interfaces/context-data.interface';
import { COLLECTIONS } from '../config/constants';
import { findOneElement, asignDocumentId } from '../lib/db-operations';
import slugify from 'slugify';
import { strict } from 'assert';
const trmcol = require('trmcol');
class TrmService extends ResolversOperationsService{
    collection = COLLECTIONS.TRM;
    constructor(root: object, variables: object, context: IContextData){
             super(root, variables, context);
    }

 
    async details(){
        let trmPeso = String;
        let id = this.getVariables().id;
        await trmcol.query(new Date().toISOString())
        .then((trm: any) => {
         trmPeso = trm.value;
        });
        const trmObject = {
            id: '1',
            peso: trmPeso
            
        };
        const result1 = await this.update(this.collection, {id }, trmObject, 'trm');
        const result = await this.get(this.collection);
        return {
            status: result.status,
            message: result.message,
            trm: result.item
        };
    }

    private checkData(value: string){
        return (value === '' || value === undefined) ? false : true;
    }

    private async checkInDatabase(value: string){
        return await findOneElement(this.getdb(), this.collection, {name: value});
    }
 
}

export default TrmService;