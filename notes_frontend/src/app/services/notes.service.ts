import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private apiUrl = '/api/notes';
  private notesSubject = new BehaviorSubject<Note[]>([]);
  notes$ = this.notesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadNotes();
  }

  private loadNotes() {
    this.http.get<Note[]>(this.apiUrl).subscribe(
      notes => this.notesSubject.next(notes),
      error => console.error('Error loading notes:', error)
    );
  }

  getNotes(): Observable<Note[]> {
    return this.notes$;
  }

  getNotesByFolder(folderId: string): Observable<Note[]> {
    return this.notes$.pipe(
      map(notes => notes.filter(note => note.folderId === folderId))
    );
  }

  getNote(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}/${id}`);
  }

  createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note).pipe(
      map(newNote => {
        const currentNotes = this.notesSubject.value;
        this.notesSubject.next([...currentNotes, newNote]);
        return newNote;
      })
    );
  }

  updateNote(id: string, note: Partial<Note>): Observable<Note> {
    return this.http.patch<Note>(`${this.apiUrl}/${id}`, note).pipe(
      map(updatedNote => {
        const currentNotes = this.notesSubject.value;
        const index = currentNotes.findIndex(n => n.id === id);
        if (index !== -1) {
          currentNotes[index] = updatedNote;
          this.notesSubject.next([...currentNotes]);
        }
        return updatedNote;
      })
    );
  }

  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        const currentNotes = this.notesSubject.value;
        this.notesSubject.next(currentNotes.filter(note => note.id !== id));
      })
    );
  }
}
