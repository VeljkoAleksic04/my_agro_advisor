import { AuthService } from './auth.service';
import { RegisterDto } from './register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
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
