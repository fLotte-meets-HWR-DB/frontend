import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {FormControl, Validators} from '@angular/forms';
import {User} from '../../../models/user';
import { first } from 'rxjs/operators';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-add.dialog',
  templateUrl: '../../dialogs/add/add.dialog.html',
  styleUrls: ['../../dialogs/add/add.dialog.css']
})

export class AddDialogComponent {
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public userService: UserService,
              public snackbarService: SnackBarService) { }

  hide = true;
  hidePW = true;
  selectedRoles: FormControl = new FormControl();

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
  // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.data.roles = [];
    for (let role of this.selectedRoles.value){
      this.data.roles.push(role.name);
    }
    this.userService.addUser(this.data).pipe(first())
    .subscribe(
      data => {
        this.snackbarService.openSnackBar("Der Nutzer wurde erfolgreich hinzugefügt");
        //this.loadAllObjects();
      },
      error => {
        this.snackbarService.openSnackBar(error, "Ok", true);
      }
    );
  }
}
