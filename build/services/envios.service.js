"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./../config/constants");
const db_operations_1 = require("./../lib/db-operations");
const trmcol = require('trmcol');
const resolvers_operations_services_1 = __importDefault(require("./resolvers-operations.services"));
class EnvioService extends resolvers_operations_services_1.default {
    constructor(root, variables, context) {
        super(root, variables, context);
        this.trmdia = '';
        this.collection = constants_1.COLLECTIONS.ENVIO;
    }
    items(active = constants_1.ACTIVE_VALUES_FILTER.ACTIVE, id) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            const filterquien = { id: id };
            const quien = yield this.who(constants_1.COLLECTIONS.USERS, filterquien);
            if (quien.role === 'ADMIN') {
                let filter = { active: { $ne: false } };
                if (active === constants_1.ACTIVE_VALUES_FILTER.ALL) {
                    filter = {};
                }
                else if (active === constants_1.ACTIVE_VALUES_FILTER.INACTIVE) {
                    filter = { active: { $eq: false } };
                }
                const page = (_a = this.getVariables().pagination) === null || _a === void 0 ? void 0 : _a.page;
                const itemsPage = (_b = this.getVariables().pagination) === null || _b === void 0 ? void 0 : _b.itemsPage;
                const result = yield this.list(this.collection, 'envio', page, itemsPage, filter);
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
                let filter = { 'quienEnvia.idCaseillero': idcasillero, active: { $ne: false } };
                let filterAliado = { 'quienEnvia.quien.idCaseillero': idcasillero, active: { $ne: false } };
                if (active === constants_1.ACTIVE_VALUES_FILTER.ALL) {
                    filter = { 'quienEnvia.idCaseillero': idcasillero };
                    filterAliado = { 'quienEnvia.quien.idCaseillero': idcasillero };
                }
                else if (active === constants_1.ACTIVE_VALUES_FILTER.INACTIVE) {
                    filter = { 'quienEnvia.idCaseillero': idcasillero, active: { $eq: false } };
                    filterAliado = { 'quienEnvia.quien.idCaseillero': idcasillero, active: { $eq: false } };
                }
                const page = (_c = this.getVariables().pagination) === null || _c === void 0 ? void 0 : _c.page;
                const itemsPage = (_d = this.getVariables().pagination) === null || _d === void 0 ? void 0 : _d.itemsPage;
                const result = yield this.list(this.collection, 'envio', page, itemsPage, filter);
                const result2 = yield this.list(this.collection, 'envio', page, itemsPage, filterAliado);
                const array3 = (_e = result.items) === null || _e === void 0 ? void 0 : _e.concat(result2.items);
                const total1 = ((_f = result.info) === null || _f === void 0 ? void 0 : _f.total) || 0;
                const total2 = ((_g = result2.info) === null || _g === void 0 ? void 0 : _g.total) || 0;
                const infoTotal = total1 + total2;
                result.info.total = infoTotal;
                return {
                    info: result.info,
                    status: result.status,
                    message: result.message,
                    envios: array3
                };
            }
            if (quien.role === 'CLIENT') {
                console.log('Es un cliente');
                const idcasillero = quien.idCaseillero;
                console.log(idcasillero);
                let filter = { 'quienEnvia.idCaseillero': idcasillero, active: { $ne: false } };
                if (active === constants_1.ACTIVE_VALUES_FILTER.ALL) {
                    filter = { 'quienEnvia.idCaseillero': idcasillero, };
                }
                else if (active === constants_1.ACTIVE_VALUES_FILTER.INACTIVE) {
                    filter = { 'quienEnvia.idCaseillero': idcasillero, active: { $eq: false } };
                }
                const page = (_h = this.getVariables().pagination) === null || _h === void 0 ? void 0 : _h.page;
                const itemsPage = (_j = this.getVariables().pagination) === null || _j === void 0 ? void 0 : _j.itemsPage;
                const result = yield this.list(this.collection, 'envio', page, itemsPage, filter);
                return {
                    info: result.info,
                    status: result.status,
                    message: result.message,
                    envios: result.items
                };
            }
        });
    }
    details() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.get(this.collection);
            return { status: result.status, message: result.message, tag: result.item };
        });
    }
    insert() {
        return __awaiter(this, void 0, void 0, function* () {
            const envio = this.getVariables().envio;
            console.log('envio' + envio);
            if (envio === null) {
                return {
                    status: false,
                    message: 'envio no definido procura definirlo',
                    envio: null
                };
            }
            const userCheck = yield db_operations_1.findOneElement(this.getdb(), this.collection, { idEnvio: envio === null || envio === void 0 ? void 0 : envio.idEnvio });
            if (userCheck !== null) {
                return {
                    status: false,
                    message: `La cotiacion ${envio === null || envio === void 0 ? void 0 : envio.idEnvio} ya existe`,
                    envio: null
                };
            }
            envio.id = yield db_operations_1.asignDocumentId(this.getdb(), this.collection, { creationDate: -1 });
            let consecutivo = 1000 + parseInt(envio.id, 10);
            envio.idEnvio = 'PKCO' + consecutivo;
            envio.creationDate = new Date().toISOString();
            yield trmcol.query(envio.creationDate)
                .then((trm) => {
                envio.trm = trm.value;
            })
                .catch((err) => console.log(err));
            let trmNumber = parseInt(envio.trm, 10);
            let totalnumber = parseInt(envio.totalDOL, 10);
            let trmCol = trmNumber * totalnumber;
            envio.totalCOl = trmCol.toString();
            const filter = { id: envio === null || envio === void 0 ? void 0 : envio.idprealerta };
            const quien = yield this.who(constants_1.COLLECTIONS.USERS, filter);
            envio.quienEnvia = quien;
            envio.state = true;
            const result = yield this.add(this.collection, envio || {}, 'envio');
            const emailCliente = quien.email;
            console.log('Email del cliente' + emailCliente);
            const emailAdmin = 'valeriocompras@gmail.com';
            const emailAliado = quien.quien.email;
            console.log('email del aliado' + emailAliado);
            if (emailCliente === undefined || emailCliente === '') {
                return {
                    status: false,
                    message: 'El email no se ha definido correctamente'
                };
            }
            if (emailAliado === undefined || emailAliado === '') {
                return {
                    status: false,
                    message: 'El email no se ha definido correctamente'
                };
            }
            console.log('objeto cliente' + quien);
            const html = ` `;
            const mail = {
                subject: 'Activar usuario',
                to: emailAdmin, emailAliado, emailCliente,
                html
            };
            return {
                status: result.status,
                message: result.message,
                envio: result.item
            };
        });
    }
    modify() {
        return __awaiter(this, void 0, void 0, function* () {
            const envio = this.getVariables().envio;
            if (envio === null) {
                return {
                    status: false,
                    message: 'envio no definido procura definirlo',
                    user: null
                };
            }
            const filter = { id: envio === null || envio === void 0 ? void 0 : envio.id };
            const result = yield this.update(this.collection, filter, envio || {}, 'envio');
            return {
                status: result.status,
                message: result.message,
                envio: result.item
            };
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.getVariables().id;
            if (id === undefined || id === '') {
                return {
                    status: false,
                    message: 'Identificador del envio no definido procura definirlo para eliminar el envio',
                    envio: null
                };
            }
            const result = yield this.del(this.collection, { id }, 'envio');
            return {
                status: result.status,
                message: result.message
            };
        });
    }
    block(unblock, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.getVariables().id;
            const envio = this.getVariables().envio;
            if (!this.checkData(String(id) || '')) {
                return {
                    status: false,
                    message: 'El ID de la envio no se ha especificado correctamente',
                    genre: null
                };
            }
            let update = { active: unblock };
            const result = yield this.update(this.collection, { id }, update, 'envio');
            const action = (unblock) ? 'Desbloqueado' : 'Bloqueado';
            return {
                status: result.status,
                message: (result.status) ? `${action} correctamente` : `No se ha ${action.toLowerCase()} comprobar`,
            };
        });
    }
    checkData(value) {
        return (value === '' || value === undefined) ? false : true;
    }
}
exports.default = EnvioService;
