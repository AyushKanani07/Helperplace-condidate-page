import { Routes } from '@angular/router';
import { CandidatesComponent } from './components/candidates/candidates.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'find-candidate',
        pathMatch: 'full',
    },
    {
        path:'find-candidate',
        component: MainNavComponent
    }
];
