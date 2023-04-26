import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  // Form Group
  frmReferencia: FormGroup | any;

  referenciaCompleta: string | undefined;

  constructor(private formBuilder: FormBuilder, private alertController: AlertController) {
    this.createForm();
  }

  // Reactive Form
  createForm(): void {
    this.frmReferencia = this.formBuilder.group({
      operacionTipo: new FormControl(null, [Validators.required]),
      emisor: new FormControl(null, [Validators.required]),
      referencia: new FormControl(null, [Validators.required]),
      digitoVerificador: new FormControl(null)
    });
  }


  /**
   * This function generates a reference number and calculates its verification digit.
   * @returns It is not clear what is being returned as there is no return statement in the code
   * provided. The function `generaRefencia()` sets values for certain form controls, validates the form,
   * calculates a verification digit, and sets the value of `referenciaCompleta`. However, it does not
   * explicitly return anything.
   */
  generaRefencia() {
    this.frmReferencia.controls['emisor'].setValue('0001');
    this.frmReferencia.controls['referencia'].setValue(this.generarNumber());
    //this.frmReferencia.controls['referencia'].setValue('14213283176738');

    console.log(this.frmReferencia.value);

    if (!this.frmReferencia.valid) {
      this.presentAlert();
      return;
    }

    // Referencia a validar
    console.log(`${this.frmReferencia.value.operacionTipo}${this.frmReferencia.value.emisor}${this.frmReferencia.value.referencia}`);

    let digitoVerificacion = this.calculaDigitoVerificador(`${this.frmReferencia.value.operacionTipo}${this.frmReferencia.value.emisor}${this.frmReferencia.value.referencia}`);
    this.frmReferencia.controls['digitoVerificador'].setValue(digitoVerificacion);
    console.log("El dígito de verificación es " + digitoVerificacion);
    this.referenciaCompleta = `${this.frmReferencia.value.operacionTipo}${this.frmReferencia.value.emisor}${this.frmReferencia.value.referencia}${digitoVerificacion}`;

    console.log('Referencia completa: ', this.referenciaCompleta);
    
  }


  /**
   * The function calculates a verification digit for a given number using a specific algorithm.
   * @param {any} num - The number for which the digit verification needs to be calculated. It can be of
   * any data type, but it will be converted to a string inside the function.
   * @returns the calculated verification digit for the input number.
   */
  calculaDigitoVerificador(num: any) {
    var ponderacion = [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    var sum = 0;
    var digit, mult;

    num = num.toString();

    for (var i = num.length - 1; i >= 0; i--) {
      digit = parseInt(num.charAt(i));
      mult = (i % 2 == 0) ? ponderacion[0] : 1;
      ponderacion.push(ponderacion.shift()!);
      if (digit * mult > 9) {
        sum += (digit * mult) % 10 + Math.floor(digit * mult / 10);
      } else {
        sum += digit * mult;
      }
    }

    var resto = sum % 10;
    var digitoVerificacion = (resto == 0) ? 0 : 10 - resto;

    return digitoVerificacion;
  }


  /**
   * The function generates a random number by concatenating the current timestamp with a random
   * single-digit number.
   * @returns A string that concatenates the current timestamp (in milliseconds since January 1, 1970)
   * with a random single-digit number.
   */
  generarNumber() {
    return new Date(Date.now()).getTime() + '' + Math.floor(Math.random() * 9);
  }


  /**
   * This function presents an alert with a header, subheader, and a single "OK" button.
   */
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Importante',
      subHeader: 'Completa todos los campos',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
