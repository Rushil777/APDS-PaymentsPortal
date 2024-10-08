import { provideHttpClient, withFetch } from '@angular/common/http';
import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';  // Adjust path as needed
import { DiaryComponent } from './diary/diary.component';  // Adjust path as needed
import { RouterModule } from '@angular/router';

@Component({ 
  selector: 'app-root',
  templateUrl: './app.component.html',
<<<<<<< HEAD
  styleUrls: ['./app.component.css'],
  standalone: true,  // Marking as a standalone component
  imports: [HeaderComponent, DiaryComponent, RouterModule],  // Importing standalone components
=======
  styleUrls: ['./app.component.css'] 

>>>>>>> origin/main
})

export class AppComponent {
}
