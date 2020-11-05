"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_merge_resolvers_1 = __importDefault(require("graphql-merge-resolvers"));
const user_1 = __importDefault(require("./user"));
const product_1 = __importDefault(require("./product"));
const genre_1 = __importDefault(require("./genre"));
const tag_1 = __importDefault(require("./tag"));
const cotizacion_1 = __importDefault(require("./cotizacion"));
const envio_1 = __importDefault(require("./envio"));
const prealerta_1 = __importDefault(require("./prealerta"));
const queryResolvers = graphql_merge_resolvers_1.default.merge([
    user_1.default,
    product_1.default,
    genre_1.default,
    tag_1.default,
    cotizacion_1.default,
    envio_1.default,
    prealerta_1.default
]);
exports.default = queryResolvers;
