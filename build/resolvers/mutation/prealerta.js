"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prealertas_service_1 = __importDefault(require("../../services/prealertas.service"));
const resolversPrealertaMutation = {
    Mutation: {
        addPrealerta(_, variables, context) {
            return new prealertas_service_1.default(_, variables, context).insert();
        },
        updatePrealerta(_, variables, context) {
            return new prealertas_service_1.default(_, variables, context).modify();
        },
        deletePrealerta(_, variables, context) {
            return new prealertas_service_1.default(_, variables, context).delete();
        },
        blockPrealerta(_, { id, unblock, admin }, context) {
            return new prealertas_service_1.default(_, { id, unblock, admin }, context).block(unblock, admin);
        },
    },
};
exports.default = resolversPrealertaMutation;
