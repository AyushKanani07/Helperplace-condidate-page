import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ServiceService } from '../services/service.service';
import { CandidateResponse, Candidate, FilterProperties, MasterData, QueryParamFilterProperties } from '../data-type';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserStore } from '../user.store';

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

  candidateList: Candidate[]=[];
  masterdata: any;
  filteredData: Candidate[]=[]

  currentPage = signal(1);
  pageSize = signal(20); // Adjust this as needed
  // totalItems = signal(0);

  queryParams:QueryParamFilterProperties={}

  // updateFilterParameter:FilterProperties = {};
  // filterParameter = inject(ServiceService)
  filterParameter:FilterProperties = {};

  constructor(private router:Router, private activatedRoute: ActivatedRoute, private service:ServiceService) {
    this.filterParameter.pageSize = this.pageSize();

    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe((res) => {
      // console.log(res)
      this.queryParams = res;
      // console.log(this.queryParams);
      const pageNumber = parseInt(res['page']);
      if(isNaN(pageNumber)){
        this.currentPage.set(1);
        // this.updateFilterParameter.page = 0;
        this.filterParameter.page = 0;
        
        // this.service.updateFilterParameter(this.updateFilterParameter)
      }
      else if(pageNumber === 0){
        this.currentPage.set(1);
        // this.updateFilterParameter.page = 0;
        this.filterParameter.page = 0;
        // this.service.updateFilterParameter(this.updateFilterParameter)
      }
      else{
        this.currentPage.set(pageNumber);
        // this.updateFilterParameter.page = pageNumber - 1;
        this.filterParameter.page = pageNumber - 1;
        // this.service.updateFilterParameter(this.updateFilterParameter)
      }
      // this.filterParameter = this.service.getCurrentFilterParameters()
      this.service.updateFilterParameter(this.filterParameter)
      this.store.loadCandidates(this.service.getCurrentFilterParameters());
      // this.store.loadCandidates(this.filterParameter);
    })
  }
  

  ngOnInit(): void {
    // this.store.loadCandidates(this.filterParameter);
    // this.store.loadCandidates(this.service.getCurrentFilterParameters());
    
  }



  onPageChange(pages: number) {
    const totalPages = this.store.totalItems();
    // console.log(pages)
    if (pages >= 1 && pages <= totalPages) {
      this.currentPage.set(pages);
      // console.log(this.filterParameter)
      // this.store.loadCandidates(this.filterParameter);
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






















  // getMasterdata(){
  //   this.service.getMasterdata().subscribe((result:any) => {
  //     if(result && result.data){
  //       this.masterdata = result.data;
  //       this.filterData();
  //     }
  //   })
  // }

  // getCandidate(){
  //   this.service.getCandidates(this.filterParameter).subscribe((result: CandidateResponse) => {
  //     // console.log(result);
  //     if(result && result.data){
  //       this.candidateList = result.data;
  //       this.filterData();
  //       this.totalItems = Math.floor(result.records_total/20);
  //     }
  //   });

  // }


  // filterData() {
  //   if (!this.masterdata || !this.candidateList) return;

  //   this.filteredData = this.candidateList.map(candidate => {
  //     const contractStatusName = this.masterdata.contract_status.find((csn: { contract_sts_id: number }) => csn.contract_sts_id === candidate.contract_status_id);
  //     const countryName = this.masterdata.candidate_country.find((cn: { country_id: number }) => cn.country_id === candidate.current_country_id)
  //     const jobType = this.masterdata.job_type.find((jt: { job_type_id: number }) => jt.job_type_id === candidate.job_type_id);
  //     const position = this.masterdata.job_position.find((jp: { job_position_id: number }) => jp.job_position_id === candidate.position_id);

  //     const formattedDate = this.datePipe.transform(candidate.next_job_available_date, 'dd MMM yyyy');

  //     return {
  //       ...candidate,
  //       job_type_name: jobType ? jobType.job_type_name : 'Unknown',
  //       position_name: position ? position.position_name : 'Unknown',
  //       contract_sts_name: contractStatusName ? contractStatusName.contract_sts_name : 'Unknown',
  //       country_name: countryName ? countryName.country_name : 'Unknown',
  //       next_job_available_date: formattedDate || 'Unknown'
  //     } as Candidate;
  //   });
  // }