import { IUser } from './user.interface';
import { IPaginationOptions } from './pagination-options.interface';
import { ICotizacion } from './cotisazion.interface';
import { IPrealertas } from './prealerta.interface';
import { IEnvio } from './envio.interface';
export interface IVariables {
    id?: string | number;
    genre?: string;
    tag?: string;
    user?: IUser;
    prealerta?: IPrealertas;
    envio?: IEnvio;
    cotizacion?: ICotizacion;
    pagination?: IPaginationOptions;
}