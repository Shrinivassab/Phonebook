import { Injectable } from '@angular/core';
import { Customer } from "../model/customer.model";
import { Phone } from "../model/phone.model";

@Injectable({
  providedIn: 'root',
})
export class PhonebookService {
  private customers: Map<number, Customer> = new Map();
  private phones: Map<number, Phone> = new Map();
  private nextCustomerId = 1;
  private nextPhoneId = 1;

  // Customer CRUD operations
  addCustomer(customer: Customer): void {
    const customerId = this.nextCustomerId++;
    customer.id = customerId;
    this.customers.set(customerId, customer);
  }

  getCustomerById(id: number): Customer | undefined {
    return this.customers.get(id);
  }

  // Phone CRUD operations
  addPhone(phone: Phone): void {
    const phoneId = this.nextPhoneId++;
    phone.id = phoneId;
    this.phones.set(phoneId, phone);

    phone.customerIds.forEach((customerId) => {
      const customer = this.getCustomerById(customerId);
      if (customer) {
        customer.phoneNumbers.push(phone.number);
      }
    });
  }

  getPhoneById(id: number): Phone | undefined {
    return this.phones.get(id);
  }

  // Search methods
  searchByName(name: string): Customer[] {
    const results: Customer[] = [];
    const searchName = name.toLowerCase();

    for (const customer of this.customers.values()) {
      const customerName = customer.name.toLowerCase();

      // Check if the searchName is a substring of customerName
      if (customerName.includes(searchName)) {
        results.push(customer);
      }

      // Check if the searchName matches any part of the first or last name
      const customerParts = customerName.split(' ');
      for (const part of customerParts) {
        if (part.includes(searchName)) {
          results.push(customer);
          break;
        }
      }
    }

    return results;
  }

  searchByPhoneNumber(number: string): Customer[] {
    const phone = Array.from(this.phones.values()).find((p) => p.number === number);
    if (phone) {
      const results: Customer[] = phone.customerIds.map((customerId) => this.getCustomerById(customerId)).filter(Boolean) as Customer[];
      return results;
    }
    return [];
  }

  getCustomers(): Customer[] {
    return Array.from(this.customers.values());
  }
}
