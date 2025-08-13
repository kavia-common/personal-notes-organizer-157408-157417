import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { Folder } from '../../models/folder.model';
import { FoldersService } from '../../services/folders.service';
import { CreateFolderDialogComponent } from '../create-folder-dialog/create-folder-dialog.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  folders: Folder[] = [];

  constructor(
    private foldersService: FoldersService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.foldersService.getFolders().subscribe(
      folders => this.folders = folders
    );
  }

  openCreateFolderDialog(): void {
    const dialogRef = this.dialog.open(CreateFolderDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(folderName => {
      if (folderName) {
        this.foldersService.createFolder({ name: folderName }).subscribe();
      }
    });
  }
}
