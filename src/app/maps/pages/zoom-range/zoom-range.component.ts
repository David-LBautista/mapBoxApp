import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as  mapboxgl  from "mapbox-gl";


@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styleUrls: ['./zoom-range.component.css']
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel:number = 15;
  center: [number, number] = [ -97.112207, 18.866503 ];

  constructor() { }
  ngOnDestroy(): void {
    //!Siempre se deben destruir los listeners al salir del componente, regla de oro
    this.mapa.off('zoom', () =>{});
    this.mapa.off('zoomend', () =>{});
    this.mapa.off('move', () =>{});
  }


  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.mapa.on('zoom', (e) => {
      this.zoomLevel = this.mapa.getZoom();
    });

    this.mapa.on('zoomend', (e) => {
      if (this.mapa.getZoom() > 18) {
        this.mapa.zoomTo(18);
      }
    })

    this.mapa.on('move', (e) => {
      const target = e.target;
      const { lng, lat } = target.getCenter();
      this.center = [lng, lat];
    })
  }
  

  zoomOut(){

    this.mapa.zoomOut();

  }

  zoomIn(){

    this.mapa.zoomIn();
    
  }

  zoomCambio(valor: string){
    this.mapa.zoomTo( Number(valor))
  }

}
