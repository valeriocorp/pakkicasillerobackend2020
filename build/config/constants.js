"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = __importDefault(require("./environment"));
if (process.env.NODE_ENV !== 'production') {
    const env = environment_1.default;
}
exports.SECRET_KEY = process.env.SECRET || 'FranciscoEjemplodetiendaconnodeygraphql';
var COLLECTIONS;
(function (COLLECTIONS) {
    COLLECTIONS["USERS"] = "users";
    COLLECTIONS["COTIZACION"] = "cotizacion";
    COLLECTIONS["PREALERTAS"] = "prealerta";
    COLLECTIONS["ENVIO"] = "envio";
    COLLECTIONS["GENRES"] = "genres";
    COLLECTIONS["TAGS"] = "tags";
})(COLLECTIONS = exports.COLLECTIONS || (exports.COLLECTIONS = {}));
var MESSAGES;
(function (MESSAGES) {
    MESSAGES["TOKEN_VARIFICATION_FAILDES"] = "Token no valido inicias sesion de nuevo";
})(MESSAGES = exports.MESSAGES || (exports.MESSAGES = {}));
var EXPIRETIME;
(function (EXPIRETIME) {
    EXPIRETIME[EXPIRETIME["H1"] = 3600] = "H1";
    EXPIRETIME[EXPIRETIME["H24"] = 86400] = "H24";
    EXPIRETIME[EXPIRETIME["M15"] = 900] = "M15";
    EXPIRETIME[EXPIRETIME["M20"] = 1200] = "M20";
    EXPIRETIME[EXPIRETIME["D3"] = 259200] = "D3";
})(EXPIRETIME = exports.EXPIRETIME || (exports.EXPIRETIME = {}));
var ACTIVE_VALUES_FILTER;
(function (ACTIVE_VALUES_FILTER) {
    ACTIVE_VALUES_FILTER["ALL"] = "ALL";
    ACTIVE_VALUES_FILTER["INACTIVE"] = "INACTIVE";
    ACTIVE_VALUES_FILTER["ACTIVE"] = "ACTIVE";
})(ACTIVE_VALUES_FILTER = exports.ACTIVE_VALUES_FILTER || (exports.ACTIVE_VALUES_FILTER = {}));
