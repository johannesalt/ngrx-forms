import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, forwardRef, HostListener, inject, InjectionToken, PLATFORM_ID, DOCUMENT } from '@angular/core';
import { SetNativeId } from './set-native-id';
import { FormViewAdapter, NGRX_FORM_VIEW_ADAPTER } from './view-adapter';

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
  selector: 'input:not([type=checkbox]):not([type=number]):not([type=radio]):not([type=range])[ngrxFormControlState],textarea[ngrxFormControlState]',
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
})
export class NgrxDefaultViewAdapter extends SetNativeId implements FormViewAdapter, AfterViewInit {
  private readonly isCompositionSupported = inject(NGRX_FORM_COMPOSITION_EVENTS_SUPPORTED);

  onChange: (value: any) => void = () => void 0;

  @HostListener('blur')
  onTouched: () => void = () => void 0;

  /** Whether the user is creating a composition string (IME events). */
  private isComposing = false;

  setViewValue(value: any): void {
    const normalizedValue = value == null ? '' : value;
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', normalizedValue);
  }

  setOnChangeCallback(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  setOnTouchedCallback(fn: () => void): void {
    this.onTouched = fn;
  }

  setIsDisabled(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  @HostListener('input', ['$event'])
  handleInput({ target }: { target: HTMLInputElement }): void {
    if (this.isCompositionSupported && this.isComposing) {
      return;
    }

    this.onChange(target.value);
  }

  @HostListener('compositionstart')
  compositionStart(): void {
    this.isComposing = true;
  }

  @HostListener('compositionend', ['$event'])
  compositionEnd({ target }: { target: HTMLInputElement }): void {
    this.isComposing = false;
    if (this.isCompositionSupported) {
      this.onChange(target.value);
    }
  }
}
