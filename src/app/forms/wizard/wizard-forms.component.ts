import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SoilService } from './soil.service';
import { SelectItemGroup } from 'primeng/api';
import { CreditCardValidator } from 'ngx-credit-cards';
import { ActivatedRoute, Router } from '@angular/router';
declare var require: any;
const data: any = require('./crops.json');

@Component({
    selector: 'app-wizard-forms',
    templateUrl: './wizard-forms.component.html',
    styleUrls: ['./wizard-forms.component.scss'],
    providers: [SoilService]
})

export class WizardFormsComponent implements OnInit {
    unitesData: any[] = [];
    extractionData: any[] = [];
    nutrientsData: any[] = [];
    cropNE: {
        type: string,
        nutrients: any[],
        extMethod: any[]
    }
    alldata: any[] = [];
    cropsData: any[] = [];
    type: any[] = ['N', 'P', 'K', 'Ca', 'Mg', 'S', 'B', 'Fe', 'Mn', 'Zn', 'Cu', 'Mo', 'Na', 'Al', 'Cl', 'HCO3'];
    alpha: any[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    crops: any[] = [];
    cropId: any;
    crop: {
        alpha: string,
        records: any[]
    }
    varietyName: any;
    selectedCrop: any;
    varietyData: any[] = [];
    soilType: any[] = [];
    step1Form: FormGroup;
    step2Form: FormGroup;
    step3Form: FormGroup;
    step5Form: FormGroup;
    form1: any;
    form2: any;
    form3: any;
    paymentModel: any = {};
    form: FormGroup;
    convertData: any[] = [];
    reportData: any[] = [];
    allcrops: any[] = [];
    payUrl: any;
    isPay: boolean = false;
    stepIndex: number = 0;
    private _emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    constructor(private service: SoilService, private fb: FormBuilder, private route: ActivatedRoute,
        private router: Router) {

        var url_string = window.location.href;
        var url = new URL(url_string);
        this.payUrl = url.searchParams.get("credit_card_processed");
        if (this.payUrl == 'Y') {
            this.isPay = true;
        }
        this.service.getNutrients()
            .subscribe(data => {
                this.nutrientsData = data;
                this.service.getExtraction()
                    .subscribe(data => {
                        this.extractionData = data;

                        for (let i = 0; i < this.type.length; i++) {
                            this.cropNE = {
                                type: '',
                                nutrients: [],
                                extMethod: []
                            }
                            this.cropNE = {
                                type: this.type[i],
                                nutrients: this.nutrientsData.filter(a => a.type == this.type[i]),
                                extMethod: this.extractionData.filter(a => a.type == this.type[i])
                            }
                            this.alldata.push(this.cropNE);
                        }
                    })
            })

        // this.service.postLogin('sagi4422@gmail.com', '123.12.1.0', 'abcd1234')
        //     .subscribe(data => {
        //         this.service.postValidateToken(data.UserId, data.Token)
        //             .subscribe(data1 => {
        //                 if (data1) {
        //                     // this.service.getCrops(data.UserId, data.Token)
        //                     //     .subscribe(data2 => {
        //                     //         this.cropsData = data2;
        //                     //         console.log(this.cropsData)
        //                     //     });
        //                 }
        //             });
        //     });
        this.cropsData = data;
        for (let i = 0; i < this.alpha.length; i++) {
            this.crop = {
                alpha: 'string',
                records: []
            }
            this.crop = {
                alpha: this.alpha[i],
                records: this.cropsData['CropList'].filter(a => a.Name.toString().charAt(0) == this.alpha[i])
            }

            this.crops.push(this.crop);
        }

        this.form = this.fb.group({
            cardNumber: ['', CreditCardValidator.validateCardNumber],
            cardExpDate: ['', CreditCardValidator.validateCardExpiry],
            cardCvv: ['', CreditCardValidator.validateCardCvc],
            cardName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        });
        this.allcrops = this.crops;
    }

    ngOnInit() {
        this.step1Form = new FormGroup({
            firstName: new FormControl('', [
                Validators.required
            ]),
            lastName: new FormControl('', [
                Validators.required
            ]),
            email: new FormControl('', [
                Validators.required, Validators.pattern(this._emailRegEx)
            ]),
            country: new FormControl('', [
                Validators.required
            ]),
        });
        //this.step1Form.controls['country'].setValue('Afghanistan', { onlySelf: true });

        this.step2Form = new FormGroup({
            cropName: new FormControl('', [
                Validators.required
            ]),
            variety: new FormControl({ value: '', disabled: true }, [
                Validators.required
            ]),
            specifics: new FormControl({ value: '', disabled: true }, [
                Validators.required
            ]),
            plotSize: new FormControl('', [
                Validators.required
            ]),
            plotSizeUnit: new FormControl('', [
                Validators.required
            ]),
            averageYield: new FormControl('', [
                Validators.required
            ]),
            averageYieldUnit: new FormControl('', [
                Validators.required
            ]),
        });
        this.step2Form.controls['plotSizeUnit'].setValue('ppm', { onlySelf: true });
        this.step2Form.controls['averageYieldUnit'].setValue('ppm', { onlySelf: true });

        this.step3Form = new FormGroup({
            texture: new FormControl('', [
                Validators.required
            ]),
            organicMatter: new FormControl('', [
                Validators.required
            ]),
            ph: new FormControl('', [
                Validators.required
            ]),
            nutrientData: new FormArray([]),
        });
        this.step3Form.controls['texture'].setValue('1', { onlySelf: true });

        for (let i = 0; i < this.type.length; i++) {
            const control = <FormArray>this.step3Form.controls['nutrientData'];
            control.push(this.nutrientModel());
        }

        this.service.getUnites()
            .subscribe(data => {
                this.unitesData = data;
            })

        this.step5Form = new FormGroup({
            cardNo: new FormControl('', [
                Validators.required
            ]),
            expMonth: new FormControl('', [
                Validators.required
            ]),
            expYear: new FormControl('', [
                Validators.required
            ]),
            cvc: new FormControl('', [
                Validators.required
            ]),
        });
        console.log(this.payUrl)
        if (this.payUrl == 'Y') {
            this.form1 = JSON.parse(localStorage.getItem("form1"));
            this.form2 = JSON.parse(localStorage.getItem("form1"));
            this.form3 = JSON.parse(localStorage.getItem("form1"));
            this.cropId = JSON.parse(localStorage.getItem("cropid"));
            this.convertData = JSON.parse(localStorage.getItem("convert"));
            if (this.form1) {
                // console.log(this.form1)
                // this.step1Form.controls['firstName'].setValue(this.form1.firstName);
                // this.step1Form.controls['lastName'].setValue(this.form1.lastName);
                // this.step1Form.controls['email'].setValue(this.form1.email);
                // this.step1Form.controls['country'].setValue(this.form1.country);

                this.isPay = true;
                this.getReport();
                this.stepIndex = 4;
            } else {
                window.location.href = '';
            }

        } else {
            this.router.navigate['/'];
        }
    }

    nutrientModel() {
        return this.fb.group({
            Id: [''],
            nutrient: ['1', Validators.required],
            nutrientUnit: ['ppm', Validators.required],
            extMethod: ['1', Validators.required],
            value: ['', Validators.required],
        });
    }

    changeText1(name, id) {
        this.step2Form.controls['cropName'].setValue(name);
        this.selectedCrop = name;
        this.varietyData = [];
        this.soilType = [];
        this.step2Form.controls['variety'].disable();
        this.step2Form.controls['specifics'].disable();
        this.cropId = id;
        this.service.postLogin()
            .subscribe(data => {
                this.service.getVarieties(data.UserId, data.Token, id)
                    .subscribe(data1 => {
                        if (data1) {
                            this.varietyData = data1.Varieties.Variety;
                            this.step2Form.controls['variety'].enable();
                            this.step2Form.controls['specifics'].enable();
                            this.soilType = data1.Varieties.Variety[0].SoilTypes.SoilType;
                        }
                    });
            });
        localStorage.setItem("cropid", JSON.stringify(this.cropId));
    }

    changeText2(event) {
        this.soilType = [];
        this.step2Form.controls['specifics'].disable();
        for (let i = 0; i < this.varietyData.length; i++) {
            if (this.varietyData[i].Id == event) {
                this.soilType = this.varietyData[i].SoilTypes.SoilType;
                this.varietyName = this.varietyData[i].Name;
            }

        }
        this.step2Form.controls['specifics'].enable();
    }

    step1() {
        this.form1 = this.step1Form.value;
        localStorage.setItem("form1", JSON.stringify(this.form1));
        console.log(this.form1)
    }
    step2() {
        this.form2 = this.step2Form.value;
        localStorage.setItem("form2", JSON.stringify(this.form2));
        console.log(this.form2)
    }
    step3() {
        this.form3 = this.step3Form.value;
        this.convertData = [];
        console.log(this.form3)
        for (let i = 0; i < this.form3.nutrientData.length; i++) {
            let fill = this.alldata[i];
            //localStorage.removeItem("covert");
            for (let j = 0; j < fill.nutrients.length; j++) {
                if (fill.nutrients[j].value.id == this.form3.nutrientData[i].nutrient) {
                    this.form3.nutrientData[i].nutrient = fill.nutrients[j].value.name;
                }
            }
            for (let j = 0; j < fill.extMethod.length; j++) {
                if (fill.extMethod[j].value.id == this.form3.nutrientData[i].extMethod) {
                    this.form3.nutrientData[i].extMethod = fill.extMethod[j].value.name;
                }
            }
            this.service.postConvertionValue(this.form3.nutrientData[i], this.type[i])
                .subscribe(data => {
                    this.convertData.push(data);
                    localStorage.setItem("convert", JSON.stringify(this.convertData));
                });
            console.log(this.convertData)

        }
        localStorage.setItem("form3", JSON.stringify(this.form3));
    }

    getReport() {

        this.service.postLogin()
            .subscribe(data => {
                this.service.postReport(this.form1, this.form2, this.form3, this.convertData, this.cropId, data.UserId, data.Token)
                    .subscribe(data1 => {
                        this.reportData = data1;
                    });
            });

    }

    changed() {

        (this.step2Form.controls["cropName"] as FormControl).valueChanges.subscribe(value => {
            if (value) {
                this.crops = this.crops.filter(a => a.alpha == value.toString().toUpperCase().charAt(0));
            } else {
                this.crops = this.allcrops;
            }
        });

    }
}