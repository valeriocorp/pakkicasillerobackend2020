"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../../services/user.service"));
const resolversUserMutation = {
    Mutation: {
        register(_, { user }, context) {
            return new user_service_1.default(_, { user }, context).register();
        },
        updateUser(_, { user }, context) {
            return new user_service_1.default(_, { user }, context).modify();
        },
        deleteUser(_, { id }, context) {
            return new user_service_1.default(_, { id }, context).delete();
        },
        blockUser(_, { id, unblock, admin }, context) {
            return new user_service_1.default(_, { id }, context).unblock(unblock, admin);
        },
    }
};
exports.default = resolversUserMutation;
