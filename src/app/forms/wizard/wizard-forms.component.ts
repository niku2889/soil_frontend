import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { SoilService } from './soil.service';
import { SelectItemGroup } from 'primeng/api';
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
    crop: {
        alpha: string,
        records: any[]
    }
    selectedCrop: any;
    varietyData: any[] = [];
    isVarietry: boolean = true;
    isSpecific: boolean = true;
    soilType: any[] = [];

    constructor(private service: SoilService) {
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
                            //console.log(this.alldata);
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
        console.log(this.cropsData);
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
            console.log(this.crops);
        }
    }

    ngOnInit() {
        $.getScript('./assets/js/jquery.steps.min.js');
        $.getScript('./assets/js/wizard-steps.js');

        this.service.getUnites()
            .subscribe(data => {
                this.unitesData = data;
            })


    }


    changeText1(name, id) {
        this.selectedCrop = name;
        this.isVarietry = true;
        this.varietyData = [];
        this.soilType = [];
        this.isSpecific = true;

        this.service.postLogin('sagi4422@gmail.com', '123.12.1.0', 'abcd1234')
            .subscribe(data => {
                this.service.getVarieties(data.UserId, data.Token, id)
                    .subscribe(data1 => {
                        if (data1) {
                            this.varietyData = data1.Varieties.Variety;
                            this.isVarietry = false;
                            this.isSpecific = false;
                            this.soilType = data1.Varieties.Variety[0].SoilTypes.SoilType;
                        }
                        console.log(this.varietyData)
                        console.log(this.soilType)
                    });
            });
    }

    changeText2(event) {
        this.soilType = [];
        this.isSpecific = true;
        console.log(this.varietyData);
        for(let i=0;i< this.varietyData.length;i++){
            if(this.varietyData[i].Id == event)
                this.soilType = this.varietyData[i].SoilTypes.SoilType;
        }
        this.isSpecific = false;

        console.log(this.soilType)
    }

}