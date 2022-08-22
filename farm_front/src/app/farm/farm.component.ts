import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { FarmService } from '../services/farm.service';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html',
  styleUrls: ['./farm.component.scss']
})
export class FarmComponent implements OnInit {

  constructor(private _mapService: MapService, private farmService: FarmService) { }

  ngOnInit() {
    this.farmService.list().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
 

}