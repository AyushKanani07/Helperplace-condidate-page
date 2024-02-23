import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ServiceService } from '../../services/service.service';
import { CandidateResponse, Candidate, FilterProperties, MasterData, QueryParamFilterProperties } from '../../data-type';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserStore } from '../../user.store';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [SharedModule, NgFor, NgIf],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.css'
})
export class ProfilesComponent implements OnInit, OnDestroy {

  private queryParamsSubscription: Subscription;
  readonly store = inject(UserStore);

  candidateList: Candidate[] = [];
  masterdata: any;
  filteredData: Candidate[] = []

  currentPage = signal(1);
  pageSize = signal(20); // Adjust this as needed

  queryParams: QueryParamFilterProperties = {}
  filterParameter: FilterProperties = {};

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private service: ServiceService) {
    this.filterParameter.pageSize = this.pageSize();

    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe((res) => {
      this.queryParams = res;

      const pageNumber = parseInt(res['page']);
      if (isNaN(pageNumber)) {
        this.currentPage.set(1);
        this.filterParameter.page = 0;
      }
      else if (pageNumber === 0) {
        this.currentPage.set(1);
        this.filterParameter.page = 0;
      }
      else {
        this.currentPage.set(pageNumber);
        this.filterParameter.page = pageNumber - 1;
      }
      this.service.updateFilterParameter(this.filterParameter)
    })
  }

  ngOnInit(): void {

  }

  candidateDetails(url: string) {
    // this.store.getCandidateByUrl(url);
    const navigate = 'resume' + '/' + url;
    this.router.navigate([navigate]);
  }

  onPageChange(pages: number) {
    const totalPages = this.store.totalItems();

    if (pages >= 1 && pages <= totalPages) {
      this.currentPage.set(pages);
      this.queryParams = { ...this.queryParams, page: String(pages) };
      this.router.navigate([], {
        queryParams: this.queryParams
      })
    }
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }

}
