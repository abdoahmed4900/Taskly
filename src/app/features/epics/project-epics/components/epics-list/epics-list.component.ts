import { Component, input, model } from '@angular/core';
import { Project } from '../../../../projects/model/project';
import { RouterLink } from '@angular/router';
import { Epic } from '../../../epic';

@Component({
  selector: 'app-epics-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './epics-list.component.html',
})
export class EpicsListComponent {
  project = input<Project>();
  currentEpics = input<Epic[]>();
  totalEpics = model<number>();
  currentPage = model<number>();
}
