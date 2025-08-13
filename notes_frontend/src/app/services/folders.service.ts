import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Folder } from '../models/folder.model';

@Injectable({
  providedIn: 'root'
})
export class FoldersService {
  private apiUrl = '/api/folders';
  private foldersSubject = new BehaviorSubject<Folder[]>([]);
  folders$ = this.foldersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFolders();
  }

  private loadFolders() {
    this.http.get<Folder[]>(this.apiUrl).subscribe(
      folders => this.foldersSubject.next(folders),
      error => console.error('Error loading folders:', error)
    );
  }

  getFolders(): Observable<Folder[]> {
    return this.folders$;
  }

  getFolder(id: string): Observable<Folder> {
    return this.http.get<Folder>(`${this.apiUrl}/${id}`);
  }

  createFolder(folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>): Observable<Folder> {
    return this.http.post<Folder>(this.apiUrl, folder).pipe(
      map(newFolder => {
        const currentFolders = this.foldersSubject.value;
        this.foldersSubject.next([...currentFolders, newFolder]);
        return newFolder;
      })
    );
  }

  updateFolder(id: string, folder: Partial<Folder>): Observable<Folder> {
    return this.http.patch<Folder>(`${this.apiUrl}/${id}`, folder).pipe(
      map(updatedFolder => {
        const currentFolders = this.foldersSubject.value;
        const index = currentFolders.findIndex(f => f.id === id);
        if (index !== -1) {
          currentFolders[index] = updatedFolder;
          this.foldersSubject.next([...currentFolders]);
        }
        return updatedFolder;
      })
    );
  }

  deleteFolder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        const currentFolders = this.foldersSubject.value;
        this.foldersSubject.next(currentFolders.filter(folder => folder.id !== id));
      })
    );
  }
}
