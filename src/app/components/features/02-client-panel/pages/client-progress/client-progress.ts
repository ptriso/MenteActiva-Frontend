import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../../../shared/material/material.imports';
import {MatTableDataSource} from '@angular/material/table';
import {VideoProgressDTO} from '../../../../core/models/video-progress.dto';
import {VideoProgressService} from '../../services/video-progress.service';
import {AuthService} from '../../../../core/services/auth';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {VideoDTO, VideoService} from '../../services/video.service';
import {RegisterProgresssDialog} from '../../register-progresss-dialog/register-progresss-dialog';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-client-progress',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './client-progress.html',
  styleUrl: './client-progress.css',
})
export class ClientProgress implements OnInit, AfterViewInit{
  displayedColumns: string[] = ['id', 'videoTitle', 'professionalName', 'duration', 'percentage', 'completed'];

  dataSource = new MatTableDataSource<VideoProgressDTO>();
  totalRegistros = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private progressService: VideoProgressService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private videoService: VideoService
  ) {}

  ngOnInit() {
    this.cargarLista();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarLista() {
    const clientId = this.authService.getProfileId();

    this.progressService.getAll().subscribe({
      next: (data) => {

        const misVideos = data.filter(item => item.clientId === clientId);

        this.dataSource.data = misVideos;

        this.totalRegistros = misVideos.length;

        this.dataSource.filterPredicate = (data: VideoProgressDTO, filter: string) =>
          data.videoTitle.toLowerCase().includes(filter);
      },
      error: (err) => console.error(err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  openRegisterDialog(): void {
    const clientId = this.authService.getProfileId();
    if (clientId == null) {
      this.snackBar.open('Debes iniciar sesión para registrar tu progreso.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.videoService.listAll().subscribe({
      next: (videos: VideoDTO[]) => {
        const dialogRef = this.dialog.open(RegisterProgresssDialog, {
          width: '450px',
          data: { clientId, videos }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.cargarLista();
          }
        });
      },
      error: () => {
        this.snackBar.open('No se pudieron cargar los videos.', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
