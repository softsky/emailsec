import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AuthenticationService } from '../core/authentication/authentication.service';
import { QueueService } from './queue.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  queue: string;
  isLoading: boolean;

  constructor(
    public auth: AuthenticationService,
    private queueService: QueueService) { }

  ngOnInit() {
    this.isLoading = true;
    this.queueService.queuePop({name: 'BreachedAcounts'})
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe((queue: string) => { this.queue = queue; });
  }

}
