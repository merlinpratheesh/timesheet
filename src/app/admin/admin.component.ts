import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Task } from './task/task';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent, TaskDialogResult } from './task-dialog/task-dialog.component';
import firebase from 'firebase/app';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Inject, ChangeDetectionStrategy } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  @Input() authEmail: any;

  Backlog: any;
  getBacklogSubscription: Subscription | any;
  getBacklogBehaviourSub = new BehaviorSubject(undefined);
  getBacklog = (MainAndSubSectionkeys: AngularFirestoreDocument<any>) => {
    if (this.getBacklogSubscription !== undefined) {
      this.getBacklogSubscription.unsubscribe();
    }
    this.getBacklogSubscription = MainAndSubSectionkeys.valueChanges().subscribe((val: any) => {
      if (val === undefined) {
        this.getBacklogBehaviourSub.next(undefined);
      } else {
        if (val.backlog?.length === 0) {
          this.getBacklogBehaviourSub.next(undefined);
        } else {
          if (val.backlog?.length !== 0) {
            this.getBacklogBehaviourSub.next(val);
          }
        }
      }
    });
    return this.getBacklogBehaviourSub;
  };
  Process: any;
  getProcessSubscription: Subscription | undefined;
  getProcessBehaviourSub = new BehaviorSubject(undefined);
  getProcess = (MainAndSubSectionkeys: AngularFirestoreDocument<any>) => {
    if (this.getProcessSubscription !== undefined) {

      this.getProcessSubscription.unsubscribe();
    }
    this.getProcessSubscription = MainAndSubSectionkeys.valueChanges().subscribe((val: any) => {
      if (val === undefined) {
        console.log('here');
        this.getProcessBehaviourSub.next(undefined);
      } else {
        if (val.process?.length === 0) {
          console.log('here');
          this.getProcessBehaviourSub.next(undefined);
        } else {
          if (val.process?.length !== 0) {
            console.log('here');
            this.getProcessBehaviourSub.next(val);
          }
        }
      }
    });
    return this.getProcessBehaviourSub;
  };
  Done: any;
  getDoneSubscription: Subscription | undefined;
  getDoneBehaviourSub = new BehaviorSubject(undefined);
  getDone = (MainAndSubSectionkeys: AngularFirestoreDocument<any>) => {
    if (this.getDoneSubscription !== undefined) {
      this.getDoneSubscription.unsubscribe();
    }
    this.getDoneSubscription = MainAndSubSectionkeys.valueChanges().subscribe((val: any) => {
      console.log(val);

      if (val === undefined) {
        this.getDoneBehaviourSub.next(undefined);
      } else {
        if (val.done?.length === 0) {
          this.getDoneBehaviourSub.next(undefined);
        } else {
          if (val.done?.length !== 0) {
            this.getDoneBehaviourSub.next(val);
          }
        }
      }
    });
    return this.getDoneBehaviourSub;
  };
 


todo: { title: any; description: any; assignedto: any; }[];
  inProgress: { title: any; description: any; assignedto: any; }[];
  done: { title: any; description: any; assignedto: any; }[];

  constructor(private dialog: MatDialog, private db: AngularFirestore) {
    console.log('reach');

     this.todo=[
      {
        title: this.Backlog?.value?.card.title,
        description: this.Backlog?.value?.card.description,
        assignedto:this.Backlog?.value?.card.assignedto
      }
    ];
    this.inProgress=[
      {
        title: this.Process?.value?.card.title,
        description: this.Process?.value?.card.description,
        assignedto:this.Process?.value?.card.assignedto
      }
    ];
    this.done=[
      {
        title: this.Done?.value?.card.title,
        description: this.Done?.value?.card.description,
        assignedto:this.Done?.value?.card.assignedto
      }
    ];

    console.log(this.Done);


  }
  ngOnInit() {
  this.Backlog = this.getBacklog(this.db.doc('/5pNLjXqF3rWdKAeqrgqCAS9a2Oq1/backlog'));

  this.Process = this.getProcess(this.db.doc('/5pNLjXqF3rWdKAeqrgqCAS9a2Oq1/process'));
  this.Done = this.getDone(this.db.doc('/5pNLjXqF3rWdKAeqrgqCAS9a2Oq1/done'));
  
}
  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => {
        console.log('dialogOpen', result);

        if (!result) {
          return;
        }
        this.todo.push(result.task);
      });
  }

  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
      console.log('dialogClose', result);

      if (!result) {
        return;
      }
      const dataList = this[list];
      const taskIndex = dataList.indexOf(task);
      if (result.delete) {
        dataList.splice(taskIndex, 1);
      } else {
        dataList[taskIndex] = task;
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  ngOnDestroy() {

    this.getBacklogSubscription?.unsubscribe();
    this.getProcessSubscription?.unsubscribe();
    this.getDoneSubscription?.unsubscribe();



  }
}