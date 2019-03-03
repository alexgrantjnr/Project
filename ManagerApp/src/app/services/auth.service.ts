import { PlayerService } from './player.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
AngularFirestore,
AngularFirestoreCollection,
AngularFirestoreDocument,
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { UserProfile } from '../../app/models/userProfile';
import { TeamProfile } from '../../app/models/teamProfile';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth,
    public fireStore: AngularFirestore, public PlayerService: PlayerService) { }

    loginUser(email: string, password: string)
    : Promise<firebase.auth.UserCredential> {
      return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }

    resetPassword(email: string): Promise<void> {
      return this.afAuth.auth.sendPasswordResetEmail(email);
    }

    logoutUser(): Promise<void> {
      return this.afAuth.auth.signOut();
    }

    async createAdminUser(email: string, password: string):
    Promise<firebase.User> {
      try {
        const adminUserCredential: firebase.auth.UserCredential = await
        this.afAuth.auth.createUserWithEmailAndPassword(
          email,
          password
          );

          const userProfileDocument: AngularFirestoreDocument<UserProfile> = this.fireStore.doc(`userProfile/${adminUserCredential.user.uid}`);
          
          const teamId: string = this.fireStore.createId();
          
          await userProfileDocument.set({
            id: adminUserCredential.user.uid,
            email: email,
            teamId: teamId,
            teamAdmin: true,
          });

          const teamProfile: AngularFirestoreDocument<TeamProfile> =this.fireStore.doc(`teamProfile/${teamId}`);
            await teamProfile.set({
              id: teamId,
              teamAdmin: adminUserCredential.user.uid,
              playerList: null,
            });
            return adminUserCredential.user;
          } catch (error) {
            console.error(error);
          }
        }

        async createRegularUser(email: string): Promise<any> {
          const teamId: string = await this.PlayerService.getTeamId();
          const userCollection: AngularFirestoreCollection<any> = this.fireStore.collection(`teamProfile/${teamId}/teamMemberList`);
          const id: string = this.fireStore.createId();
          const regularUser = {
            id: id,
            email: email,
            teamId: teamId
          };
          return userCollection.add(regularUser);
        }
          
      }
    


