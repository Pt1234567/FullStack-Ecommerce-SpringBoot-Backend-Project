import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit{
  
    isAutenticated:boolean=false;
    userFullName:string='';

    storage:Storage=sessionStorage; 


    
    constructor(private oktaAuthStateService:OktaAuthStateService,
                @Inject(OKTA_AUTH) private oktaAuth:OktaAuth
    ) { }


    
  
    ngOnInit(): void {

      this.oktaAuthStateService.authState$.subscribe(
        (result)=>{
          this.isAutenticated=result.isAuthenticated!;
          this.getUserDetails();
        }

      );
    }
  getUserDetails() {
        if(this.isAutenticated){

          //Fetch the logged in user details (user's claims)
          //
          // user full name is exposed as a property name
          this.oktaAuth.getUser().then(
            (res)=>{
              this.userFullName=res.name as string;

              //retrive the user's email
              const theEmail=res.email as string;

              //store email in browser storage
              this.storage.setItem('userEmail',JSON.stringify(theEmail));
            }
          );

        }
  }

  logout(){
    this.oktaAuth.signOut();
  }
}
