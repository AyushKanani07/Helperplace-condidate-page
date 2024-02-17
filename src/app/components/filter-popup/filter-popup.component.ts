import { Component } from '@angular/core';
import { FiltersComponent } from "../filters/filters.component";
import { SharedModule } from '../../shared/shared.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-filter-popup',
    standalone: true,
    templateUrl: './filter-popup.component.html',
    styleUrl: './filter-popup.component.css',
    imports: [FiltersComponent, SharedModule]
})
export class FilterPopupComponent {

    constructor(private dialogRef: MatDialogRef<FiltersComponent>){}

    closePopup(): void {
        this.dialogRef.close();
      }

}
