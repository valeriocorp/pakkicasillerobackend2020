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
class PrealertaService extends resolvers_operations_services_1.default {
    constructor(root, variables, context) {
        super(root, variables, context);
        this.trmdia = '';
        this.collection = constants_1.COLLECTIONS.PREALERTAS;
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
                const result = yield this.list(this.collection, 'prealerta', page, itemsPage, filter);
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
                let filter = { 'quienPrealerta.idCaseillero': idcasillero, active: { $ne: false } };
                let filterAliado = { 'quienPrealerta.quien.idCaseillero': idcasillero };
                if (active === constants_1.ACTIVE_VALUES_FILTER.ALL) {
                    filter = {};
                }
                else if (active === constants_1.ACTIVE_VALUES_FILTER.INACTIVE) {
                    filter = { active: { $eq: false } };
                }
                const page = (_c = this.getVariables().pagination) === null || _c === void 0 ? void 0 : _c.page;
                const itemsPage = (_d = this.getVariables().pagination) === null || _d === void 0 ? void 0 : _d.itemsPage;
                const result = yield this.list(this.collection, 'prealerta', page, itemsPage, filter);
                const result2 = yield this.list(this.collection, 'prealerta', page, itemsPage, filterAliado);
                const array3 = (_e = result.items) === null || _e === void 0 ? void 0 : _e.concat(result2.items);
                const total1 = ((_f = result.info) === null || _f === void 0 ? void 0 : _f.total) || 0;
                const total2 = ((_g = result2.info) === null || _g === void 0 ? void 0 : _g.total) || 0;
                const infoTotal = total1 + total2;
                result.info.total = infoTotal;
                return {
                    info: result.info,
                    status: result.status,
                    message: result.message,
                    prealertas: array3
                };
            }
            if (quien.role === 'CLIENT') {
                console.log('Es un cliente');
                const idcasillero = quien.idCaseillero;
                console.log(idcasillero);
                let filter = { 'quienPrealerta.idCaseillero': idcasillero, active: { $ne: false } };
                if (active === constants_1.ACTIVE_VALUES_FILTER.ALL) {
                    filter = { 'quienPrealerta.idCaseillero': idcasillero, };
                }
                else if (active === constants_1.ACTIVE_VALUES_FILTER.INACTIVE) {
                    filter = { 'quienPrealerta.idCaseillero': idcasillero, active: { $eq: false } };
                }
                const page = (_h = this.getVariables().pagination) === null || _h === void 0 ? void 0 : _h.page;
                const itemsPage = (_j = this.getVariables().pagination) === null || _j === void 0 ? void 0 : _j.itemsPage;
                const result = yield this.list(this.collection, 'prealerta', page, itemsPage, filter);
                return {
                    info: result.info,
                    status: result.status,
                    message: result.message,
                    prealertas: result.items
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
            const prealerta = this.getVariables().prealerta;
            console.log('cotizacion' + prealerta);
            if (prealerta === null) {
                return {
                    status: false,
                    message: 'prealerta no definido procura definirlo',
                    user: null
                };
            }
            const userCheck = yield db_operations_1.findOneElement(this.getdb(), this.collection, { idprealerta: prealerta === null || prealerta === void 0 ? void 0 : prealerta.idprealerta });
            if (userCheck !== null) {
                return {
                    status: false,
                    message: `La cotiacion ${prealerta === null || prealerta === void 0 ? void 0 : prealerta.idprealerta} ya existe`,
                    user: null
                };
            }
            prealerta.id = yield db_operations_1.asignDocumentId(this.getdb(), this.collection, { creationDate: -1 });
            let consecutivo = 1000 + parseInt(prealerta.id, 10);
            prealerta.idprealerta = 'PKPRECO' + consecutivo;
            prealerta.creationDate = new Date().toISOString();
            yield trmcol.query(prealerta.creationDate)
                .then((trm) => {
                prealerta.trm = trm.value;
            })
                .catch((err) => console.log(err));
            let trmNumber = parseInt(prealerta.trm, 10);
            let totalnumber = parseInt(prealerta.totalDOL, 10);
            let trmCol = trmNumber * totalnumber;
            prealerta.totalCOl = trmCol.toString();
            const filter = { id: prealerta === null || prealerta === void 0 ? void 0 : prealerta.usuarioPrealerta };
            const quien = yield this.who(constants_1.COLLECTIONS.USERS, filter);
            prealerta.quienPrealerta = quien;
            prealerta.state = false;
            const result = yield this.add(this.collection, prealerta || {}, 'prealerta');
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
                prealerta: result.item
            };
        });
    }
    modify() {
        return __awaiter(this, void 0, void 0, function* () {
            const prealerta = this.getVariables().prealerta;
            if (prealerta === null) {
                return {
                    status: false,
                    message: 'prealerta no definido procura definirlo',
                    prealerta: null
                };
            }
            const filter = { id: prealerta === null || prealerta === void 0 ? void 0 : prealerta.id };
            const result = yield this.update(this.collection, filter, prealerta || {}, 'prealerta');
            return {
                status: result.status,
                message: result.message,
                prealerta: result.item
            };
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.getVariables().id;
            if (id === undefined || id === '') {
                return {
                    status: false,
                    message: 'Identificador de la prealerta no definido procura definirlo para eliminar la prealerta',
                    prealerta: null
                };
            }
            const result = yield this.del(this.collection, { id }, 'prealerta');
            return {
                status: result.status,
                message: result.message
            };
        });
    }
    block(unblock, admin) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.getVariables().id;
            const prealerta = this.getVariables().prealerta;
            if (!this.checkData(String(id) || '')) {
                return {
                    status: false,
                    message: 'El ID de la prealerta no se ha especificado correctamente',
                    genre: null
                };
            }
            let update = { active: unblock };
            const result = yield this.update(this.collection, { id }, update, 'prealerta');
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
exports.default = PrealertaService;
