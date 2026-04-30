import { Component, computed, input } from '@angular/core';
import Prism from 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-typescript';

export type Language = 'css' | 'html' | 'javascript' | 'json' | 'scss' | 'typescript';

@Component({
  selector: 'ngf-prism',
  templateUrl: './prism.component.html',
})
export class PrismComponent {
  /**
   * A signal containing the language.
   */
  public readonly language = input<Language>('json');

  /**
   * A signal containing the text to format.
   */
  public readonly text = input<string | undefined>();

  /**
   * A signal containing the formatted text.
   */
  public readonly formatted = computed(() => {
    const language = this.language();
    const text = this.text() ?? '';

    return Prism.highlight(text, Prism.languages[language], language);
  });
}
