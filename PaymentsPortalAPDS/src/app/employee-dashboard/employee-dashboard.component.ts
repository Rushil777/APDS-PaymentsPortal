import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PaymentService } from '../payment.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'],
})
export class EmployeeDashboardComponent {

}
