export class Storage<T> {
  private items: T[] = [];
  public addItem(item: T): void {
    this.items.push(item);
  }
  public removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  public getAllItems(): T[] {
    return this.items;
  }
}
