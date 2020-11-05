"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailer_1 = __importDefault(require("../config/mailer"));
class MailService {
    send(mail) {
        return new Promise((resolve, reject) => {
            mailer_1.default.sendMail({
                from: '"Tu casillero Pakki 👻" <valeriocompras@gmail.com>',
                to: mail.to,
                subject: mail.subject,
                html: mail.html,
            }, (error, _) => {
                (error) ? reject({
                    status: false,
                    message: error,
                }) : resolve({
                    status: true,
                    message: 'Email correctamente enviado a ' + mail.to,
                    mail
                });
            });
        });
    }
}
exports.default = MailService;
