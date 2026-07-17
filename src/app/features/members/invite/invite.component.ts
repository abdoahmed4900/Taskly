import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invite',
  standalone: true,
  imports: [],
  templateUrl: './invite.component.html',
})
export class InviteComponent implements OnInit{
  route = inject(ActivatedRoute)

 ngOnInit() {
  this.route.queryParamMap.subscribe(params => {
    const token = params.get('token');

    console.log(token);
  });
}
}
