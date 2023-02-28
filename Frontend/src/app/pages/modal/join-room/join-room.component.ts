import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss']
})
export class JoinRoomComponent {
  content = '';
  roomId = '';
  error = false;


  constructor(private WebsocketService: WebsocketService, private authenticationService: AuthenticationService) {
    authenticationService.roomSubject.subscribe(room => {
      if (room != undefined) {
        this.closeModal.nativeElement.click()
      }
    })
  }

  @ViewChild('closeModal') closeModal: ElementRef
  joinRoom() {
    if (this.roomId == '') {
      this.error = true;
      return
    }

    let message = {
      source: "join-room",
      content: {
        roomId: this.roomId,
      }
    };
    this.WebsocketService.messages.next(message);
  }

}
