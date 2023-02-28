import { Vote } from "./Vote";

export class Card {
    id: number;
    title: string;
    description: string;
    votes: Vote[];
}