import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  public resetPasswordForm: FormGroup;

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }


  async resetPassword(resetPasswordForm): Promise<void> {
    try {
      const email: string = resetPasswordForm.value.email;
      await this.authService.resetPassword(email);
      const alert = await this.alertCtrl.create({
        message: 'We sent you a reset link to your email',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            handler: () => {
              this.router.navigateByUrl('/login');
            },
          },
        ],
      });
      alert.present();
    } catch (error) {
      const errorMessage: string = error.message;
      const errorAlert = await this.alertCtrl.create({
        message: errorMessage,
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
          },
        ],
      });
      errorAlert.present();
    }
  }
    

  ngOnInit() {}
}



