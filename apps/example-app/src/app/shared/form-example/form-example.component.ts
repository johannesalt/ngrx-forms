import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { FormGroupState } from 'ngrx-form-state';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';

@Component({
  selector: 'ngf-form-example',
  templateUrl: './form-example.component.html',
  styleUrls: ['./form-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCard, MatCardContent],
})
export class FormExampleComponent {
  public readonly exampleName = input<string>('');

  public readonly formState = input<FormGroupState<any>>();

  public readonly githubLinkOverride = input<string | undefined>(undefined);

  public readonly formattedFormState = computed(() => {
    const state = this.formState();

    const json = JSON.stringify(state, null, 2);
    return Prism.highlight(json, Prism.languages['json'], 'json');
  });

  public readonly githubLink = computed(() => {
    const exampleName = this.exampleName();
    const githubLinkOverride = this.githubLinkOverride();

    let result = 'https://github.com/johannesalt/ngrx-forms/tree/master/example-app/src/app/';
    result += githubLinkOverride || exampleName.replace(' ', '-').toLowerCase();

    return result;
  });
}
