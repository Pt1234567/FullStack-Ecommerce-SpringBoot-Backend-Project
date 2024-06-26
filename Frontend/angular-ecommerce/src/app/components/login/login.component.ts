import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import  OktaSignIn  from '@okta/okta-signin-widget';

import myAppConfig from '../../config/my-app-config';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

      oktaSignIn:any;


      
      constructor(@Inject(OKTA_AUTH) private oktaAuth:OktaAuth) {

          this.oktaSignIn=new OktaSignIn({
            logo:'assets/images/logo.jpg',
            baseUrl:myAppConfig.oidc.issuer.split('/oauth2')[0],
            clientId:myAppConfig.oidc.clientId,
            redirectUri:myAppConfig.oidc.redirectUri,
            authParams:{
              pkce:true,
              maxClockSkew:900,
              issuer:myAppConfig.oidc.issuer,
              scopes:myAppConfig.oidc.scopes
            }
          });
      }

      ngOnInit(): void {

        this.oktaSignIn.remove();

        this.oktaSignIn.renderEl({
          el:'#okta-sign-in-widget'},
          (response : any) =>{
            if(response.status==='SUCCESS'){
              this.oktaAuth.signInWithRedirect();
              
            }
          },

          (error:any)=>{
            console.error('Okta sign-in widget error:', error);
            throw error;
          }
        );
      }
   
}
