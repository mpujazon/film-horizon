import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  viewChild
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-trailer-modal',
  templateUrl: './trailer-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: contents;
    }

    dialog {
      border: 0;
      padding: 0;
      margin: auto;
      max-width: none;
      background: transparent;
    }

    dialog::backdrop {
      background: rgb(0 0 0 / 0.8);
      backdrop-filter: blur(4px);
    }
  `
})
export class TrailerModal {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly dialogRef = viewChild<ElementRef<HTMLDialogElement>>('dialogRef');

  readonly isOpen = input(false);
  readonly videoKey = input<string | null>(null);
  readonly title = input('Trailer');
  readonly closed = output<void>();

  readonly iframeTitle = computed(() => `Trailer for ${this.title()}`);
  readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const key = this.videoKey();

    if (!key) {
      return null;
    }

    const url = `https://www.youtube.com/embed/${key}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  constructor() {
    effect(() => {
      const dialogElement = this.dialogRef()?.nativeElement;

      if (!dialogElement) {
        return;
      }

      if (this.isOpen()) {
        if (!dialogElement.open) {
          dialogElement.showModal();
        }
        return;
      }

      if (dialogElement.open) {
        dialogElement.close();
      }
    });
  }

  onDialogClick(event: MouseEvent, dialogElement: HTMLDialogElement): void {
    if (event.target !== dialogElement) {
      return;
    }

    dialogElement.close();
  }

  onDialogClosed(): void {
    this.closed.emit();
  }

  close(): void {
    const dialogElement = this.dialogRef()?.nativeElement;

    if (!dialogElement || !dialogElement.open) {
      this.closed.emit();
      return;
    }

    dialogElement.close();
  }
}
