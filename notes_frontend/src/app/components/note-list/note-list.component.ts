import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Note } from '../../models/note.model';
import { NotesService } from '../../services/notes.service';
import { CreateNoteDialogComponent } from '../create-note-dialog/create-note-dialog.component';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit {
  notes: Note[] = [];
  currentFolderId: string | null = null;

  constructor(
    private notesService: NotesService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentFolderId = params['folderId'] || null;
      this.loadNotes();
    });
  }

  loadNotes(): void {
    if (this.currentFolderId) {
      this.notesService.getNotesByFolder(this.currentFolderId).subscribe(
        notes => this.notes = notes
      );
    } else {
      this.notesService.getNotes().subscribe(
        notes => this.notes = notes
      );
    }
  }

  openCreateNoteDialog(): void {
    const dialogRef = this.dialog.open(CreateNoteDialogComponent, {
      width: '600px',
      data: { folderId: this.currentFolderId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notesService.createNote({
          ...result,
          folderId: this.currentFolderId || undefined
        }).subscribe();
      }
    });
  }

  deleteNote(noteId: string | undefined): void {
    if (noteId && confirm('Are you sure you want to delete this note?')) {
      this.notesService.deleteNote(noteId).subscribe();
    }
  }
}
