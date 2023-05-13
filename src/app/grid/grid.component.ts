import { Component} from '@angular/core';
import { GameDataServiceService, Tile } from '../game-data-service.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {
  
  public tiles: Tile[] = [];
  
  constructor(private gameData:GameDataServiceService){}

  ngOnInit()
  {
    this.gameData.inventoryChange.subscribe(value => this.tiles = value);
  }

  dragElid:string;

  handleDragStart(e) {
    
    e.target.style.opacity = '0.3';

    this.dragElid = e.target.id;
  
  }

  handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    let dragID = this.dragElid;
    let dropID = e.target.id;

    let dragTile = this.tiles.find(x=> x.id.toString() == dragID);
    let dropTile = this.tiles.find(x=> x.id.toString() == dropID);

    if (dragTile == dropTile){e.dataTransfer.dropEffect = 'none'}
    
    if (dragTile.rank != dropTile.rank){e.dataTransfer.dropEffect = 'none'}

    return false;
  }

  handleDragEnter(e) {
    e.target.classList.add('over');
  }

  handleDragLeave(e) {
    e.target.classList.remove('over');
  }

  handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    e.target.classList.remove('over');
    let dragID:string = this.dragElid;
    let dropID:string = e.target.id.toString();

    this.gameData.drop(dragID, dropID);

    return false;
  }

  handleDragEnd(e) {
    e.target.style.opacity = '1';
  }
}


