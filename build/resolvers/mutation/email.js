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
const jwt_1 = __importDefault(require("../../lib/jwt"));
const constants_1 = require("../../config/constants");
const user_service_1 = __importDefault(require("../../services/user.service"));
const mail_service_1 = __importDefault(require("../../services/mail.service"));
const password_service_1 = __importDefault(require("../../services/password.service"));
const resolversEmailMutation = {
    Mutation: {
        sendEmail(_, { mail }) {
            return __awaiter(this, void 0, void 0, function* () {
                return new mail_service_1.default().send(mail);
            });
        },
        activeUserEmail(_, { id, email }) {
            return __awaiter(this, void 0, void 0, function* () {
                return new user_service_1.default(_, { user: { id, email } }, {}).active();
            });
        },
        activeUserAction(_, { id, birthday, password }, { token, db }) {
            return __awaiter(this, void 0, void 0, function* () {
                const verify = verifyToken(token, id);
                if ((verify === null || verify === void 0 ? void 0 : verify.status) === false) {
                    return {
                        status: false,
                        message: verify.message
                    };
                }
                return new user_service_1.default(_, { id, user: { birthday, password } }, { token, db }).unblock(true, false);
            });
        },
        resetPassword(_, { email }, { db }) {
            return __awaiter(this, void 0, void 0, function* () {
                return new password_service_1.default(_, { user: { email } }, { db }).sendEmail();
            });
        },
        changePassword(_, { id, password }, { db, token }) {
            return __awaiter(this, void 0, void 0, function* () {
                const verify = verifyToken(token, id);
                if ((verify === null || verify === void 0 ? void 0 : verify.status) === false) {
                    return {
                        status: false,
                        message: verify.message
                    };
                }
                return new password_service_1.default(_, { user: { id, password } }, { db }).change();
            });
        }
    }
};
function verifyToken(token, id) {
    const checkToken = new jwt_1.default().verify(token);
    if (checkToken === constants_1.MESSAGES.TOKEN_VARIFICATION_FAILDES) {
        return {
            status: false,
            message: 'El periodo para activar el usuario a finalizado, Contacta con el administrador para mas informacion',
        };
    }
    const user = Object.values(checkToken)[0];
    if (user.id !== id) {
        return {
            status: false,
            message: 'El usuario del token no corresponde al añadido en el argumento'
        };
    }
}
exports.default = resolversEmailMutation;
