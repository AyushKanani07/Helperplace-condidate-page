import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FiltersComponent } from "./filters/filters.component";
import { ProfilesComponent } from "./profiles/profiles.component";
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MainNavComponent } from "../main-nav/main-nav.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../services/service.service';
import { FilterProperties, QueryParamFilterProperties } from '../data-type';
import { Subscription } from 'rxjs';
import { UserStore } from '../user.store';
import { FormBuilder, FormGroup} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FilterPopupComponent } from './filters/filter-popup/filter-popup.component';
import { HeaderComponent } from './header/header.component';

@Component({
    selector: 'app-candidates',
    standalone: true,
    templateUrl: './candidates.component.html',
    styleUrl: './candidates.component.css',
    imports: [SharedModule,  HeaderComponent, FiltersComponent, ProfilesComponent, MatToolbarModule, MatButtonModule, MatSidenavModule, MatListModule, MatIconModule, AsyncPipe, MainNavComponent]
})
export class CandidatesComponent implements OnInit, OnDestroy {

  @ViewChild('btnScrollToTop') btnScrollToTop!: ElementRef;

    private queryParamsSubscription: Subscription;
    store = inject(UserStore);

    filterParameter = signal<FilterProperties>({});
    orderForm!: FormGroup;

    order = signal(1);
    queryParams:QueryParamFilterProperties={}

    Order =[{
        order_id: 1,
        order_value: 'Last Active'
      },
      {
        order_id: 2,
        order_value: 'Available From'
      },
      {
        order_id: 3,
        order_value: 'Publish Date'
      }
    ];

    constructor(private dialog: MatDialog, private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private service: ServiceService){
        this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe((res) => {
          this.queryParams = res;

          if(res['order_by']){
            this.filterParameter().order_by = res['order_by'];
            const order = res['order_by'] ? res['order_by'].replace(/_/g, ' ') : '';
            const modifiedOrder = order.toLowerCase().replace(/\b\w/g, (char: string) => char.toUpperCase());
            const orderId = this.findOrderId(modifiedOrder);
            if(orderId){
              this.order.set(orderId)
            }
          }

          this.service.updateFilterParameter(this.filterParameter());
        })
    }

    ngOnInit(): void {
        this.orderForm = this.fb.group({
          order: [this.order()]
        });

        this.orderForm.valueChanges.subscribe((value) => {
          const order = this.findOrderValue(value['order']);

          this.queryParams ={
            ...this.queryParams,
            order_by: order
          }

          this.router.navigate([], {
            queryParams: this.queryParams
          })
        })
    }

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    findOrderValue(orderId: number): string | undefined{
      const orderValue = this.Order.find(val => val.order_id == orderId);
      if(orderValue){
        const modifiedOrderValue = orderValue.order_value.toLowerCase().replace(/\b\w/g, (char: string) => char.toLowerCase());
        return modifiedOrderValue.replace(/\s+/g, '_');
      }
      return undefined;
    }

    findOrderId(orderVal: string): number | undefined{
      const orderId = this.Order.find(val => val.order_value === orderVal);
      return orderId ? orderId.order_id : undefined
    }

    Filter(){
      this.OpenPopup();
    }

    OpenPopup() {
      this.dialog.open(FilterPopupComponent, {
        maxWidth: '500px',
        width: '90%',
        height: '80%',
        
        enterAnimationDuration: '700ms',
        exitAnimationDuration: '400ms',
        data: {
        }
      })
  
    }

    ngOnDestroy(): void {
        if (this.queryParamsSubscription) {
          this.queryParamsSubscription.unsubscribe();
        }
      }

}
