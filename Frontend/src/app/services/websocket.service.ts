import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Observer, of } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const CHAT_URL = "ws://localhost:3000";

export interface Message {
    source: string;
    content: any;
}

@Injectable({ providedIn: 'root' })
export class WebsocketService {
    private subject: AnonymousSubject<MessageEvent>;
    public messages: Subject<Message>;
    public connectedSubject: BehaviorSubject<Boolean>;

    constructor() {
        this.connectedSubject = new BehaviorSubject<Boolean>(false);
        this.messages = <Subject<Message>>this.connect().pipe(
            map(
                (response: MessageEvent): Message => {
                    // console.log(response.data);
                    let data = JSON.parse(response.data)
                    return data;
                }
            )
        );
    }

    public connect(): AnonymousSubject<MessageEvent> {
        if (!this.subject) {
            this.subject = this.create(CHAT_URL);
            // console.log("Successfully connected: " + CHAT_URL);
        }

        return this.subject;
    }

    private create(url): AnonymousSubject<MessageEvent> {
        let ws = new WebSocket(url);
        ws.onopen = () => {
            this.connectedSubject.next(true);
        }
        let observable = new Observable((obs: Observer<MessageEvent>) => {
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = obs.error.bind(obs);
            ws.onclose = obs.complete.bind(obs);
            return ws.close.bind(ws);
        });
        let observer = {
            error: null,
            complete: null,
            next: (data: Object) => {
                // console.log('Message sent to websocket: ', data);
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            }
        };
        return new AnonymousSubject<MessageEvent>(observer, observable);
    }
}