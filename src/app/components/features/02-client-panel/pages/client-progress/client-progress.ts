import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../../../shared/material/material.imports';
import {MatTableDataSource} from '@angular/material/table';
import {VideoProgressDTO} from '../../../../core/models/video-progress.dto';
import {VideoProgressService} from '../../services/video-progress.service';
import {AuthService} from '../../../../core/services/auth';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
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
// Columnas que se mostrarán
  displayedColumns: string[] = ['id', 'videoTitle', 'professionalName', 'duration', 'percentage', 'completed'];

  // Fuente de datos para la tabla
  dataSource = new MatTableDataSource<VideoProgressDTO>();
  totalRegistros = 0;

  // Referencias al Paginador y al Sort (Ordenamiento)
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private progressService: VideoProgressService,
    private authService: AuthService,
    private dialog: MatDialog,       // 👈 ya con tipo importado
    private snackBar: MatSnackBar,   // 👈 ya con tipo importado
    private videoService: VideoService
  ) {}

  ngOnInit() {
    this.cargarLista();
  }

  ngAfterViewInit() {
    // Conectamos el paginador y el sort a la tabla
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarLista() {
    const clientId = this.authService.getProfileId();

    this.progressService.getAll().subscribe({
      next: (data) => {

        // 1. Filtramos por el cliente actual
        // (Nota: 'clientId' debe coincidir con el nombre en tu DTO, puede ser client_id o clientId)
        const misVideos = data.filter(item => item.clientId === clientId);

        // 2. ¡YA NO NECESITAMOS MAPEO COMPLEJO NI SIMULACIÓN!
        // Los datos ya vienen listos del backend
        this.dataSource.data = misVideos;

        this.totalRegistros = misVideos.length;

        // El filtro de búsqueda sigue funcionando igual
        this.dataSource.filterPredicate = (data: VideoProgressDTO, filter: string) =>
          data.videoTitle.toLowerCase().includes(filter);
      },
      error: (err) => console.error(err)
    });
  }

  // Función de búsqueda
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
