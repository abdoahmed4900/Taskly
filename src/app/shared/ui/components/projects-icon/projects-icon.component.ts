import { Component, model } from '@angular/core';

@Component({
  selector: 'app-projects-icon',
  standalone: true,
  imports: [],
  templateUrl: './projects-icon.component.html',
  styleUrl: './projects-icon.component.css',
})
export class ProjectsIconComponent {
  isActive = model<boolean>();
}
