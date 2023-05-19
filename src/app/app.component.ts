import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CurrentUserInterface } from 'src/app/auth/types/current-user.interface';
import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private socketService: SocketService
  ) {
    this.authService.getCurrentUser().subscribe({
      next: (currentUser: CurrentUserInterface) => {
        this.socketService.setupSocketConnection(currentUser);
        this.authService.setCurrentUser(currentUser);
      },
      error: (err) => {
        this.authService.setCurrentUser(null);
      },
    });
  }

  ngOnInit(): void {}
}
