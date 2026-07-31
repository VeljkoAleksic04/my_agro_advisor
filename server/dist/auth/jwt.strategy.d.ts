import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './jwt-payload.interface';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        id: number;
        ime: string;
        prezime: string;
        email: string;
        datumRodjenja: Date;
        username: string;
        password: string;
        kreiranDana: Date;
        izmenjenDana: Date;
        ukupnoPoena: number;
        uloga: import("generated/prisma").$Enums.UlogaKorisnika;
    }>;
}
export {};
