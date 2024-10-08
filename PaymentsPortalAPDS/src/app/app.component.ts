import { provideHttpClient, withFetch } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({ 
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,  // Marking as a standalone component
  imports: [RouterModule],  // Importing standalone components
})

export class AppComponent {
}
