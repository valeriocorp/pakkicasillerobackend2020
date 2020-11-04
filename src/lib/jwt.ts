import { SECRET_KEY, MESSAGES, EXPIRETIME } from '../config/constants';
import jwt from 'jsonwebtoken';
import { Ijwt } from '../interfaces/jwt.interface';
class JWT {
    private secretKey = SECRET_KEY as string;


    sing(data: Ijwt, expiresIn: number = EXPIRETIME.H24) {
        return jwt.sign(
            {user: data.user},
            this.secretKey,
            {expiresIn} //24 horas de caducidad
        );
    }

    verify(token: string){
        try {
            return jwt.verify(token,this.secretKey);
        } catch (error) {
            return MESSAGES.TOKEN_VARIFICATION_FAILDES;
        }
    }
}

export default JWT;