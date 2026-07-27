import { User } from './User';

export class Note {
  constructor(
    public id: number,
    public title: string,
    public content: string,
    public author: User,
  ) {}

  public preview(): string {
    return this.content.length > 30 ? this.content.substring(0, 30) + '...' : this.content;
  }
}
