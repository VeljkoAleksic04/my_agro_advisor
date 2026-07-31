import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(data: RegisterDto): Promise<{
        id: number;
        ime: string;
        prezime: string;
        email: string;
        datumRodjenja: Date;
        username: string;
        kreiranDana: Date;
        izmenjenDana: Date;
        ukupnoPoena: number;
        uloga: import("generated/prisma").$Enums.UlogaKorisnika;
    }>;
    login(username: string, password: string): Promise<{
        access_token: string;
    }>;
}
