import { Routes } from '@angular/router';
import { CandidatesComponent } from './components/candidates/candidates.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { ResumeComponent } from './components/resume/resume.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'find-candidate',
        pathMatch: 'full',
    },
    {
        path:'find-candidate',
        component: CandidatesComponent
    },
    {
        path:'resume/:country/:jobType/:candidateName/:candidateId',
        loadChildren: () => import('./components/resume/resume.routes')
        // component: ResumeComponent
    }
];
