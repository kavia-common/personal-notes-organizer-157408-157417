import { Routes } from '@angular/router';
import { NoteListComponent } from './components/note-list/note-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/notes', pathMatch: 'full' },
  { path: 'notes', component: NoteListComponent },
  { path: 'folder/:folderId', component: NoteListComponent }
];
