import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatLine } from '@angular/material/core';
import { MatListItem } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'ngf-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListItem, MatLine, RouterLinkActive, RouterLink],
})
export class NavItemComponent {
  @Input() hint = '';
  @Input() routerLink: string | any[] = '/';
}
