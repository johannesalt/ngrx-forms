import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatNavList } from '@angular/material/list';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'ngf-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSidenav, MatNavList],
})
export class SidenavComponent {}
