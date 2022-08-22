import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DrawAddon } from '@common/draw';
import { GeoJsonFeatureAddon } from '@common/feature';
import { GeoJsonFeature, pointClickStyle } from '@common/geolib';
import { ToastrService } from 'ngx-toastr';
import GeoJSON from 'ol/format/GeoJSON';

import { BasemapComponent } from '../basemap/basemap.component';
import { MapService } from '../map.service';
import { FarmService } from '../services/farm.service';

@Component({
  selector: 'app-new-register',
  templateUrl: './new-register.component.html',
  styleUrls: ['./new-register.component.scss'],
})
export class NewRegisterComponent implements OnInit {
  registerForm!: FormGroup;
  private _map!: BasemapComponent;
  private _geometries: GeoJsonFeature[] = [];
  updateMode: boolean = false;

  constructor(
    private farmService: FarmService,
    private formBuilder: FormBuilder,
    private _mapService: MapService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {  
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      area: ['', [Validators.required]],
      // centroid: this.formBuilder.array([]),
      centroid: [],
      geometry: [],
      owner_id: ['', [Validators.required]],
    })    
  }

  ngOnInit(): void {
    this._map = this._mapService.map;
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.updateMode = true
      this.farmService.read(id).subscribe({
        next: (res) => {
          console.log(res)        
          
            this.registerForm.setValue({
              name: res.name,
              area: res.area,
              geometry: res.geometry,
              owner_id: res.owner_id,
              centroid: res.centroid
            });
          
        },
        error: (err) => {
          console.log(err);
        }
      })
    }

    setTimeout(() => {
      console.log(this.registerForm.value)
    }, 2000)
  }

  editTest() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.farmService.editFarm(id, this.registerForm.value).subscribe();
    this.router.navigate(['/']);
  }

  handleCreate() {
    if (
      this.registerForm.value.geometry === null &&
      this.registerForm.value.centroid === null
    ) {
      this.toastr.error('Por favor, selecione a área');
      return
    }
    if (this.registerForm.valid) {
      this.farmService.create(this.registerForm.value).subscribe();
      this.router.navigate(['/']);
    } 
  }

  draw(type: 'Circle') {
    if (!this._map) return
    this._map.includeAddon(
      new DrawAddon({
        identifier: 'geometry_map',
        drawType: type,
        callback: (geometry, center) => {
          this.registerForm.value.centroid = center
          const geo = new GeoJSON().writeGeometryObject(geometry) as any
          this.handleNewGeometry(geo)
        },
      })
    )
  }

  geometrySeed: number = 1
  handleNewGeometry(geometry: any) {
    const identifier = this.geometrySeed++

    this._map.includeAddon(
      new GeoJsonFeatureAddon({
        identifier: `geometry::${identifier}`,
        feature: geometry,
        styleFunction: () => {
          return pointClickStyle({
            hover: false,
            strokeColor: '#1962D1',
          })
        },
      })
    )
    this._map.fitToAddons(this._map.listByPrefix('geometry'))
    // console.log('New geometry', geometry)
    this.registerForm.value.geometry = geometry
    this._geometries.push(geometry)
  }

  ngOnDestroy() {
    this._map.removeByPrefix('geometry')
  }
}
