import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SharedModule } from '../../shared/shared.module';
import { ProfilesComponent } from "../candidates/profiles/profiles.component";
import { CandidatesComponent } from "../candidates/candidates.component";
import { HeaderComponent } from '../candidates/header/header.component';

@Component({
    selector: 'app-main-nav',
    templateUrl: './main-nav.component.html',
    styleUrl: './main-nav.component.css',
    standalone: true,
    imports: [
        MatToolbarModule, MatButtonModule, MatSidenavModule, MatListModule, MatIconModule, AsyncPipe, SharedModule,
        HeaderComponent,
        ProfilesComponent,
        CandidatesComponent
    ]
})
export class MainNavComponent {
  showFiller = false;
}
