import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service'
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
    private auth: AuthService,
    private queueService: QueueService) { }

  ngOnInit() {
    this.isLoading = true;
    this.queueService.queuePop({name: 'BreachedAcounts'})
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe((queue: string) => { this.queue = queue; });
  }

}
