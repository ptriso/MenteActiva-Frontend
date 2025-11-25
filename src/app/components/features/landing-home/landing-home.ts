import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Para los [routerLink]
import { MaterialModule } from '../../shared/material/material.imports'; // Para el acordeón

@Component({
  selector: 'app-landing-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule    // <-- Necesario para MatExpansionModule
  ],
  templateUrl: './landing-home.html',
  styleUrls: ['./landing-home.css']
})
export class LandingHome { // (O LandingHomeComponent)

  // --- Datos del Equipo (de image_555bc3.png y image_555bdf.png) ---
  teamMembers = [
    { name: 'Pietro Paolo Trisoglio Rossini', role: 'Team Leader', img: '/pietro.png' },
    { name: 'Alexander Junior Aquino Perez', role: 'Desarrollador', img: '/alexander.png' },
    { name: 'Eduardo Nicolas Rojas Araujo', role: 'Desarrollador', img: '/eduardo.png' },
    { name: 'Carlos Marcelo Lora Carrión', role: 'Desarrollador', img: '/carlos-marcelo.png' },
    { name: 'Carlos Aarón Rosado Ortiz', role: 'Desarrollador', img: '/carlos-aaron.png' },
    { name: 'Diego Aarón Peralta Pinedo', role: 'Desarrollador', img: '/diego.png' }
  ];

  // --- Datos de FAQ (de image_555c1a.png / image_565000.png) ---
  faqs = [
    {
      question: '¿Qué puedo hacer dentro de la aplicación?',
      answer: 'La aplicación ofrece varias herramientas de apoyo. Incluye un chatbot con inteligencia artificial, acceso a videos interactivos, talleres en vivo y, lo más importante, asistencia profesional.'
    },
    {
      question: '¿Qué problema busca solucionar?',
      answer: 'Esta aplicación busca ayudar a los jóvenes que se sienten muy estresados, ansiosos o deprimidos. Está pensada para aliviar la presión que sienten por la escuela, la familia o las redes sociales.'
    },
    {
      question: '¿Cual es la disponibilidad del servicio?',
      answer: 'La aplicación está diseñada para estar disponible para ti las 24 horas del día, los 7 días de la semana. Así, puedes usar sus herramientas y contenidos personalizados en cualquier momento que lo necesites.'
    },
    {
      question: '¿Qué tipo de contenido puedo encontrar?',
      answer: 'Encontrarás videos interactivos y talleres en vivo. También verás un ChatBot para conversar, una sección de Comunidad para conectar con otros jóvenes, un Calendario de actividades y la sección de Asistencia Psicológica.'
    },
    {
      question: '¿La plataforma es gratuita?',
      answer: 'Sí es gratuita, pero tienes algunas funcionalidades que son de pago. Esto significa que para acceder a las mejores funciones, como "talleres exclusivos", "contenido premium" o hablar con los profesionales, necesitarías ser un "usuario premium".'
    }
  ];
}
