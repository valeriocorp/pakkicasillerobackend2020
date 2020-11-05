"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cotizacion_service_1 = __importDefault(require("../../services/cotizacion.service"));
const resolversCotizacionesMutation = {
    Mutation: {
        addCotizacion(_, variables, context) {
            return new cotizacion_service_1.default(_, variables, context).insert();
        },
        updateCotizacion(_, variables, context) {
            return new cotizacion_service_1.default(_, variables, context).modify();
        },
        deleteCotizacion(_, variables, context) {
            return new cotizacion_service_1.default(_, variables, context).delete();
        },
        blockCotizacion(_, { id, unblock, admin }, context) {
            return new cotizacion_service_1.default(_, { id, unblock, admin }, context).block(unblock, admin);
        },
    },
};
exports.default = resolversCotizacionesMutation;
