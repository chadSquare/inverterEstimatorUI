import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-results-modal',
  templateUrl: './results-modal.component.html',
  styleUrls: ['./results-modal.component.scss']
})
export class ResultsModalComponent implements OnInit {

  public displayedColumns: string[] = ['deviceName', 'wattage', 'quantity'];

  constructor(
    public dialogRef: MatDialogRef<ResultsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {},
  ) {}

  ngOnInit(): void {
  }

}
