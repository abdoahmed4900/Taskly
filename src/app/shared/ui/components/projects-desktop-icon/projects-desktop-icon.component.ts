import { Component, model } from '@angular/core';

@Component({
  selector: 'app-projects-desktop-icon',
  standalone: true,
  imports: [],
  templateUrl: './projects-desktop-icon.component.html',
  styleUrl: './projects-desktop-icon.component.css',
})
export class ProjectsDesktopIconComponent {
  isActive = model<boolean>();
}
