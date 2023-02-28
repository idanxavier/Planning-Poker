import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { WebsocketService } from 'src/app/services/websocket.service';


@Component({
  selector: 'app-new-room',
  templateUrl: './new-room.component.html',
  styleUrls: ['./new-room.component.scss'],
})

export class NewRoomComponent {
  content = '';
  roomName = '';
  roomtype = 0;
  error = false;

  constructor(private WebsocketService: WebsocketService, private authenticationService: AuthenticationService) {
    authenticationService.roomSubject.subscribe(room => {
      if (room != undefined) {
        this.closeModal.nativeElement.click()
      }
    })
  }

  @ViewChild('closeModal') closeModal: ElementRef
  createRoom() {
    if (this.roomName == '' || this.roomtype == 0) {
      this.error = true;
      return
    }

    let message = {
      source: "create-room",
      content: {
        roomName: this.roomName,
        roomType: this.roomtype
      }
    };
    this.WebsocketService.messages.next(message);
  }
}
