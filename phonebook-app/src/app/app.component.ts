import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PhonebookService } from "./service/phonebook.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Customer } from "./model/customer.model";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  phonebookForm: FormGroup;
  customers: Customer[] = [];

  constructor(private formBuilder: FormBuilder, private phonebookService: PhonebookService) {
    this.phonebookForm = this.formBuilder.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });
  }

  searchByName(): void {
    const nameControl = this.phonebookForm.get('name');
    if (nameControl && nameControl.value) {
      const name = nameControl.value;
      this.customers = this.phonebookService.searchByName(name);
      console.log('Search by Name Results:', this.customers);
    }
  }


  searchByPhoneNumber(): void {
    const phoneNumberControl = this.phonebookForm.get('phoneNumber');
    if (phoneNumberControl && phoneNumberControl.value) {
      const phoneNumber = phoneNumberControl.value;
      const results = this.phonebookService.searchByPhoneNumber(phoneNumber);
      console.log('Search by Phone Number Results:', results);
    }
  }

  addData(): void {
    const nameControl = this.phonebookForm.get('name');
    const phoneNumberControl = this.phonebookForm.get('phoneNumber');

    if (nameControl && phoneNumberControl && nameControl.value && phoneNumberControl.value) {
      const name = nameControl.value;
      const phoneNumber = phoneNumberControl.value;

      const customer = {
        id: Date.now(),
        name: name,
        phoneNumbers: [phoneNumber],
      };

      const phone = {
        id: Date.now(),
        number: phoneNumber,
        customerIds: [customer.id],
      };

      this.phonebookService.addCustomer(customer);
      this.phonebookService.addPhone(phone);

      // Update the customers array
      this.customers = Array.from(this.phonebookService.getCustomers());

      // Reset the form
      this.phonebookForm.reset();
    }
  }
}
