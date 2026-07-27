import { NoteBook } from './NoteBook';

export class User {
  public id!: number;
  public name!: string;
  protected email!: string;
  private password!: string;
  public phone!: string;
  private _age!: number;
  private notebooks: NoteBook[] = [];

  constructor(
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    age: number,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this._age = age;
  }
  public set age(value: number) {
    if (value < 18 || value > 60) {
      throw new Error('Age must be between 18 and 60.');
    }
    this._age = value;
  }
  public get age(): number {
    return this._age;
  }
  public displayInfo(): void {
    console.log('===== User Information =====');
    console.log(`ID: ${this.id}`);
    console.log(`Name: ${this.name}`);
    console.log(`Email: ${this.email}`);
    console.log(`Phone: ${this.phone}`);
    console.log(`Age: ${this.age}`);
  }

  public addNotebook(notebook: NoteBook): void {
    this.notebooks.push(notebook);
  }
  public getNotebooks(): NoteBook[] {
    return this.notebooks;
  }
}
