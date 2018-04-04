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
    if (data.err) {console.log(data.err);}
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

  map_sketch(p) {

    let img: p5.Image;
    let x: number;
    let y: number;
    let z: number;
    let lat: number;
    let lon: number;
    let refTimer: Subscription;
    let canvas: any;
    let loading = true;
    
    p.setup = function () {
      const density = p.displayDensity();
      p.pixelDensity(density);
      p.frameRate(60);
      if (p.windowWidth > 800) {
        canvas = p.createCanvas(p.windowWidth * 0.3, p.windowWidth * 0.3, p.WEBGL);
      } else {
        canvas = p.createCanvas(p.windowWidth * 0.6, p.windowWidth * 0.6, p.WEBGL);
      }
      canvas.parent('map');
      p.loadImage('../assets/images/globe.jpg', imageLoaded);
    };
    
    function imageLoaded(image){
      img = image;
      loading = false;
    }
    
    p.draw = function () {
      if (loading){
      p.background(0, 0, 0, 0);
      p.ambientLight(255, 255, 255);
      } else {
        p.background(0, 0, 0, 0);
      p.ambientLight(255, 255, 255);

      p.rotateY(p.PI);
      p.rotateX(p.lat);
      p.rotateY(p.lon * -1);
      p.texture(img);
      p.sphere(p.width * 0.4, 24, 24);
      p.translate(p.x, p.y, p.z);
      p.fill(153, 0, 51);
      const d = p.map(p.sin((p.frameCount / 200) * p.TAU), -1, 1, 1, 4);
      p.sphere(d);
      }
    };
    p.windowResized = function () {
      if (p.windowWidth > 800) {
        p.resizeCanvas(p.windowWidth * 0.3, p.windowWidth * 0.3);
      } else {
        p.resizeCanvas(p.windowWidth * 0.6, p.windowWidth * 0.6);
      }
    };
  }

  background_sketch(b: p5) {
    const x = [];
    const y = [];
    const r = [];
    const a = [];
    let img: p5.Image;
    let loading = true;

    b.setup = function () {
      const canvas: any = b.createCanvas(b.windowWidth, b.windowHeight);
      canvas.parent('background');
      for (let i = 0; i < 400; i++) {
        x[i] = b.random(b.width);
        y[i] = b.random(b.height);
        r[i] = b.random(1, 4);
        a[i] = b.random(0, 75);
    }
    };

    function imageLoaded(image) {
      img = image;
      loading = false;
    }

    b.draw = function () {
      if (loading) {
        b.background(44, 47, 51);
        for (let i = 0; i < 400; i++) {
          b.noStroke();
          b.fill(255, 255, 255, a[i]);
          b.ellipse(x[i], y[i], r[i]);
          x[i] = x[i] - .25;
          if ( x[i] <= 0) {
            x[i] = b.windowWidth;
            y[i] = b.random(b.height);
          }
        }
      } else {
        b.background(44, 47, 51);
        for (let i = 0; i < 400; i++) {
          b.noStroke();
          b.fill(255, 255, 255, a[i]);
          b.ellipse(x[i], y[i], r[i]);
          x[i] = x[i] - .25;
          if ( x[i] <= 0) {
            x[i] = b.windowWidth;
            y[i] = b.random(b.height);
          }
        }
        b.image(img, 0, 0);
      }
    };

    b.windowResized = function () {
      b.resizeCanvas(b.windowWidth, b.windowHeight);
      for (let i = 0; i < 200; i++) {
        x[i] = b.random(b.width);
        y[i] = b.random(b.height);
        r[i] = b.random(1, 5);
      }
    };
  }
}
