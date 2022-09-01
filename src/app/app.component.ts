import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todonodemon';
  input: string = "";
  isUploading: boolean = false;
  destroyed = new Subject<void>();
  currentScreenSize: string | undefined;

  allTask: any[] = [];

  // Create a map to display breakpoint names for demonstration purposes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  day!: string;

  constructor(
    breakpointObserver: BreakpointObserver,
    private appService: AppService
    ) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
          }
        }
      });
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const date = new Date();
    this.day = date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    this.gettash();
  }

  gettash() {
    this.appService.taskget().then((res: any) => {
      this.allTask = JSON.parse(res);
    });
  }

  submitTask() {
    this.isUploading = true;
    const data = {
      text: this.input,
      isCompleted: false
    }
    this.taskToApi(data);
  }

  taskToApi(data: any) {
    this.appService.taskpost(JSON.stringify(data))
    .then((res: any) => {
      // this.allTask = [];
      this.isUploading = false;
      this.input = '';
      this.gettash();
    }, (reason:any) => {
      console.log(reason)
    });
  }

  completeTask(task: any) {
    console.log(task);
    if(task.isCompleted) {
      task.isCompleted = false;
    } else {
      task.isCompleted = true;
    }
    this.taskToApi(task);
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
