import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../../shared/shared.module';
import { FiltersComponent } from '../filters.component';

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
