import { AfterViewInit, Directive, ElementRef, Injector, Renderer2, computed, effect, inject, input } from '@angular/core';
import { FormControlState } from '../state';

@Directive()
export abstract class SetNativeId implements AfterViewInit {
  /** Form control state. */
  public readonly ngrxFormControlState = input.required<FormControlState<any>>();

  /** Reference to the element. */
  protected readonly elementRef = inject(ElementRef);

  /** Used to set custom property. */
  protected readonly renderer = inject(Renderer2);

  /** Used to create side effect. */
  protected readonly injector = inject(Injector);

  /** Form control Id. */
  private readonly id = computed(() => {
    const state = this.ngrxFormControlState();
    if (!state) {
      throw new Error('The control state must not be undefined!');
    }

    return state.id;
  });

  /**
   * @inheritdoc
   */
  public ngAfterViewInit() {
    const nativeId = this.elementRef.nativeElement.id;
    if (!nativeId) {
      effect(
        () => {
          const id = this.id();
          this.renderer.setProperty(this.elementRef.nativeElement, 'id', id);
        },
        { injector: this.injector }
      );
    }
  }
}
