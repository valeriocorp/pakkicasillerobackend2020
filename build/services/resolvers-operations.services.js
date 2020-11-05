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
Object.defineProperty(exports, "__esModule", { value: true });
const db_operations_1 = require("../lib/db-operations");
const pagination_1 = require("../lib/pagination");
class ResolversOperationsService {
    constructor(root, variables, context) {
        this.variables = variables;
        this.context = context;
    }
    getVariables() {
        return this.variables;
    }
    getContext() {
        return this.context;
    }
    getdb() {
        return this.context.db;
    }
    list(collection, listElement, page = 1, itemsPage = 20, filter = { active: { $ne: false } }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paginationData = yield pagination_1.pagination(this.getdb(), collection, page, itemsPage, filter);
                return {
                    info: {
                        page: paginationData.page,
                        pages: paginationData.pages,
                        itemsPage: paginationData.itemsPage,
                        total: paginationData.total
                    },
                    status: true,
                    message: `Lista de ${listElement} correctamente cargada`,
                    items: yield db_operations_1.findElement(this.getdb(), collection, filter, paginationData),
                };
            }
            catch (error) {
                return {
                    info: null,
                    status: false,
                    message: `Lista de ${listElement} no cargo: ${error}`,
                    items: null
                };
            }
        });
    }
    get(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            const collectionLabel = collection.toLowerCase();
            try {
                return yield db_operations_1.findOneElement(this.getdb(), collection, { id: this.variables.id }).then(result => {
                    if (result) {
                        return {
                            status: true,
                            message: `${collectionLabel} fue cargada correctamente`,
                            item: result
                        };
                    }
                    return {
                        status: true,
                        message: `${collectionLabel} no aparece nada, parace que ese item no existe`,
                        item: null
                    };
                });
            }
            catch (error) {
                return {
                    status: false,
                    message: `error inesperado al querer cargar los detalles de ${collectionLabel}`,
                    item: null
                };
            }
        });
    }
    who(collection, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const collectionLabel = collection.toLowerCase();
            return yield db_operations_1.findOneElement(this.getdb(), collection, filter);
        });
    }
    add(collection, document, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_operations_1.insertOneElement(this.getdb(), collection, document).then(res => {
                    if (res.result.ok === 1) {
                        return {
                            status: true,
                            message: `Se añadio correctamente  el  ${item}.`,
                            item: document
                        };
                    }
                    return {
                        status: false,
                        message: `Error no se a podido insertar el  ${item}. intentalo de nuevo`,
                        item: null
                    };
                });
            }
            catch (error) {
                return {
                    status: false,
                    message: `Error incesperado al insertar el ${item}. intentalo de nuevo`,
                    item: null
                };
            }
        });
    }
    update(collection, filter, objectUpdate, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_operations_1.updateOneElement(this.getdb(), collection, filter, objectUpdate).then(res => {
                    if (res.result.nModified === 1 && res.result.ok) {
                        return {
                            status: true,
                            message: `Elemento del ${item} actualizado correctamente`,
                            item: Object.assign({}, filter, objectUpdate)
                        };
                    }
                    return {
                        status: false,
                        message: `Elemento del ${item} no se a actualizado. comprueba que estas filtradoo corectamente o simplemente no ahi nada nuevo que actualizar`,
                        item: null
                    };
                });
            }
            catch (error) {
                return {
                    status: false,
                    message: `Error incesperado al actualizar el ${item}. intentalo de nuevo`,
                    item: null
                };
            }
        });
    }
    del(collection, filter, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_operations_1.deleteoneElement(this.getdb(), collection, filter).then(res => {
                    if (res.deletedCount === 1) {
                        return {
                            status: true,
                            message: `Elemento del ${item} eliminado correctamente`,
                        };
                    }
                    return {
                        status: false,
                        message: `Elemento del ${item} no se ha borrado comprueba el filtro`,
                    };
                });
            }
            catch (error) {
                return {
                    status: false,
                    message: `Error incesperado al eliminar el ${item}. intentalo de nuevo`,
                };
            }
        });
    }
}
exports.default = ResolversOperationsService;
