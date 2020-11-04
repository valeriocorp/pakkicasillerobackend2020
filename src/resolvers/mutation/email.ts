import { IResolvers } from 'apollo-server-express';
import transport from '../../config/mailer';
import JWT from '../../lib/jwt';
import { EXPIRETIME, MESSAGES, COLLECTIONS } from '../../config/constants';
import UsersService from '../../services/user.service';
import { findOneElement, updateOneElement } from '../../lib/db-operations';
import bcrypt  from 'bcrypt';
import MailService from '../../services/mail.service';
import PasswordService from '../../services/password.service';



const resolversEmailMutation: IResolvers = {
    Mutation: {

        async sendEmail(_, {mail}){
          
                return new MailService().send(mail);
        },

        async activeUserEmail(_, {id, email}){
          
            return new UsersService(_, {user: {id,email}}, {}).active();
        },

        async activeUserAction(_, {id, birthday, password}, {token, db}) {
              //verificar token
              const verify = verifyToken(token, id);
              if (verify?.status === false) {
                  return {
                      status: false,
                      message: verify.message
                  };
              }
         
            return new UsersService(_,{id, user: {birthday, password}}, {token, db}).unblock(true, false);
        },

        async resetPassword(_, {email},{db}) {
     
            return new PasswordService(_, {user: {email}}, {db}).sendEmail();
        },
        async changePassword(_,{id, password},{db, token}){
            //verificar token
            const verify = verifyToken(token, id);
            if (verify?.status === false) {
                return {
                    status: false,
                    message: verify.message
                };
            }
           return new PasswordService(_, {user: {id, password}},{db}).change();
         
        }
    }};

function verifyToken(token: string, id: string){
       //primero verifico que el token no ha expirado
       const checkToken = new JWT().verify(token);
       if (checkToken === MESSAGES.TOKEN_VARIFICATION_FAILDES) {
           return {
               status: false,
               message: 'El periodo para activar el usuario a finalizado, Contacta con el administrador para mas informacion',
           };
       }
       //si el token es valido, asigno la informacion del usuario
       const user = Object.values(checkToken)[0];
       if (user.id !== id) {
           return{
               status: false,
               message: 'El usuario del token no corresponde al añadido en el argumento'
           };
       }

 
}
export default resolversEmailMutation;    