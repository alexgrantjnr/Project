import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {

  public createUserForm: FormGroup;

  constructor(private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
    ) { this.createUserForm = this.formBuilder.group({
      email: ['', Validators.required],
      });
      }

  ngOnInit() {
  }

  async createUser(createUserForm): Promise<any> {
    const loading = await this.loadingCtrl.create();
    try {
      loading.present();
      const email: string = createUserForm.value.email;
      await this.authService.createRegularUser(email);
      await loading.dismiss();
      this.router.navigateByUrl('/tabs/inventory');
    } catch (error) {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        message: error.message,
        buttons: [{ text: 'Ok', role: 'cancel' }],
      });
      alert.present();
    }
  }
 
}
