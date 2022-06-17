import { Component, OnDestroy, OnInit, VERSION } from '@angular/core';
import { Subject } from 'rxjs';

import { tap, debounceTime, delay, takeLast } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  err = new Subject();
  errd: any = [];
  name: any = Array(10)
    .fill(1)
    .map((d) => Array(10).fill(1));

  sub2: any = Array(10)
    .fill(1)
    .map((d) =>
      Array(10)
        .fill(1)
        .map((d) => new Subject())
    );

  sub = new Subject();
  getType(){
    let num = Math.floor(Math.random()*5);
      if(num == 0)
      return 'type1';
      if(num == 1)
      return 'type2';
      if(num == 2)
      return 'type3';
      if(num == 3)
      return 'type4';
      if(num == 4)
      return 'type5';
  }
  ngOnInit() {
    let that = this;

    this.err
      .pipe(
        tap((d) => {
          that.errd.push(d);
        }),
        delay(5000),
        tap((d) => {
          that.errd.shift();
        })
      )
      .subscribe();
    console.log(this.sub2);
    for (let i = 0; i < 10; i++)
      for (let j = 0; j < 10; j++) {
        this.sub2[i][j].pipe(debounceTime(500)).subscribe((d: any) => {
          debugger;
          if (Number(d.i[d.p]) > 0 && Number(d.i[d.p]) <= 2) {
          } else {

            console.log(d.i[d.p] + ' this is not valid number');
            that.err.next({msg:d.i[d.p] + ' this is not valid number',type:that.getType()});
            d.i[d.p] = '';
          }
        });
      }

    this.sub.pipe(debounceTime(500)).subscribe((d: any) => {
      if (Number(d.i[d.p]) > 0 && Number(d.i[d.p]) <= 2) {
      } else {
        that.err.next({msg:d.i[d.p] + ' this is not valid number',type:that.getType()});
        d.i[d.p] = 0;
      }
    });
  }
  ngOnDestroy() {
    for (let i = 0; i < 10; i++)
      for (let j = 0; j < 10; j++) {
        this.sub2[i][j].unsubscribe();
      }
  }
}
