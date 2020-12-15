import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { first } from 'rxjs/operators';
import { Role, User } from '../../models/user';
import {UserService} from '../../services/user.service';
import {RoleService} from '../../services/role.service';
import {DeleteDialogComponent} from '../../components/dialogs/delete/delete.dialog.component';
import {AddDialogComponent} from '../../components/dialogs/add/add.dialog.component';
import {EditDialogComponent} from '../../components/dialogs/edit/edit.dialog.component';

import {deepCopy} from '../../helperFunctions/deepCopy';

@Component({
  selector: 'app-admin-data-page',
  templateUrl: './admin-data-page.component.html',
  styleUrls: ['./admin-data-page.component.scss'],
})
export class AdminDataPageComponent implements OnInit {


  displayedColumns = ['name', 'email', 'password', 'roles', 'actions'];
  dataSource : MatTableDataSource<User>;
  index: number;
  id: number;
  roles;

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              private userService: UserService,
              private roleService: RoleService) {}

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('filter',  {static: true}) filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }


  addNew() {
    let dialogData: any = {};
    dialogData.rolesData = deepCopy(this.roles);
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
       
        let newUserData = this.userService.getDialogData();
        console.log("add user data");
        newUserData.rolesString = newUserData.roles.join(', ');
        this.dataSource.data.push(newUserData);
        
        this.refreshTable();
      }
    });
  }

  startEdit(user : User) {
    let dialogData = deepCopy(user);
    dialogData.rolesData = deepCopy(this.roles);
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        console.log("editing done");

        let newUserData = this.userService.getDialogData();
        const foundIndex = this.dataSource.data.findIndex(x => x.id === newUserData.id);
        
        newUserData.rolesString = newUserData.roles.join(', ');
        this.dataSource.data[foundIndex] = newUserData;
       
        this.refreshTable();
      }
    });
  }


  deleteItem(i: number, id: number, title: string, state: string, url: string) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {id: id, title: title, state: state, url: url}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.dataSource.data.findIndex(x => x.id === this.id);

        this.dataSource.data.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }


  private refreshTable() {
    //this.paginator._changePageSize(this.paginator.pageSize);
    this.dataSource._updateChangeSubscription();
  }

  public loadData() {
    this.roleService.getAllRoles().pipe(first()).subscribe((roles: Role[]) => {
      this.roles = roles;
    });
    this.userService.getAllUsers().pipe(first()).subscribe((data: User[]) => {
      for (let user of data){
        let roles = [];
        for (let role of user.roles){
          roles.push(role.name);
        }
        user.rolesString = roles.join(', ');
      }
      this.dataSource = new MatTableDataSource(data);
    });
    fromEvent(this.filter.nativeElement, 'keyup')
      // .debounceTime(150)
      // .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  orderData(id: string, start?: "asc" | "desc") {
    const matSort = this.dataSource.sort;
    const disableClear = false;

    matSort.sort({ id: null, start, disableClear });
    matSort.sort({ id, start, disableClear });

    this.dataSource.sort = this.sort;
  }


  private load() {
    console.log("trying to load");
    
  }

  delete(user: User) {
    let ownPassword : string;
    this.userService.deleteUser(user.email, ownPassword)
    .pipe(first())
    .subscribe(
      data => {
        //this.loadAllObjects();
      },
      error => {
        
      }
    );
  }

  edit(user: User) {
    let ownPassword : string;
    this.userService.updateUser(user, ownPassword)
    .pipe(first())
    .subscribe(
      data => {
        //this.loadAllObjects();
      },
      error => {
        
      }
    );
  }

  /*findActualData(_id: string) {
    for (let data of this.actualData) {
      if (data._id === _id) {
        return data;
      }
    }
  } */ 
}



