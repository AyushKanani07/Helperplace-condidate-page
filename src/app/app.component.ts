import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainNavComponent } from "./components/main-nav/main-nav.component";
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './components/candidates/header/header.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, HeaderComponent, MainNavComponent, SharedModule]
})
export class AppComponent {
  title = 'helperplace';
}
