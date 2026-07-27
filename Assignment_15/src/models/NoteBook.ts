import { Note } from './Note';

export class NoteBook {
  private notes: Note[] = [];

  constructor(
    public id: number,
    public name: string,
  ) {}

  public addNote(note: Note): void {
    this.notes.push(note);
    console.log(`"${note.title}" added successfully.`);
  }

  public removeNote(noteId: number): void {
    this.notes = this.notes.filter((note) => note.id !== noteId);
    console.log(`Note ${noteId} removed.`);
  }

  public displayNotes(): void {
    console.log(`Notebook: ${this.name}`);
    this.notes.forEach((note) => {
      console.log(`${note.id} - ${note.title}`);
    });
  }
}
