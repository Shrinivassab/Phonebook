// src/app/phonebook.service.ts
import { Injectable } from '@angular/core';
import { Customer } from "../model/customer.model";
import { Phone } from "../model/phone.model";

@Injectable({
  providedIn: 'root',
})
export class PhonebookService {
  private customers: Customer[] = [];
  private phones: Phone[] = [];

  // Customer CRUD operations
  addCustomer(customer: Customer): void {
    this.customers.push(customer);
  }

  getCustomerById(id: number): Customer | undefined {
    return this.customers.find((c) => c.id === id);
  }

  // Phone CRUD operations
  addPhone(phone: Phone): void {
    this.phones.push(phone);
    // Update customer references
    phone.customerIds.forEach((customerId) => {
      const customer = this.getCustomerById(customerId);
      if (customer) {
        customer.phoneNumbers.push(phone.number);
      }
    });
  }

  getPhoneById(id: number): Phone | undefined {
    return this.phones.find((p) => p.id === id);
  }

  // Search methods
  searchByName(name: string): Customer[] {
    const results = this.customers.filter((c) => c.name.toLowerCase().includes(name.toLowerCase()));
    return results;
  }

  searchByPhoneNumber(number: string): Customer[] {
    const phone = this.phones.find((p) => p.number === number);
    if (phone) {
      const results = phone.customerIds.map((customerId) => this.getCustomerById(customerId)).filter(Boolean) as Customer[];
      return results;
    }
    return [];
  }
}
