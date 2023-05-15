import { Injectable } from '@angular/core';
import { Guid } from "guid-typescript";
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GameDataServiceService {

public Reg()
{
  let value = localStorage.getItem("reg_data");
  if(typeof value === 'string'){
    let regSave = JSON.parse(value);
    regSave.merger = 1;
    localStorage.setItem("reg_data", JSON.stringify(regSave));
  }
  else {
    let newRegSave = {merger:1};
    localStorage.setItem("reg_data", JSON.stringify(newRegSave));
  }

}
  public LoadGame()
  {

    let value = localStorage.getItem("save_Merger");
    if(typeof value === 'string'){
      let savegame = JSON.parse(value);
      
      if(typeof savegame.Inventory !== "undefined") this.gameData.Inventory = savegame.Inventory;
      if(typeof savegame.Perk_Level_InventorySize !== "undefined") this.gameData.Perk_Level_InventorySize = savegame.Perk_Level_InventorySize;
      if(typeof savegame.Perk_Level_PayoutMulti !== "undefined") this.gameData.Perk_Level_PayoutMulti = savegame.Perk_Level_PayoutMulti;
      if(typeof savegame.Perk_Level_TileStartRank !== "undefined") this.gameData.Perk_Level_TileStartRank = savegame.Perk_Level_TileStartRank;
      if(typeof savegame.Perk_Level_ExtraSpawn!== "undefined") this.gameData.Perk_Level_ExtraSpawn = savegame.Perk_Level_ExtraSpawn;
      if(typeof savegame.Player_Cred !== "undefined") this.gameData.Player_Cred = savegame.Player_Cred;
      if(typeof savegame.Player_Stats_Merges !== "undefined") this.gameData.Player_Stats_Merges = savegame.Player_Stats_Merges;
      if(typeof savegame.Player_Stats_HighestTile !== "undefined") this.gameData.Player_Stats_HighestTile = savegame.Player_Stats_HighestTile;
      if(typeof savegame.perking !== "undefined") this.gameData.perking = savegame.perking;
    }
    this.Reg();
  }

SaveGame()
{
let saveData:GameData = this.gameData;

localStorage.setItem("save_Merger", JSON.stringify(saveData));

}

  CalcPerkCost(){

    let result:PerksCost = 
    {
      Perk_Cost_InventorySize: Math.floor(5 * Math.pow(1.5, this.gameData.Perk_Level_InventorySize+1)*100)/100,
      Perk_Cost_PayoutMulti: Math.floor(4 * Math.pow(1.5, this.gameData.Perk_Level_PayoutMulti+1)*100)/100,
      Perk_Cost_TileStartRank: Math.floor(75 * Math.pow(2, this.gameData.Perk_Level_TileStartRank+1)*100)/100,
      Perk_Cost_ExtraSpawn: Math.floor(75 * Math.pow(2, this.gameData.Perk_Level_ExtraSpawn +1)*100)/100
    };
    return result;
  }

  BuySpawnPerk() {
    let cost = this.CalcPerkCost().Perk_Cost_ExtraSpawn;
    if(this.gameData.Player_Cred < cost){return;}
    this.gameData.Player_Cred= Math.floor((this.gameData.Player_Cred - cost)*100)/100;
    this.Player_CredChange.next(this.gameData.Player_Cred);
    this.Perk_Level_ExtraSpawnChange.next(++this.gameData.Perk_Level_ExtraSpawn);
    this.PerkCostChange.next(this.CalcPerkCost());
  }
  BuyTileMinPerk() {
    let cost = this.CalcPerkCost().Perk_Cost_TileStartRank;
    if(this.gameData.Player_Cred < cost){return;}
    this.gameData.Player_Cred= Math.floor((this.gameData.Player_Cred - cost)*100)/100;
    this.Player_CredChange.next(this.gameData.Player_Cred);
    this.Perk_Level_TileStartRankChange.next(++this.gameData.Perk_Level_TileStartRank);
    this.PerkCostChange.next(this.CalcPerkCost());
  }
  BuyPayoutPerk() {
    let cost = this.CalcPerkCost().Perk_Cost_PayoutMulti;
    if(this.gameData.Player_Cred < cost){return;}
    this.gameData.Player_Cred= Math.floor((this.gameData.Player_Cred - cost)*100)/100;
    this.Player_CredChange.next(this.gameData.Player_Cred);
    this.Perk_Level_PayoutMultiChange.next(++this.gameData.Perk_Level_PayoutMulti);
    this.PerkCostChange.next(this.CalcPerkCost());
  }
  BuyInventoryPerk() {
    let cost = this.CalcPerkCost().Perk_Cost_InventorySize;
    if(this.gameData.Player_Cred < cost){return;}
    this.gameData.Player_Cred= Math.floor((this.gameData.Player_Cred - cost)*100)/100;
    this.Player_CredChange.next(this.gameData.Player_Cred);
    this.Perk_Level_InventorySizeChange.next(++this.gameData.Perk_Level_InventorySize);
    this.PerkCostChange.next(this.CalcPerkCost());
  }
 
 
  AcceptPerks() {
    this.gameData.perking = false;
    this.perkingChange.next(this.gameData.perking);
  }
  
  CashOut()
  {
    this.gameData.perking = true;
    this.perkingChange.next(this.gameData.perking);

    this.gameData.Player_Cred += this.GetCurrentCashoutValue();
    this.Player_CredChange.next(this.gameData.Player_Cred);

    this.gameData.Inventory = [];
    this.inventoryChange.next(this.gameData.Inventory);

    this.GetCurrentCashoutValue();
    
  }
  
  inventoryChange: Subject<Tile[]> = new Subject<Tile[]>();
  scoreChange: Subject<number> = new Subject<number>();
  cashOutChange: Subject<number> = new Subject<number>();
  perkingChange: Subject<boolean> = new Subject<boolean>();
  subscription: Subscription = new Subscription;
  mergesChange: Subject<number> = new Subject<number>();
  everyTwoSeconds: Observable<number> = timer(0, 2000);
  Perk_Level_InventorySizeChange: Subject<number> = new Subject<number>();
  Perk_Level_PayoutMultiChange:Subject<number> = new Subject<number>();
  Perk_Level_TileStartRankChange:Subject<number> = new Subject<number>();
  Perk_Level_ExtraSpawnChange:Subject<number> = new Subject<number>();
  Player_CredChange:Subject<number> = new Subject<number>();
  PerkCostChange:Subject<PerksCost> = new Subject<PerksCost>();

  constructor() {
    
    this.inventoryChange = new BehaviorSubject<Tile[]>(this.gameData.Inventory);
    this.scoreChange = new BehaviorSubject<number>(this.gameData.Player_Stats_HighestTile);
    this.cashOutChange = new BehaviorSubject<number>(this.GetCurrentCashoutValue());
    this.perkingChange = new BehaviorSubject<boolean>(this.gameData.perking);
    this.mergesChange = new BehaviorSubject<number>(this.gameData.Player_Stats_Merges);
    this.PerkCostChange = new BehaviorSubject<PerksCost>(this.CalcPerkCost());
    
    this.Perk_Level_InventorySizeChange= new BehaviorSubject<number>(this.gameData.Perk_Level_InventorySize);
    this.Perk_Level_PayoutMultiChange= new BehaviorSubject<number>(this.gameData.Perk_Level_PayoutMulti);
    this.Perk_Level_TileStartRankChange= new BehaviorSubject<number>(this.gameData.Perk_Level_TileStartRank);
    this.Perk_Level_ExtraSpawnChange= new BehaviorSubject<number>(this.gameData.Perk_Level_ExtraSpawn);
    this.Player_CredChange= new BehaviorSubject<number>(this.gameData.Player_Cred);
    this.LoadGame();
    
    this.inventoryChange.next(this.gameData.Inventory);
    this.scoreChange.next(this.gameData.Player_Stats_HighestTile);
    this.cashOutChange.next(this.GetCurrentCashoutValue());
    this.perkingChange.next(this.gameData.perking);
    this.mergesChange.next(this.gameData.Player_Stats_Merges);
    this.PerkCostChange.next(this.CalcPerkCost());
    
    this.Perk_Level_InventorySizeChange.next(this.gameData.Perk_Level_InventorySize);
    this.Perk_Level_PayoutMultiChange.next(this.gameData.Perk_Level_PayoutMulti);
    this.Perk_Level_TileStartRankChange.next(this.gameData.Perk_Level_TileStartRank);
    this.Perk_Level_ExtraSpawnChange.next(this.gameData.Perk_Level_ExtraSpawn);
    this.Player_CredChange.next(this.gameData.Player_Cred);




    this.subscription = this.everyTwoSeconds.subscribe(() => {
      this.InventorySpawner();
     this.SaveGame();
    });
    
   }

   AddTileToInventory(t:Tile)
   {
     this.gameData.Inventory.push(t);
     this.inventoryChange.next(this.gameData.Inventory);
   }
   
   

  gameData:GameData=
  {
    Inventory: [],
    Perk_Level_InventorySize: 0, 
    Perk_Level_PayoutMulti: 0,
    Perk_Level_TileStartRank:0,
    Perk_Level_ExtraSpawn:0,

    Player_Cred: 0,

    Player_Stats_Merges:0,
    Player_Stats_HighestTile: 1,
    perking:false,
  }

  CreateTile(newrank:number)
  {
    return {
      rank: newrank,
      color: this.GetColorFromRank(newrank),
      id: Guid.create().toString()
    }

  }

  drop(dragID:string , dropID:string) 
{

  
  let dragTile = this.gameData.Inventory.find(x=> x.id.toString() == dragID);
  let dropTile = this.gameData.Inventory.find(x=> x.id.toString() == dropID);

  if (dragTile == dropTile){return false;}
  
  if (dragTile.rank != dropTile.rank){return false;}

  dropTile.rank++;
  dropTile.color = this.GetColorFromRank(dropTile.rank);
  console.log("Merged" +dropTile.rank);
  
  let killIndex = this.gameData.Inventory.findIndex(x=> x.id.toString() == dragID);
  this.gameData.Inventory.splice(killIndex, 1);
  
    if(dropTile.rank > this.gameData.Player_Stats_HighestTile)
    {
      this.gameData.Player_Stats_HighestTile = dropTile.rank;
      this.scoreChange.next(this.gameData.Player_Stats_HighestTile);
    }
  
    this.GetCurrentCashoutValue();
    this.gameData.Player_Stats_Merges++;
    this.mergesChange.next(this.gameData.Player_Stats_Merges);
  }



  previousCashOut:number=0;
  GetCurrentCashoutValue()
  {
    let result =0;
      
      this.gameData.Inventory.forEach(x=>{
        result+= .05 * (1 + (this.gameData.Perk_Level_PayoutMulti*.05)) * Math.pow(2.05, x.rank-1);
      })
      
      result = Math.floor(result *100)/100;
      this.cashOutChange.next(result);
      //temp
      let change = result - this.previousCashOut;
      this.previousCashOut = result;
      console.log(Math.floor(change *100)/100);
     //end temp 
      return result;
  }

  GetColorFromRank(rank:number)
  {
    
    

    let direction:number = rank %8;
    
    let directions:string[]=
    [
      "to bottom",
      "to bottom right",
      "to left",
      "to top left",
      "to right",
      "to bottom left",
      "to top",
      "to top right",
    ];
    

let colors: ColorPair[]=[
  {first:"#E0D7FF",second:"#7B31FC"},
  {first:"#D7EEFF",second:"#8F6DC1"},
  {first:"#FC313A",second:"#CCF1FF"},
  {first:"#FFC000",second:"#FC31A0"},
  {first:"#E031FC",second:"#FFFC00"},
  {first:"#DDA0DD",second:"#00FFFF"},
  {first:"#CCFF00",second:"#FFFFE0"},
  {first:"#FF6EFF",second:"#CC553D"},
  {first:"#9C51B6",second:"#FFDAB9"},
  {first:"#66CDAA",second:"#D57D91"},
  {first:"#FFCCE1",second:"#C9C0BB"},
  ];

      let color1= colors[(rank%10)].first;
      let color2 = colors[(rank%10)].second;
      let pattern1 = 65;
      let pattern2 = 65;
        

      return `linear-gradient(${directions[direction]}, ${color1} ${pattern1}%, ${color2} ${pattern2}%)`;
  }

  InventorySpawner()
  {
    if(this.gameData.perking){return;}
    
    let current_inv = this.gameData.Inventory.length;
    let inv_max = 6 + this.gameData.Perk_Level_InventorySize;
    let spawn_count = 1 + this.gameData.Perk_Level_ExtraSpawn;
    let tile_rank =  1 + this.gameData.Perk_Level_TileStartRank;

    if( current_inv >= inv_max){return;}

    let pending = Math.min(spawn_count, inv_max - current_inv);

    for (let index = 0; index < pending; index++) 
    {
      this.AddTileToInventory(this.CreateTile(tile_rank));
    }
    this.GetCurrentCashoutValue();
  }

}

export interface Tile {
  color: string;
  rank: number;
  id: string;
}
export interface PerksCost{
  Perk_Cost_InventorySize: number,
  Perk_Cost_PayoutMulti:number,
  Perk_Cost_TileStartRank:number,
  Perk_Cost_ExtraSpawn:number,
}
export interface ColorPair
{
  first:string,
  second:string,
}

export interface GameData
{
  Inventory:Tile[]
  Perk_Level_InventorySize: number,
  Perk_Level_PayoutMulti: number,
  Perk_Level_TileStartRank:number
  Perk_Level_ExtraSpawn:number,
  Player_Cred: number,
  Player_Stats_Merges:number,
  Player_Stats_HighestTile: number,
  perking:boolean, 
}