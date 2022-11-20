import {Component, OnInit} from '@angular/core';
import {ElectricalDevice} from "../../model/electrical-device";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ResultsModalComponent} from "./results-modal/results-modal.component";
import {isNumberValidator} from "./validators/is-number-validator";

@Component({
  selector: 'app-estimator',
  templateUrl: './estimator.component.html',
  styleUrls: ['./estimator.component.scss']
})
export class EstimatorComponent implements OnInit {

  public electricalDevices: Array<ElectricalDevice> = [];
  public powerFactor: number = 0.8;
  public totalLoadInWatts: number = 0;
  public totalLoadInKiloWatts: number = 0;
  public powerInKVA: number = 0;
  public batteryBackupTime: number = 0;
  public batteryVoltageOptions = ['12', '24'];


  public electricalDeviceFormArray: FormArray = this.fb.array([]);
  public estimateForm: FormGroup = this.fb.group({
    'electricalDeviceFormArray': this.electricalDeviceFormArray,
    'powerFactor': new FormControl('', [Validators.required, isNumberValidator(), Validators.max(1)]),
    'batteryAmpHours': new FormControl('', [Validators.required, isNumberValidator()]),
    'batteryVoltage': new FormControl('', [Validators.required, isNumberValidator()]),
    'numberOfBatteries': new FormControl('', [Validators.required, isNumberValidator()]),
  });
  public displayEstimateModal: boolean;

  constructor(private fb: FormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.createInitialForm();
    console.log(this.estimateForm);
  }

  get getElectricalDevices() {
    return this.estimateForm.controls['electricalDeviceFormArray'] as FormArray;
  }

  createElectricalDeviceFormGroup(): FormGroup {
   return this.fb.group({
     'deviceName': new FormControl('', [Validators.required]),
     'wattage': new FormControl('', [Validators.required, isNumberValidator()]),
     'quantity': new FormControl('', [Validators.required, isNumberValidator()])
   })
  }

  public addElectricalDeviceFormGroup() {
    this.electricalDeviceFormArray.push(this.createElectricalDeviceFormGroup());
  }

  removeDevice(index: number) {
    this.electricalDeviceFormArray.removeAt(index);
  }

  public getSummary() {
    if (!(this.estimateForm.touched && this.estimateForm.invalid)) {
      const rawValues = this.estimateForm.getRawValue();
      this.estimatePowerRequirements(rawValues);
    }
  }

  createInitialForm() {
    this.addElectricalDeviceFormGroup();
  }

  calculateTotalLoadInWatts(electricalDevices: Array<ElectricalDevice>): number {
    let totalWattage: number = 0;
    console.log(electricalDevices);
    electricalDevices
      .map((device: ElectricalDevice) => {
        totalWattage += device.wattage * device.quantity;
      });
    return totalWattage;
  }

  calculateTotalLoadInKiloWatts(totalLoadInWatts: number): number {
    return totalLoadInWatts / 1000;
  }

  calculatePowerInKVA(): void {
    this.powerInKVA = this.totalLoadInKiloWatts / this.powerFactor;
  }

  calculateBatteryBackupTime(rawValues: {}) {
    this.batteryBackupTime = (+rawValues['batteryAmpHours'] * +rawValues['batteryVoltage'] * +rawValues['numberOfBatteries']) / +this.totalLoadInWatts;
  }

  estimatePowerRequirements(rawValues: {}) {
    this.electricalDevices = rawValues['electricalDeviceFormArray'];
    this.totalLoadInWatts = this.calculateTotalLoadInWatts(this.electricalDevices);
    this.totalLoadInKiloWatts = this.calculateTotalLoadInKiloWatts(this.totalLoadInWatts);
    this.calculatePowerInKVA();
    this.calculateBatteryBackupTime(rawValues);
    this.openDialog();
  }

  openDialog(): void {
    this.dialog.open(ResultsModalComponent, {
      width: '300px',
      data: {
        electricalDevices: this.electricalDevices,
        powerFactor: this.powerFactor,
        totalLoadInWatts: this.totalLoadInWatts,
        totalLoadInKiloWatts: this.totalLoadInKiloWatts,
        powerInKVA: this.powerInKVA,
        batteryBackupTime: this.batteryBackupTime
      }
    });
  }
}
