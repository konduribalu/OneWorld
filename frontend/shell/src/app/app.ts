import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { ShellLayoutComponent } from './accordion.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellLayoutComponent],
  template: `<app-shell-layout />`,
  styleUrl: './app.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App {
  protected readonly title = signal('shell');
}
