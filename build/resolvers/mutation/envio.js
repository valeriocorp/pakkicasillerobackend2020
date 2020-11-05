"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const envios_service_1 = __importDefault(require("../../services/envios.service"));
const resolversEnvioMutation = {
    Mutation: {
        addEnvio(_, variables, context) {
            return new envios_service_1.default(_, variables, context).insert();
        },
        updateEnvio(_, variables, context) {
            return new envios_service_1.default(_, variables, context).modify();
        },
        deleteEnvio(_, variables, context) {
            return new envios_service_1.default(_, variables, context).delete();
        },
        blockEnvio(_, { id, unblock, admin }, context) {
            return new envios_service_1.default(_, { id, unblock, admin }, context).block(unblock, admin);
        },
    },
};
exports.default = resolversEnvioMutation;
