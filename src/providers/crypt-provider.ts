import { Injectable } from "@angular/core";

import * as crypto from "crypto-browserify";

@Injectable()
export class CryptProvider {
    static encType: string = 'aes-256-cbc';
    static fromEnc: string = 'utf-8';
    static toEnc: string = 'hex';

    encrypt(encKey: string, data: string): string {
        let cipher = crypto.createCipher(CryptProvider.encType, encKey);
        let crypted = cipher.update(data, CryptProvider.fromEnc, CryptProvider.toEnc);
        crypted += cipher.final(CryptProvider.toEnc);
        return crypted;
    }

    decrypt(encKey: string, data: string): string {
        let decipher = crypto.createDecipher(CryptProvider.encType, encKey);
        let decrypted = decipher.update(data, CryptProvider.toEnc, CryptProvider.fromEnc);
        decrypted += decipher.final(CryptProvider.fromEnc);
        return decrypted;
    }
}