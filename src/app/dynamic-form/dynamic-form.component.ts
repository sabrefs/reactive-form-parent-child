import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  dynamicForm: FormGroup | any;
  @Input() level: number = 0;
  @Input() submitted: boolean = false;
  @Output() childGroupForm = new EventEmitter<FormGroup>();
  ColorRandom: any;
  displayStyle = "none";
  
  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.dynamicForm =  this.fb.group({
      group: this.fb.array([])
    })

    this.addFormRow()

    this.childGroupForm.emit(this.dynamicForm.controls['group']);

    this.dynamicForm.valueChanges.subscribe((e: any) => {
      this.childGroupForm.emit(this.dynamicForm.controls['group']);
    });
  }

  addFormRow(){
    let items = this.dynamicForm.get("group") as FormArray;
    items.push(this.createItem());
  }

  delete(i: any){
    this.dynamicForm.get("group").controls.splice(i, 1)
  }

  createItem(){
    return this.fb.group({
      name: ['', Validators.required],
        dataType:['',Validators.required],
        value:['',Validators.required],
        validators: this.fb.group({
          isMandatory: [true],
          minLength: ['', Validators.required],
          maxLength: ['', Validators.required],
          regex: ['']
        }),
        nestedFieldsBoolean: [false],
        nestedFields: this.fb.group([])
    })
  }

  changeType(e: any, indx: any){
    if(e.target.value == 'json' || e.target.value == 'boolean'){
      this.dynamicForm.get('group').controls[indx].get('value').clearValidators();
      this.dynamicForm.get('group').controls[indx].get('value').updateValueAndValidity();
      this.dynamicForm.get('group').controls[indx].get('validators').get('minLength').clearValidators();
      this.dynamicForm.get('group').controls[indx].get('validators').get('minLength').updateValueAndValidity();
      this.dynamicForm.get('group').controls[indx].get('validators').get('maxLength').clearValidators();
      this.dynamicForm.get('group').controls[indx].get('validators').get('maxLength').updateValueAndValidity();

      if(e.target.value == 'json'){
        this.dynamicForm.get('group').controls[indx].get('nestedFieldsBoolean').setValue(true);
      }else{
        this.dynamicForm.get('group').controls[indx].get('nestedFieldsBoolean').setValue(false);
        this.dynamicForm.controls['group'].controls[indx]?.get('nestedFields').removeControl();
      }
    }else{
      this.dynamicForm.get('group').controls[indx].get('value').setValidators(Validators.required);
      this.dynamicForm.get('group').controls[indx].get('value').updateValueAndValidity();
      this.dynamicForm.get('group').controls[indx].get('validators').get('minLength').setValidators(Validators.required);
      this.dynamicForm.get('group').controls[indx].get('validators').get('minLength').updateValueAndValidity();
      this.dynamicForm.get('group').controls[indx].get('validators').get('maxLength').setValidators(Validators.required);
      this.dynamicForm.get('group').controls[indx].get('validators').get('maxLength').updateValueAndValidity();
      
      this.dynamicForm.get('group').controls[indx].get('nestedFieldsBoolean').setValue(false);
      this.dynamicForm.controls['group'].controls[indx]?.get('nestedFields').removeControl();
    }
  }

  updateParentGroup(childForm: FormGroup, i: any){
    const groupFormGroup = this.dynamicForm.get('group').controls[i].get('nestedFields') as FormGroup;
    Object.keys(childForm.controls).forEach((controlName) => {
      groupFormGroup.addControl(controlName, childForm.get(controlName));
    });
  }

  removeChild(i: any){
    this.dynamicForm.controls['group'].controls[i]?.get('nestedFields').removeControl();
  }

  getRandomcolors(index?: any) {
    const colors: any[] = ["#FFA800", "#1A85D6", "#07B797", "#738199", "#B58848", "#706FD3", "#F3819A", "#00F000", "#52E6CB", "#232459", "#EB55D7", "#738199", "#B58848", "#706FD3", "#F3821A", "#00F210", "#72E8CB", "#235359", "#EB32D7"];
    let colorIndex = Math.floor(Math.random() * colors.length);
    return colors[colorIndex];

  }

  submit(){
    this.submitted = true;
    if(this.dynamicForm.valid){
      this.displayStyle = "block"; 
    }
  }

  closePopup() { 
    this.displayStyle = "none"; 
  } 
}
