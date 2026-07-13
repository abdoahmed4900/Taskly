import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-show-members',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './show-members.component.html',
  styleUrl: './show-members.component.css',
})
export class ShowMembersComponent implements OnInit {
  isLoaded = signal(false);
  ngOnInit(): void {
    this.isLoaded.set(true);
  }
}
