import { User } from './models/User';
import { Admin } from './models/Admin';
import { Note } from './models/Note';
import { NoteBook } from './models/NoteBook';
import { Storage } from './models/Storage';

// Create Users
const user1 = new User(1, 'Mark', 'mark@example.com', '123456', '01012345678', 22);

const user2 = new User(2, 'John', 'john@example.com', 'abcdef', '01198765432', 25);

console.log('===== Users =====');
user1.displayInfo();
console.log();
user2.displayInfo();

// Create Admin
const admin = new Admin(100, 'Admin', 'admin@example.com', 'admin123', '01234567890', 35);

console.log('\n===== Admin =====');
admin.displayInfo();
admin.manageNotes();

// Create Notebooks
const personalNotebook = new NoteBook(1, 'Personal Notes');
const workNotebook = new NoteBook(2, 'Work Notes');

// Aggregation
user1.addNotebook(personalNotebook);
user1.addNotebook(workNotebook);

// Create Notes
const note1 = new Note(
  1,
  'Shopping List',
  'Buy milk, bread, eggs, cheese, fruits and vegetables.',
  user1,
);

const note2 = new Note(
  2,
  'Meeting',
  'Project meeting tomorrow at 10 AM in the conference room.',
  user1,
);

const note3 = new Note(
  3,
  'Ideas',
  'Learn TypeScript OOP and practice UML diagrams every day.',
  user2,
);

// Composition
// Add notes to notebooks

personalNotebook.addNote(note1);
personalNotebook.addNote(note2);

workNotebook.addNote(note3);

// Display Notes
console.log('\n===== Personal Notebook =====');
personalNotebook.displayNotes();

console.log('\n===== Work Notebook =====');
workNotebook.displayNotes();

// Preview Notes
console.log('\n===== Note Preview =====');
console.log(note1.preview());
console.log(note2.preview());
console.log(note3.preview());

// Remove Note
console.log('\n===== Remove Note =====');
personalNotebook.removeNote(2);

personalNotebook.displayNotes();

// Generic Storage<User>
const userStorage = new Storage<User>();

userStorage.addItem(user1);
userStorage.addItem(user2);

console.log('\n===== Users in Storage =====');
console.log(userStorage.getAllItems());

// Generic Storage<Note>
const noteStorage = new Storage<Note>();

noteStorage.addItem(note1);
noteStorage.addItem(note2);

console.log('\n===== Notes in Storage =====');
console.log(noteStorage.getAllItems());
