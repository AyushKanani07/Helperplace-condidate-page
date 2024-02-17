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

  constructor(private http: HttpClient) { }

  getCandidates(filter: FilterProperties): Observable<CandidateResponse> {
    const page = filter.page;
    const pageSize = filter.pageSize || 20;
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
    const exp_min = filter.experience_min;
    const exp_max = filter.experience_max;
    const age_min = filter.age_min;
    const age_max = filter.age_max;

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
    if(exp_min !== undefined){
      params = params.append('experience_min', exp_min)
    }
    if(exp_max !== undefined){
      params = params.append('experience_max', exp_max)
    }
    if(age_min !== undefined){
      params = params.append('age_min', age_min)
    }
    if(age_max !== undefined){
      params = params.append('age_max', age_max)
    }

    return this.http.get<CandidateResponse>('https://api.helperplace.com/api/mobile/candidate/FindCandidate', { params });
  }

  getMasterdata() {
    return this.http.get('https://api.helperplace.com/api/mobile/masterdata/GetAllMasterDataJson');
  }

  updateFilterParameter(newFilter: Partial<FilterProperties>) {
    this.filterParameter.set({ ...this.filterParameter(), ...newFilter });
  }

  getCurrentFilterParameters(): FilterProperties {
    return this.filterParameter();
  }
}
