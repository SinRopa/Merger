import { Component } from '@angular/core';
import { GameDataServiceService } from '../game-data-service.service';

@Component({
  selector: 'app-player-hud',
  templateUrl: './player-hud.component.html',
  styleUrls: ['./player-hud.component.css']
})
export class PlayerHUDComponent {

  constructor(private gameData:GameDataServiceService){}

  Cashout:number = 100;
  Highscore:number = 1;
  

  ngOnInit()
  {
  this.gameData.scoreChange.subscribe(value => this.Highscore = value);
  this.gameData.cashOutChange.subscribe(value => this.Cashout = value);
  
  }
  
  CashOut()
  {

    this.gameData.CashOut();

  }
}
