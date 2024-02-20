import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FiltersComponent } from '../filters/filters.component';
import { ProfilesComponent } from '../profiles/profiles.component';

@Component({
    selector: 'app-header',
    standalone: true,
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    imports: [SharedModule, ProfilesComponent, FiltersComponent]
})
export class HeaderComponent {

}
