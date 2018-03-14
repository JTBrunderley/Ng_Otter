///<reference path="../../node_modules/p5/lib/p5.global-mode.d.ts" />

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import 'p5';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {RestService} from './services/rest.service';
import 'rxjs/add/observable/timer';
import {DataTable} from 'primeng/primeng';
import {Tweet} from './models/tweet.model';
import {PositionObj} from './models/position.model';
import {DisplayObj} from './models/displayObj.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(public restService: RestService) {
  }

  p5Instance: p5;
  refreshPos: Subscription;
  refreshDisplay: Subscription;
  position: PositionObj;
  display: DisplayObj;
  loading: boolean;

  ngOnInit() {
    this.loading = true;
    this.p5Instance = new p5(this.sketch);
    const display_timer = Observable.timer(0, 12000);
    const pos_timer = Observable.timer(0, 3000);
    this.refreshPos = pos_timer.subscribe(() => {
      this.updatePos();
    });
    this.refreshDisplay = display_timer.subscribe(() => {
      this.updateDisplay();
    });
  }

  ngOnDestroy() {
    this.p5Instance.remove();
    this.refreshPos.unsubscribe();
    this.refreshDisplay.unsubscribe();
  }

  updateDisplay() {
  this.restService.getDisplay().subscribe( (data: DisplayObj) => {
    this.display = data;
    this.loading = false;
  });
  }

  updatePos() {
  this.restService.getPosition().subscribe( (data: PositionObj) => {
    this.position = data;
  });
  }


  sketch(p: p5) {
    let img: p5.Image;
    let x: number;
    let y: number;
    let z: number;
    let lat: number;
    let lon: number;
    let refTimer: Subscription;
    p.preload = function () {
      img = p.loadImage('../assets/images/worldtex2.jpg');
    };
    p.setup = function () {
      const density = p.displayDensity();
      p.pixelDensity(density);
      p.frameRate(60);
      const canvas: any = p.createCanvas(600, 475, p.WEBGL);
      canvas.parent('map');
      refresh();
    };
    p.draw = function () {
      p.background(0, 0, 0, 0);
      p.ambientLight(255, 255, 255);

      p.rotateY(p.PI);
      p.rotateX(lat);
      p.rotateY(lon * -1);
      p.texture(img);
      p.sphere(p.width / 3, 24, 24);
      p.translate(x, y, z);
      p.fill(204, 0, 51);
      const d = p.map(p.sin((p.frameCount / 200) * p.TAU), -1, 1, 1, 4);
      p.sphere(d);
    };
    function refresh() {
      const timer = Observable.timer(0, 3000);
      refTimer = timer.subscribe(() => {
        p.loadJSON('https://api.wheretheiss.at/v1/satellites/25544', gotLatLon);
      });
    }
    function gotLatLon(data: PositionObj) {
      const r = p.width / 3;
      lat = p.radians(data.latitude);
      lon = p.radians(data.longitude);
      x = r * p.cos(lat) * p.sin(lon + p.radians(180));
      y = r * 1.0625 * p.sin(-lat);
      z = r * p.cos(lat) * p.cos(lon + p.radians(180));
    }
  }
}
