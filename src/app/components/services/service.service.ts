import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { CandidateResponse, FilterProperties } from '../data-type';
import { Observable } from 'rxjs';
import { UserStore } from '../user.store';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private filterParameter = signal<FilterProperties>({});
  // private store = inject(UserStore)

  constructor(private http: HttpClient) { }

  getCandidates(filter: FilterProperties): Observable<CandidateResponse> {
    const page = filter.page;
    const pageSize = filter.pageSize || 20;
    // const startIndex = ((page || 0) - 1) * pageSize;
    const positionId = filter.job_position;
    const startDate = filter.start_date;
    const country = filter.country;
    const jobTypeId = filter.job_type;
    const contractId = filter.contract_status;
    const resumBy = filter.post_manager;
    const language = filter.Language;
    const skills = filter.Main_Skills;
    const nationality = filter.nationality;
    const gender = filter.gender;
    const order_by = filter.order_by;
    const name = filter.name;

    // Set up the query parameters
    let params = new HttpParams();
    if (page !== undefined) {
      params = params.append('start', page.toString());
    }
    params = params.append('length', pageSize.toString());
    if (positionId !== undefined) {
      params = params.append('position_id', positionId.toString());
    }
    if (startDate !== undefined) {
      params = params.append('start_date', startDate)
    }
    if (country !== undefined) {
      params = params.append('country_id', country)
    }
    if (jobTypeId !== undefined) {
      params = params.append('job_type_id', jobTypeId)
    }
    if (contractId !== undefined) {
      params = params.append('contract_status_id', contractId)
    }
    if (resumBy !== undefined) {
      params = params.append('resume_manager', resumBy)
    }
    if (language !== undefined) {
      language.forEach(langId => {
        if (langId !== undefined) {
          params = params.append('skill_id', langId.toString());
        }
      })
    }
    if (skills !== undefined) {
      skills.forEach(skillId => {
        if (skillId !== undefined) {
          params = params.append('skill_id', skillId.toString());
        }
      })
    }
    if(nationality !== undefined){
      params = params.append('nationality_id', nationality)
    }
    if(gender !== undefined){
      params = params.append('gender', gender)
    }
    if(order_by !== undefined){
      params = params.append('order_by', order_by)
    }
    if(name !== undefined){
      params = params.append('helper_name', name)
    }

    // console.log(params);

    return this.http.get<CandidateResponse>('https://api.helperplace.com/api/mobile/candidate/FindCandidate', { params });
  }

  // getCandidate(page: number, pageSize: number): Observable<CandidateResponse>{
  //   return this.http.get<CandidateResponse>('https://api.helperplace.com/api/mobile/candidate/FindCandidate?start=0&length=20');
  // }

  getMasterdata() {
    return this.http.get('https://api.helperplace.com/api/mobile/masterdata/GetAllMasterDataJson');
  }

  updateFilterParameter(newFilter: Partial<FilterProperties>) {
    // Update the filterParameter signal
    this.filterParameter.set({ ...this.filterParameter(), ...newFilter });
    // console.log(this.filterParameter());

    // Automatically load candidates with the updated filter
    // this.store.loadCandidates(this.filterParameter());
    // console.log(this.getCurrentFilterParameters())
  }

  getCurrentFilterParameters(): FilterProperties {
    return this.filterParameter();
  }
}
