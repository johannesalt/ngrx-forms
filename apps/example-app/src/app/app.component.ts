import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';

@Component({
  imports: [LayoutComponent, RouterOutlet],
  selector: 'ngf-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
