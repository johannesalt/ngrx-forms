import { isPlatformBrowser } from '@angular/common';
import { computed, Directive, DOCUMENT, forwardRef, HostListener, inject, InjectionToken, PLATFORM_ID, signal, untracked } from '@angular/core';
import { NGRX_FORM_VIEW_ADAPTER } from './view-adapter';
import { NgrxViewAdapter } from './view-adapter.directive';

export const NGRX_FORM_COMPOSITION_EVENTS_SUPPORTED = new InjectionToken<boolean>('NGRX_FORM_COMPOSITION_EVENTS_SUPPORTED');

/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 */
function isAndroid(navigator: Navigator | null | undefined): boolean {
  const userAgent = (navigator?.userAgent ?? '').toLowerCase();
  return /android (\d+)/.test(userAgent);
}

// TODO: since this directive has a side-effect (setting the element's id attribute)
// it should not blacklist other types of inputs but instead it should somehow figure
// out whether it is the "active" view adapter and only perform its side effects if it
// is active
@Directive({
  host: {
    '[disabled]': 'disabled()',
    '[id]': 'name()',
    '[value]': 'viewValue()',
  },
  providers: [
    {
      provide: NGRX_FORM_VIEW_ADAPTER,
      useExisting: forwardRef(() => NgrxDefaultViewAdapter),
      multi: true,
    },
    {
      deps: [PLATFORM_ID, DOCUMENT],
      provide: NGRX_FORM_COMPOSITION_EVENTS_SUPPORTED,
      useFactory: (platformId: string, document: Document) => {
        return isPlatformBrowser(platformId) && !isAndroid(document?.defaultView?.navigator);
      },
    },
  ],
  selector: 'input:not([type=checkbox]):not([type=number]):not([type=radio]):not([type=range])[ngrxFormControlState],textarea[ngrxFormControlState]',
})
export class NgrxDefaultViewAdapter extends NgrxViewAdapter<HTMLInputElement, any, any> {
  /**
   * A value indicating whether composition is supported.
   */
  private readonly isCompositionSupported = inject(NGRX_FORM_COMPOSITION_EVENTS_SUPPORTED);

  /**
   * A signal indicating whether the user is creating a composition string (IME events).
   */
  private readonly isComposing = signal(false);

  /**
   * @inheritdoc
   */
  public override readonly viewValue = computed(() => {
    const value = this.controlValue();
    return value == null ? '' : value;
  });

  /**
   * Completes the composition session and set / update the value in the underlying state.
   */
  @HostListener('compositionend')
  public compositionEnd(): void {
    this.isComposing.set(false);

    if (this.isCompositionSupported) {
      super.setValue();
    }
  }

  /**
   * Sets a value indicating that the user is creating a composition string (IME event).
   */
  @HostListener('compositionstart')
  public compositionStart(): void {
    this.isComposing.set(true);
  }

  /**
   * @inheritdoc
   */
  protected override getNativeControlValue() {
    const el = this.element.nativeElement;
    return el.value;
  }

  /**
   * Sets / updates the value in the underlying state.
   */
  @HostListener('change')
  @HostListener('input')
  protected override setValue(): void {
    const isComposing = untracked(this.isComposing);
    if (this.isCompositionSupported && isComposing) {
      return;
    }

    super.setValue();
  }
}
