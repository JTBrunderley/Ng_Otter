///<reference path="../../node_modules/p5/lib/p5.global-mode.d.ts" />

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import 'p5';
import {IssObject} from './models/iss-object.model';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {RestService} from './services/rest.service';
import 'rxjs/add/observable/timer';
import {DataTable} from 'primeng/primeng';
import {Tweet} from './models/tweet.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(public restService: RestService) {
  }

  p5Instance: p5;
  refreshIssPos: Subscription;
  refreshTweets: Subscription;
  iss_lat: number;
  iss_lon: number;
  place: string;
  tweets: Tweet[];
  loading: boolean;

  ngOnInit() {
    this.tweets = new Array<Tweet>();
    this.loading = true;
    this.p5Instance = new p5(this.sketch);
    const twit_timer = Observable.timer(500, 10000);
    const iss_timer = Observable.timer(0, 3000);
    this.refreshIssPos = iss_timer.subscribe(() => {
      this.updateIss();
    });
    this.refreshTweets = twit_timer.subscribe(() => {
      this.getTweets();
    });
  }

  ngOnDestroy() {
    this.p5Instance.remove();
    this.refreshIssPos.unsubscribe();
  }

  updateIss() {
//     this.restService.getIss().subscribe((iss: IssObject) => {
//       this.iss_lat = iss.iss_position.latitude;
//       this.iss_lon = iss.iss_position.longitude;
      this.updatePlace();
      this.iss_lat = 42.6436796;
      this.iss_lon = -73.7047763;
//     });
  }

  updatePlace() {
//     this.restService.getPlace(this.iss_lat, this.iss_lon).subscribe((data: any) => {
//       if (data.error) {
//         this.place = 'Over The Ocean';
//       } else if (data.display_name) {
//         this.place = data.display_name;
//       }
//     });
    this.place = 'test';
  }


  getTweets() {
//    this.restService.getTweets(this.iss_lat, this.iss_lon).subscribe((datas: Tweet[]) => {
//      this.tweets = datas;
//      this.loading = false; } );
    this.tweets = [{user: 'temp', tweet: 'tweet'}];
    this.loading = false;
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
//       lat = p.radians(42.6436796);
//       lon = p.radians(-73.7047763);
//       const r = p.width / 3;
//       x = r * p.cos(lat) * p.sin(lon + p.radians(180));
//       y = r * 1.0625 * p.sin(-lat);
//       z = r * p.cos(lat) * p.cos(lon + p.radians(180));
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
      const timer = Observable.timer(0, 2000);
      refTimer = timer.subscribe(() => {
        p.loadJSON('http://api.open-notify.org/iss-now.json', gotLatLon);
      });
    }
    function gotLatLon(data: IssObject) {
      const r = p.width / 3;
      lat = p.radians(data.iss_position.latitude);
      lon = p.radians(data.iss_position.longitude);
      x = r * p.cos(lat) * p.sin(lon + p.radians(180));
      y = r * 1.0625 * p.sin(-lat);
      z = r * p.cos(lat) * p.cos(lon + p.radians(180));
    }
  }
}
