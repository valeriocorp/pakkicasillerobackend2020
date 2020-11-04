import { IUser } from './user.interface';
export interface ICotizacion{
    id?: string;
    idCotizacion?: string;
    peso?: string;
    cantidad?: string;
    precio?: string;
    tipoProducto?:string;
    compra?: boolean;
    usuarioCotiza?: string;
    quienCotiza?: IUser;
    servicio?: string;
    seguro?: boolean;
    creationDate: string;
    totalDOL: string;
    totalCOl: string;
    flete: string;
    impuesto: string;
    url: string;
    trm: string;
}
