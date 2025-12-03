import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { StatisticsService } from '../../services/statistics.service';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics-dashboard.html',
  styleUrls: ['./statistics-dashboard.css']
})
export class StatisticsDashboard implements AfterViewInit, OnDestroy {

  mostViewedVideosChart: Chart | undefined;
  citasPorProfesionalChart: Chart | undefined;
  topEspecialidadesChart: Chart | undefined;
  topProfesionalesChart: Chart | undefined;

  isLoading = true;

  constructor(private statisticsService: StatisticsService) { }

  // ✅ CAMBIO IMPORTANTE: ngOnInit → ngAfterViewInit
  ngAfterViewInit(): void {
    // Pequeño delay para asegurar que el DOM está listo
    setTimeout(() => {
      this.loadAllStatistics();
    }, 100);
  }

  loadAllStatistics(): void {
    this.isLoading = true;
    let chartsLoaded = 0;
    const totalCharts = 4;

    const checkAllLoaded = () => {
      chartsLoaded++;
      if (chartsLoaded === totalCharts) {
        this.isLoading = false;
      }
    };

    // Videos más vistos
    this.statisticsService.getMostViewedVideos().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.createMostViewedVideosChart(data);
        }
        checkAllLoaded();
      },
      error: (error) => {
        console.error('Error al cargar videos más vistos:', error);
        checkAllLoaded();
      }
    });

    // Citas por profesional
    this.statisticsService.getCitasPorProfesional().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.createCitasPorProfesionalChart(data);
        }
        checkAllLoaded();
      },
      error: (error) => {
        console.error('Error al cargar citas por profesional:', error);
        checkAllLoaded();
      }
    });

    // Top especialidades
    this.statisticsService.getTopEspecialidades(5).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.createTopEspecialidadesChart(data);
        }
        checkAllLoaded();
      },
      error: (error) => {
        console.error('Error al cargar top especialidades:', error);
        checkAllLoaded();
      }
    });

    // Top profesionales
    this.statisticsService.getTopProfesionales(5).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.createTopProfesionalesChart(data);
        }
        checkAllLoaded();
      },
      error: (error) => {
        console.error('Error al cargar top profesionales:', error);
        checkAllLoaded();
      }
    });
  }

  createMostViewedVideosChart(data: any[]): void {
    const canvas = document.getElementById('mostViewedVideosChart') as HTMLCanvasElement;

    if (!canvas) {
      console.error('Canvas mostViewedVideosChart no encontrado');
      return;
    }

    if (this.mostViewedVideosChart) {
      this.mostViewedVideosChart.destroy();
    }

    this.mostViewedVideosChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.map(v => {
          const title = v.videoTitle || 'Sin título';
          return title.length > 30 ? title.substring(0, 30) + '...' : title;
        }),
        datasets: [{
          label: 'Total de Vistas',
          data: data.map(v => v.totalViews || 0),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Videos Más Vistos',
            font: { size: 18 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  createCitasPorProfesionalChart(data: any[]): void {
    const canvas = document.getElementById('citasPorProfesionalChart') as HTMLCanvasElement;

    if (!canvas) {
      console.error('Canvas citasPorProfesionalChart no encontrado');
      return;
    }

    if (this.citasPorProfesionalChart) {
      this.citasPorProfesionalChart.destroy();
    }

    this.citasPorProfesionalChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.map(p => `${p.nombre} ${p.apellido}`),
        datasets: [{
          label: 'Cantidad de Citas',
          data: data.map(p => p.cantidadDeCitas),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: 'Citas por Profesional',
            font: { size: 18 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  createTopEspecialidadesChart(data: any[]): void {
    const canvas = document.getElementById('topEspecialidadesChart') as HTMLCanvasElement;

    if (!canvas) {
      console.error('Canvas topEspecialidadesChart no encontrado');
      return;
    }

    if (this.topEspecialidadesChart) {
      this.topEspecialidadesChart.destroy();
    }

    this.topEspecialidadesChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: data.map(e => e.specialization),
        datasets: [{
          label: 'Total Citas',
          data: data.map(e => e.totalCitas),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right'
          },
          title: {
            display: true,
            text: 'Top Especialidades Más Solicitadas',
            font: { size: 18 }
          }
        }
      }
    });
  }

  createTopProfesionalesChart(data: any[]): void {
    const canvas = document.getElementById('topProfesionalesChart') as HTMLCanvasElement;

    if (!canvas) {
      console.error('Canvas topProfesionalesChart no encontrado');
      return;
    }

    if (this.topProfesionalesChart) {
      this.topProfesionalesChart.destroy();
    }

    this.topProfesionalesChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: data.map(p => `${p.name} ${p.lastname}`),
        datasets: [{
          label: 'Total Citas',
          data: data.map(p => p.totalCitas),
          backgroundColor: [
            'rgba(255, 159, 64, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)'
          ],
          borderColor: [
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right'
          },
          title: {
            display: true,
            text: 'Top 5 Profesionales con Más Citas',
            font: { size: 18 }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.mostViewedVideosChart) this.mostViewedVideosChart.destroy();
    if (this.citasPorProfesionalChart) this.citasPorProfesionalChart.destroy();
    if (this.topEspecialidadesChart) this.topEspecialidadesChart.destroy();
    if (this.topProfesionalesChart) this.topProfesionalesChart.destroy();
  }
}
