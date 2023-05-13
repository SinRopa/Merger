import { Component } from '@angular/core';
import { GameDataServiceService, PerksCost } from '../game-data-service.service';

@Component({
  selector: 'app-perks',
  templateUrl: './perks.component.html',
  styleUrls: ['./perks.component.css']
})
export class PerksComponent {
  constructor(private gameData:GameDataServiceService){}

  ngOnInit()
  {
    this.gameData.perkingChange.subscribe(value => this.perking = value);
    this.gameData.mergesChange.subscribe(value => this.Merges = value);
    this.gameData.scoreChange.subscribe(value => this.HighestTile = value);
    this.gameData.Player_CredChange.subscribe(value => this.Cred = Math.floor(value*100)/100);

    this.gameData.Perk_Level_InventorySizeChange.subscribe(value => this.InventoryPerks = value);
    this.gameData.Perk_Level_PayoutMultiChange.subscribe(value => this.PayoutPerks = value);
    this.gameData.Perk_Level_TileStartRankChange.subscribe(value => this.TileMinPerks = value);
    this.gameData.Perk_Level_ExtraSpawnChange.subscribe(value => this.SpawnPerks = value);

    this.gameData.PerkCostChange.subscribe(value => this.perksCost = value);
  }

  perking:boolean = true;
  InventoryPerks:number =999;
  PayoutPerks:number =999;
  TileMinPerks:number=999;
  SpawnPerks:number =999;
  Cred:number =999;
  Merges:number =999;
  HighestTile:number =999;
  perksCost:PerksCost = this.gameData.CalcPerkCost();

AcceptPerks()
{
  this.gameData.AcceptPerks();
}

BuyInventoryPerk()
{
  this.gameData.BuyInventoryPerk();
}
BuyPayoutPerk()
{
  this.gameData.BuyPayoutPerk();
}
BuyTileMinPerk()
{
  this.gameData.BuyTileMinPerk();
}
BuySpawnPerk()
{
  this.gameData.BuySpawnPerk();
}

}
