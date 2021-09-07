import { AfterViewInit, ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from "mapbox-gl";



interface MarcadorColor {
  color:string;
  marker?: mapboxgl.Marker;
  center?: [number, number];
}


@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styleUrls: ['./marcadores.component.css']
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel:number = 15;
  center: [number, number] = [ -97.112207, 18.866503 ];

  //Arreglo de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.leerLocalStorage();
  }

  
  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const newMarker = new mapboxgl.Marker({
      draggable:true,
      color
    })
    .setLngLat( this.center )
    .addTo( this.mapa );

    this.marcadores.push({
      color,
      marker: newMarker
    });

    this.guardarLocalStorage();

    newMarker.on('dragend', () => {
      this.guardarLocalStorage();
    })
  }
  
  irAhi(marker:MarcadorColor){
    const lngLat = marker.marker!.getLngLat();
    const { lng, lat } = lngLat;

    this.mapa.flyTo({
      center: [lng, lat]
    })

  }

  guardarLocalStorage(){

    const lngLatArr:MarcadorColor[] = [];

    this.marcadores.forEach( m => {
      const color = m.color;
      const {lng, lat} = m.marker!.getLngLat();
      
      lngLatArr.push({
        color,
        center: [lng, lat]
      })
    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
  }

  leerLocalStorage(){
    
    if ( !localStorage.getItem('marcadores') ) {
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach( m => {

      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable:true
      })
      .setLngLat( m.center!)
      .addTo( this.mapa )

      this.marcadores.push({
        marker: newMarker,
        color: m.color
      })

      newMarker.on('dragend', () => {
        this.guardarLocalStorage();
      })


    });
    
  }

  borrarMarcador(i:number){
    console.log('Borrando marcador', i)
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i,1);
    this.guardarLocalStorage();
  }


}
