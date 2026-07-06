import { Component, model } from '@angular/core';

@Component({
  selector: 'app-details-icon',
  standalone: true,
  imports: [],
  templateUrl: './details-icon.component.html',
  styleUrl: './details-icon.component.css',
})
export class DetailsIconComponent {
  isActive = model<boolean>();
}
