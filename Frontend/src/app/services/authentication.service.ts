import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { Card } from "../model/Card";
import { Room } from "../model/Room";
import { User } from "../model/User";
import { WebsocketService } from "./websocket.service";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public userSubject: BehaviorSubject<User | undefined>;
    public roomSubject: BehaviorSubject<Room | undefined>;
    public cardSubject: BehaviorSubject<Card | undefined>;
    public user: User;
    public room: Room;
    public card: Card;

    constructor(private websocketService: WebsocketService, private router: Router) {
        this.userSubject = new BehaviorSubject<User | undefined>(undefined);
        this.roomSubject = new BehaviorSubject<Room | undefined>(undefined);
        this.cardSubject = new BehaviorSubject<Card | undefined>(undefined);

        this.websocketService.messages.subscribe(msg => {
            switch (msg.source) {
                case "get-user":
                    this.userSubject.next(msg.content)
                    break
                case "send-vote":
                    this.card.votes = msg.content.votes
                    break
                case "get-user-with-name":
                    this.userSubject.next(msg.content)
                    break
                case "change-username":
                    this.userSubject.next(msg.content)
                    break
                case "create-room":
                    this.roomSubject.next(msg.content)
                    break
                case "join-room":
                    this.roomSubject.next(msg.content)
                    break
                case "joined-room":
                    this.roomSubject.next(msg.content)
                    break
                case "change-card":
                    this.cardSubject.next(msg.content)
                    break
            }
        });

        this.roomSubject.subscribe(room => {
            if (room != undefined) {
                this.router.navigate(['/room'], { queryParams: { id: room.id } })
            }
        })

        this.userSubject.subscribe((data) => {
            this.user = data
            if (data && data.name) {
                localStorage.setItem("user", JSON.stringify(data))
                this.router.navigate(['dashboard'])
            }
        })

        this.roomSubject.subscribe((data) => {
            this.room = data;
            localStorage.setItem("room", JSON.stringify(data))
        })

        this.cardSubject.subscribe((data) => {
            this.card = data;
        })

        this.websocketService.connectedSubject.subscribe(() => {
            if (!this.user)
                this.findUser()
        })
    }

    getUsername() {
        let userJson = localStorage.getItem("user")
        let user = JSON.parse(userJson)

        return user.name
    }

    findUser() {
        let userJson = localStorage.getItem("user")
        let user = undefined

        if (userJson != "undefined") {
            user = JSON.parse(userJson)
        }

        let message = {
            source: "get-user",
            content: {}
        };

        if (user && user.name) {
            message.source = "get-user-with-name"
            message.content = { name: user.name }
        }

        this.websocketService.messages.next(message);
    }
}