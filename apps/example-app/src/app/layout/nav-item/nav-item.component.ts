import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatListItem, MatListItemLine, MatListItemTitle } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'ngf-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListItem, MatListItemTitle, MatListItemLine, RouterLinkActive, RouterLink],
})
export class NavItemComponent {
  public readonly label = input<string>('');

  public readonly hint = input<string>('');

  public readonly routerLink = input<string | any[]>('/');
}
