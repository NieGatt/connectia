import { Injectable } from "@nestjs/common";
import { hashSync, compareSync } from "bcryptjs"

@Injectable()
export class HashService {
    hashData(data: string): string {
        return hashSync(data, 10)
    }

    compareData(data: string, hashedData: string): boolean {
        return compareSync(data, hashedData)
    }
}