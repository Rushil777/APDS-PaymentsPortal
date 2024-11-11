import { provideHttpClient, withFetch } from '@angular/common/http';
import { Component } from '@angular/core';
import { DiaryComponent } from './diary/diary.component';  // Adjust path as needed
import { RouterModule } from '@angular/router';

@Component({ 
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], 
  standalone: true,
  imports:[DiaryComponent, RouterModule]
})

export class AppComponent {
  title = 'PaymentsPortalAPDS';
}
