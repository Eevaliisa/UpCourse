import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/users/user.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../../common/user";
import {Role} from "../../../common/role";

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {

  user: User;
  roles: Role[];
  username;
  isTeacher;

  constructor(private userService: UserService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  getUserByUsername (username: string) {
    this.isTeacher = false;
    this.userService.getUserByUsername(username).subscribe(data => {
      this.user = data;
      console.log(data);
      this.userService.getUserRoles(this.user.id).subscribe(data => {
        this.roles = data;
        for (let tempRole of this.roles) {
          if (tempRole.name == 'ROLE_TEACHER') {
            this.isTeacher = true;
          }
        }
      })
    }, error => {
      console.log("user not found");
    })
  }

  changeRole() {
    if (this.isTeacher) {
      this.userService.removeTeacherRole(this.user.id);
      this.isTeacher = false;
    }
    else {
      this.userService.addTeacherRole(this.user.id);
      this.isTeacher = true;
    }
  }


}
