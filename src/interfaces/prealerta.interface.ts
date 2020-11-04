import { IUser } from "./user.interface";

export interface IPrealertas{
    id: string;
    idCotizacion: string;
    idprealerta: string;
    peso: string;
    cantidad: string;
    precio: string;
    tipoProducto:string;
    compra: boolean;
    usuarioCotiza: string;
    servicio: string;
    seguro: boolean;
    creationDate: string;
    totalDOL: string;
    totalCOl: string;
    flete: string;
    impuesto: string;
    url: string;
    trm: string;
    quienCotiza: IUser;
    descripcion: string;
    active: boolean;
    tienda: string;
    shipping: string;
    oderNumber: string;
    tracking: string;
    factura: string;
    productQty: string;
    state: boolean;
    usuarioPrealerta: string;
    quienPrealerta: IUser;
}
