"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const transport = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWOR_EMAIL,
    },
});
transport.verify().then(() => {
    console.log('======================NODEMAILER CONFIG===================');
    console.log(`STATUS: ${chalk_1.default.greenBright('ONLINE')}`);
    console.log(`MESSAGE: ${chalk_1.default.greenBright('MAILER CONNECT!!')}`);
}).catch(error => {
    console.log('======================NODEMAILER CONFIG===================');
    console.log(`STATUS: ${chalk_1.default.greenBright('OFFLINE')}`);
    console.log(`MESSAGE: ${chalk_1.default.greenBright(error)}`);
});
exports.default = transport;
