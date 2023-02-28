import { User } from "./User"

export class Room {
    id: number;
    name: string;
    type: number;
    users: User[];
    admins: User[];
}