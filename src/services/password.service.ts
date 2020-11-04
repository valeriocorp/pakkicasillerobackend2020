
import { COLLECTIONS, EXPIRETIME } from '../config/constants';
import { IContextData } from '../interfaces/context-data.interface';
import { findOneElement, updateOneElement } from '../lib/db-operations';
import JWT from '../lib/jwt';
import MailService from './mail.service';
import ResolversOperationsService from './resolvers-operations.services';
import bcrypt from 'bcrypt';



class PasswordService extends ResolversOperationsService {
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }
    
    async sendEmail() {
        const email = this.getVariables().user?.email || '';
        if (email === undefined || email === '') {
            return {
                status: false,
                message: 'El email no se ha definido correctamente'
            }
        }

               //coger informacion del usuario
               const user = await findOneElement(this.getdb(), COLLECTIONS.USERS, {email});
               console.log(user);
               //si el usuario es indefinido mandar mensaje de que no existe
               if (user === undefined || user === null) {
                   return {
                       status: false,
                       message: `Usuario con el email ${email} no existe`
                   };
               }
              const newUser = {
                  id: user.id,
                  email
              } 
              const token = new JWT().sing({user: newUser}, EXPIRETIME.M15);
              const html = `Para cambiar la contraseña has click sobre esto: <a href="${process.env.CLIENT_URL}/#/reset/${token}">Click aqui</a> `;
              const mail = {
                  to: email,
                  subject: 'Peticion para cambiar la contraseña',
                  html
              };
              return new MailService().send(mail); 
    }
    async change(){
        const id = this.getVariables().user?.id;
        let password = this.getVariables().user?.password;
         //comproar que el id es correcto
         if (id === undefined || id ==='') {
            return {
            status: false,
            message: 'El id necesia una informacion correcta'
            };
        }
        //comproar que el password es correcto
        if (password === undefined || password ==='' || password === '1234') {
            return {
            status: false,
            message: 'El password necesia una informacion correcta'
            };
        }
        //encriptar el password
        password = bcrypt.hashSync(password, 10);
        //actualizar en el id seleccionado de la coleccion usuarios
       const result = await this.update(COLLECTIONS.USERS, {id}, {password}, 'users');

       return {
           status: result.status,
           message: (result.status) ? 'Contraseña cambiada correctamente' : result.message,

       };
    }
}


export default PasswordService;