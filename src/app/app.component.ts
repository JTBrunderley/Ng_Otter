/// <reference path="../../node_modules/p5/lib/p5.global-mode.d.ts"/>

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

  p5Instance1: any;
  p5Instance2: p5;
  refreshPos: Subscription;
  refreshDisplay: Subscription;
  tweets: Tweet[];
  place: string;
  loading: boolean;
  lightSketch: boolean;

  ngOnInit() {
    this.lightSketch = true;
    this.loading = true;
    this.p5Instance1 = new p5(this.map_sketch);
    this.p5Instance2 = new p5(this.background_sketch);
    const display_timer = Observable.timer(0, 12000);
    const pos_timer = Observable.timer(0, 1000);
    this.refreshPos = pos_timer.subscribe(() => {
      this.updatePos();
    });
    this.refreshDisplay = display_timer.subscribe(() => {
      this.updateDisplay();
    });
  }

  ngOnDestroy() {
    this.p5Instance1.remove();
    this.p5Instance2.remove();
    this.refreshPos.unsubscribe();
    this.refreshDisplay.unsubscribe();
  }

  updateDisplay() {
  this.restService.getDisplay().subscribe( (data: DisplayObj) => {
    this.tweets = data.tweets;
    this.place = data.place;
    this.loading = false;
  });
  }

  updatePos() {
  this.restService.getPosition().subscribe( (data: PositionObj) => {
    this.p5Instance1.lat = this.p5Instance1.radians(data.latitude);
    this.p5Instance1.lon = this.p5Instance1.radians(data.longitude);
    const r = this.p5Instance1.width * 0.4;
    this.p5Instance1.x = r * this.p5Instance1.cos(this.p5Instance1.lat) * this.p5Instance1.sin(this.p5Instance1.lon + this.p5Instance1.radians(180));
    this.p5Instance1.y = r * 1.0625 * this.p5Instance1.sin(-this.p5Instance1.lat);
    this.p5Instance1.z = r * this.p5Instance1.cos(this.p5Instance1.lat) * this.p5Instance1.cos(this.p5Instance1.lon + this.p5Instance1.radians(180));
  });
  }

  map_sketch(sketch) {

    let img: p5.Image;
    let x: number;
    let y: number;
    let z: number;
    let lat: number;
    let lon: number;
    let refTimer: Subscription;
    let canvas: any;
    sketch.preload = function () {
      img = sketch.loadImage('../assets/images/globe.jpg');
    };
    sketch.setup = function () {
      const density = sketch.displayDensity();
      sketch.pixelDensity(density);
      sketch.frameRate(60);
      if (sketch.windowWidth > 800) {
        canvas = sketch.createCanvas(sketch.windowWidth * 0.3, sketch.windowWidth * 0.3, sketch.WEBGL);
      } else {
        canvas = sketch.createCanvas(sketch.windowWidth * 0.6, sketch.windowWidth * 0.6, sketch.WEBGL);
      }
      canvas.parent('map');
    };
    sketch.draw = function () {
      sketch.background(0, 0, 0, 0);
      sketch.ambientLight(255, 255, 255);

      sketch.rotateY(sketch.PI);
      sketch.rotateX(sketch.lat);
      sketch.rotateY(sketch.lon * -1);
      sketch.texture(img);
      sketch.sphere(sketch.width * 0.4, 24, 24);
      sketch.translate(sketch.x, sketch.y, sketch.z);
      sketch.fill(153, 0, 51);
      const d = sketch.map(sketch.sin((sketch.frameCount / 200) * sketch.TAU), -1, 1, 1, 4);
      sketch.sphere(d);
    };
    sketch.windowResized = function () {
      if (sketch.windowWidth > 800) {
        sketch.resizeCanvas(sketch.windowWidth * 0.3, sketch.windowWidth * 0.3);
      } else {
        sketch.resizeCanvas(sketch.windowWidth * 0.6, sketch.windowWidth * 0.6);
      }
    };
  }

  background_sketch(b: p5) {
    let x = [];
    let y = [];
    let r = [];
    let a = [];

    b.setup = function () {
      const canvas: any = b.createCanvas(b.windowWidth, b.windowHeight);
      canvas.parent('background');
      for (let i = 0; i < 400; i++){
        x[i] = b.random(b.width);
        y[i] = b.random(b.height);
        r[i] = b.random(1,4);
        a[i] = b.random(0,75);
      }
    };

    b.draw = function () {
      b.background(44, 47, 51);
      for (let i = 0; i < 400; i++){
        b.noStroke();
        b.fill(255, 255, 255, a[i]);
        b.ellipse(x[i], y[i], r[i]);
      }
    }

    b.windowResized = function () {
      b.resizeCanvas(b.windowWidth, b.windowHeight);
      for (let i = 0; i < 200; i++){
        x[i] = b.random(b.width);
        y[i] = b.random(b.height);
        r[i] = b.random(1,5);
      }
    };
  }
  
}
