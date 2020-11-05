import ResolversOperationsService from './resolvers-operations.services';
import { COLLECTIONS, EXPIRETIME, MESSAGES, ACTIVE_VALUES_FILTER } from '../config/constants';
import { IContextData } from '../interfaces/context-data.interface';
import { findOneElement, asignDocumentId } from '../lib/db-operations';
import bcrypt from 'bcrypt';
import JWT from '../lib/jwt';
import { debug } from 'console';
import MailService from './mail.service';


class UsersService extends ResolversOperationsService{
 //TODO: Los usuarios comerciales pueden editar y crear usuarios normales pero no borrarlos 
 
    private collection = COLLECTIONS.USERS;
    constructor(root: object, variables: object, context: IContextData){
             super(root, variables, context);
    }
    //Lista de usuarios
    async items(active: string = ACTIVE_VALUES_FILTER.ACTIVE) {
        console.log('Service: ', active);
        let filter: object = {active: {$ne: false}};
        if (active === ACTIVE_VALUES_FILTER.ALL) {
            filter = {};
        } else if(active === ACTIVE_VALUES_FILTER.INACTIVE) {
            filter = {active: {$eq: false}};
        }
        const page = this.getVariables().pagination?.page;
        const itemsPage = this.getVariables().pagination?.itemsPage;

        const result = await this.list(this.collection, 'usuarios', page,itemsPage, filter);
        return {
            info: result.info,
            status: result.status,
            message: result.message,
            users: result.items
        };
    }
    //autenticarnos
    async auth() {
        let info = new JWT().verify(this.getContext().token!);
        if (info === MESSAGES.TOKEN_VARIFICATION_FAILDES) {
            return {
                status: false,
                message: info,
                user: null
            };
        }
        return {
            status: true,
            message: 'Usuario autenticado correctamente',
            user: Object.values(info)[0]
        };
    }
    //iniciar sesion
    async login(){
        try {
            const variables = this.getVariables().user;
            const user = await findOneElement(this.getdb(),this.collection, {email: variables?.email});

            if (user === null) {
                return {
                     status: false,
                     message: 'usuario no existe',
                     token: null
                };
                
            }
            const passwordCheck =bcrypt.compareSync(variables?.password,user.password);

            if (passwordCheck !== null) {
                delete user.password;
                delete user.birthday;
                delete user.registerDate;

            }
            return {
                status: passwordCheck,
                message: 
                !passwordCheck
                ? 'Password y usuarios no son correctos, sesion no iniciada' 
                : 'Sesion iniciada correctamente',
                token: 
                !passwordCheck
                ? null 
                : new JWT().sing({user}),
                user:  !passwordCheck
                ? null 
                : user,
            };
        } catch (error) {
            console.log(error);
            return {
                status: false,
                message: 'Error al cargar el usuario. comprueba que tienes correctamente todo',
                token: null,
            };
            
        }
    }

    //registar un usuario
    async register(){

            const user = this.getVariables().user;
            
            //Comprobar que user no es null
            if (user === null) {
                return {
                    status: false,
                    message: 'Usuario no definido procura definirlo',
                    user: null
                };
            }

            if (user?.password === null || user?.password === undefined || user?.password === '') {
                return {
                    status: false,
                    message: 'Usuario sin contraseña correcta procura definirlo',
                    user: null
                };
            }

            //Comprobar que el usuario no existe
            const userCheck = await findOneElement(this.getdb(),this.collection,{email: user?.email});
            if (userCheck !== null) {
                return {
                    status: false,
                    message: `El email ${user?.email} ya existe intenta iniciar sesion`,
                    user: null
                };
            }            
            //TODO: comprobar si fue creado por alguien si no entonces agregarle el id del admin como aliado.
            //Comprobar el ultimo usuario registrado para asignar ID
            user!.id = await asignDocumentId(this.getdb(),this.collection, {registerDate: -1});                
            //Asignar la fecha de en formato ISO en la propiedad registarDate
            user!.registerDate = new Date().toISOString();
            //encriptar contraseña
            user!.password = bcrypt.hashSync(user!.password, 10);
            //Creando el id del casillero
            let consecutivo = 1000 + parseInt(user.id, 10);
            user!.idCaseillero = 'PAKKICO' + new Date().getFullYear().toString() + consecutivo;
            //asociacion de un aliado
            if (user?.aliado === null || user?.aliado === undefined || user?.aliado === '') {
                user!.aliado = '5';
            }
                  //buscar quien hizo la cotizacion
                  const filter = {id: user?.aliado};
                  const quien = await this.who(COLLECTIONS.USERS,filter);
                     user!.quien = quien; 
            const result = await this.add(this.collection, user || {}, 'usuario');
            //Guardar el documento registro en la coleccion
            return {
                status: result.status,
                message: result.message,
                user: result.item
            };
    }

    //Modificar un usuario
    async modify(){
        const user = this.getVariables().user;
        //Comprobar que user no es nulo
        if (user === null) {
            return {
                status: false,
                message: 'Usuario no definido procura definirlo',
                user: null
            };
        }
        const filter = {id: user?.id};
        const result = await this.update(this.collection, filter, user || {}, 'usuerio');
        return {
            status: result.status,
            message: result.message,
            user: result.item
        };
    }

    async unblock(unblock: boolean, admin: boolean){
        
        const id = this.getVariables().id;
        const user = this.getVariables().user;
        if (!this.checkData(String(id) || '')) {
            
            return {
                status: false,
                message: 'El ID del usuario no se ha especificado correctamente',
                genre: null
            };
            
        }
        if (user?.password === '1234') {
            return {
                status: false,
                message: 'En este caso no podemos activar por que no has cambiado el password'
            }
        }
        let update = {active: unblock};
        if (unblock && !admin) {
            update = Object.assign({},{active: true}, {birthday: user?.birthday, password: bcrypt.hashSync(user!.password, 10)});
        }
        console.log(update);
        const result = await this.update(this.collection, {id}, update, 'usuario');
        const action = (unblock) ? 'Desbloqueado' : 'Bloqueado';
        return {
            status: result.status,
            message: (result.status) ? `${action} correctamente` : `No se ha ${action.toLowerCase()} comprobar`,
        };
    }

    async active() {
        const id = this.getVariables().user?.id;
        const email = this.getVariables().user?.email || '';
        if (email === undefined || email === '') {
            return {
                status: false,
                message: 'El email no se ha definido correctamente'
            };
        }
        const token = new JWT().sing({user: {id, email}}, EXPIRETIME.H1);
            const html = `Para activar la cuenta has click sobre esto: <a href="${process.env.CLIENT_URL}/#/active/${token}">Click aqui</a> `;
            const mail = {
                subject: 'Activar usuario',
                to: email,
                html
            };
            return new MailService().send(mail); 
    }

    //Borrar el usuario seleccionado
    async delete() {
        const id = this.getVariables().id;
        if (id === undefined || id === '') {
            return {
                status: false,
                message: 'Identificador del Usuario no definido procura definirlo para eliminar el usuario',
                user: null
            };
        }
        const result = await this.del(this.collection, {id}, 'usuario');
        return {
            status: result.status,
            message: result.message
        };
    }
    private checkData(value: string){
        return (value === '' || value === undefined) ? false : true;
    }
}    


export default UsersService;