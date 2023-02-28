import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Room } from '../../model/Room'
import { Card } from '../../model/Card'
import { Vote } from 'src/app/model/Vote';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss',]
})
export class RoomComponent {
  id: string;
  room: Room;
  votes: string[] = ["1", "3", "5", "8", "13", "21", "cafe"]
  cardTitle: string;
  cardDesc: string;
  error: string = "";
  card: Card;

  constructor(private route: ActivatedRoute, private websocketService: WebsocketService, private router: Router, public authService: AuthenticationService) {
    this.route.queryParams.subscribe(params => {
      this.id = params['id']
    })

    this.authService.roomSubject.subscribe(room => {
      this.room = room;
    })

    this.authService.cardSubject.subscribe(card => {
      this.card == card
    })

    this.websocketService.connectedSubject.subscribe((x) => {
      if (x) {
        this.getRoom()
      }
    })
  }

  changeCard() {
    if (!this.isUserAdmin())
      return

    if (this.cardTitle == ("" || undefined)) {
      this.error = "Title cannot be empty."
      return
    }
    if (this.cardDesc == ("" || undefined)) {
      this.error = "Description cannot be empty."
      return
    }

    var message = {
      source: "change-card",
      content: {
        roomId: this.room.id,
        title: this.cardTitle,
        description: this.cardDesc,
        votes: []
      }
    }

    this.websocketService.messages.next(message)
  }

  isUserAdmin() {
    var found = this.room.admins.find(x => x.id == this.authService.user.id)
    return found
  }

  getUserVote(user) {
    var vote: Vote = this.authService.card.votes.find(x => x.user.id == user.id)

    if (!vote)
      return "?"

    return this.getVoteIcon(vote.value)
  }

  getVoteIcon(vote): string {
    let voteList = vote.split('')
    let string;

    if (voteList.length == 1) {
      string = `<i class="bi bi-${voteList[0]}-square-fill"></i>`
    } else if (voteList.length == 2) {
      string = `<i class="bi bi-${voteList[0]}-square-fill"></i> <i class="bi bi-${voteList[1]}-square-fill"></i>`
    } else if (vote == "cafe") {
      string = `<i class="bi bi-cup-hot-fill"></i>`
    }

    return string
  }

  sendVote(voteValue) {
    console.log("votes", this.authService.card.votes)
    let userVote = this.authService.card.votes.find(x => x.user.id == this.authService.user.id)

    if (userVote) {
      this.authService.card.votes = this.authService.card.votes.filter(x => x.user.id != this.authService.user.id)
    }

    let vote: Vote = new Vote()
    vote.user = this.authService.user;
    vote.value = voteValue

    this.authService.card.votes.push(vote)

    let message = {
      source: "send-vote",
      content: {
        votes: this.authService.card.votes,
        cardId: this.authService.card.id,
        roomId: this.authService.room.id
      }
    }
    this.websocketService.messages.next(message)
  }

  getRoom() {
    let message = {
      source: "get-room",
      content: {
        id: this.id
      }
    };
    this.websocketService.messages.next(message);
  }
}
