import { IsUUID } from "class-validator";

export class Uuiddto {
    @IsUUID("4")
    uuid: string;
}