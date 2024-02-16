import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { FilterProperties, QueryParamFilterProperties } from '../data-type';
import { UserStore } from '../user.store';
import { ServiceService } from '../services/service.service';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, NgxSliderModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
  providers: [provideNativeDateAdapter()],
})
export class FiltersComponent implements OnInit, OnDestroy {

  value: number = 100;
  options: Options = {
    floor: 0,
    ceil: 200
  };

  filterForm!: FormGroup;
  private queryParamsSubscription: Subscription;
  // filterParameter: FilterProperties = {};
  filterParameter = signal<FilterProperties>({});
  queryParams:QueryParamFilterProperties={}
  jobPositions: any[];
  candidateLocation: any[];
  jobType: any[];
  contractStatus: any[];
  language: any[];
  mainSkill: any[];
  nationalities: any[];
  resumeManager = [{
      resume_manager_id: 1,
      resume_manager_name: 'Direct'
    },
    {
      resume_manager_id: 2,
      resume_manager_name: 'Agency'
    }];

  Gender = [{
      gender_id: 1,
      gender_value: 'Male'
    },
    {
      gender_id: 2,
      gender_value: 'Female'
    }
  ];




  // queryParams: any = {}

  job_position = signal(0);
  job_type = signal(0);
  resume_by = signal(0);
  startDate = signal('');
  location = signal<(number | undefined)[]>([]);
  contract_status = signal<(number | undefined)[]>([]);
  language_skill = signal<(number | undefined)[]>([]);
  main_skill = signal<(number| undefined)[]>([]);
  nationality = signal(0);
  gender = signal(0);
  search = signal('');
  page = 1;

  datePipe = inject(DatePipe);
  private store = inject(UserStore)
  // private isBrowser = typeof window !== 'undefined';

  constructor(private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private service: ServiceService) {
    this.jobPositions = this.store.master().data.job_position;
    this.candidateLocation = this.store.master().data.candidate_country;
    this.jobType = this.store.master().data.job_type;
    this.contractStatus = this.store.master().data.contract_status;
    this.language = this.store.master().data.language;
    this.mainSkill = this.findMainSkill();
    this.nationalities = this.store.master().data.nationality;
    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe((res) => {
      // this.queryParams = res;
      // console.log(this.queryParams)
      // console.log(res);
      if (res['page']) {
        this.page = res['page'];
        this.filterParameter().page = this.page - 1;
      } else {
        this.page = 1
      }

      if (res['job_position']) {
        const jobPosition = res['job_position'] ? res['job_position'].replace(/-/g, ' ') : '';
        if (jobPosition) {
          const jobPositionId = this.findJobPositionId(jobPosition);
          if (jobPositionId !== undefined) {
            this.filterParameter().job_position = jobPositionId;
            // console.log(jobPositionId)
            this.job_position.set(jobPositionId);
            // this.filterForm.patchValue({
            //   job_position: jobPositionId
            // });
          }
        }
      }

      if (res['start_date']) {
        this.filterParameter().start_date = res['start_date'];
        const date = this.datePipe.transform(res['start_date'], 'M-d-yyyy');
        this.startDate.set(date as string);
        if (this.filterForm) {
          this.filterForm.patchValue({
            start_date: new Date('2024-02-22')
          })
        }
      }

      if (res['country']) {
        const location = res['country'] ? res['country'].replace(/-/g, ' ').split(',').map((item: string) => item.trim()) : [];
        // console.log(location)
        const countryId = this.findLocationId(location);
        this.filterParameter().country = countryId;
      } else {
        this.filterParameter().country = '';
      }

      if (res['job_type']) {
        const jobType = res['job_type'] ? res['job_type'].replace(/-/g, ' ') : '';
        if (jobType) {
          const jobTypeId = this.findJobTypeId(jobType);
          if (jobTypeId !== undefined) {
            this.filterParameter().job_type = jobTypeId
            this.job_type.set(jobTypeId)
          }
        }
      }

      if (res['contract_status']) {
        const contract = res['contract_status'] ? res['contract_status'].replace(/-/g, ' ').split(',').map((item: string) => item.trim()) : [];
        const contractId = this.findContractId(contract);
        console.log(contractId)
        this.filterParameter().contract_status = contractId;
      } else {
        this.filterParameter().contract_status = '';
      }

      if (res['post_manager']) {
        this.filterParameter().post_manager = res['post_manager'];
        const resume = res['post_manager'] ? res['post_manager'].replace(/-/g, ' ') : '';
        if (resume) {
          const resumeId = this.findResumeId(resume);
          if (resumeId !== undefined) {
            this.resume_by.set(resumeId);
          }
        }
      }

      if (res['Language']) {
        const language = res['Language'] ? res['Language'].replace(/-/g, ' ').split(',').map((item: string) => item.trim()) : [];;
        const languageId = this.findLanguageId(language);
        // console.log(languageId);
        this.filterParameter().Language = languageId;
      } else {
        this.filterParameter().Language = [];
      }

      if(res['Main_Skills']){
        const skill = res['Main_Skills'] ? res['Main_Skills'].replace(/-/g, ' ').split(',').map((item: string) => item.trim()) : [];
        const skillId = this.findSkillId(skill);
        this.filterParameter().Main_Skills = skillId
      }else{
        this.filterParameter().Main_Skills = [];
      }

      if(res['nationality']){
        const nationality = res['nationality'] ? res['nationality'].replace(/-/g, ' ') : '';
        if(nationality){
          const id = this.findNationalityId(nationality);
          if(id !== undefined){
            this.filterParameter().nationality = id;
            this.nationality.set(id)
          }
        }
      }else{
        this.nationality.set(0);
        this.filterParameter().nationality = '';
      }

      if(res['gender']){
        this.filterParameter().gender = res['gender'];
        const gender = res['gender'] ? res['gender'].replace(/-/g, ' ') : '';
        if(gender){
          const genderId = this.findGenderId(gender);
          if(genderId !== undefined){
            this.gender.set(genderId)
          }
        }
      }

      if(res['name']){
        this.filterParameter().name = res['name'];
        this.search.set(res['name']);
      }

      // console.log(this.filterParameter())
      this.service.updateFilterParameter(this.filterParameter())
      this.store.loadCandidates(this.service.getCurrentFilterParameters());
      // this.store.loadCandidates(this.filterParameter)
    })
  }

  ngOnInit(): void {
    // console.log(this.jobPositions)
    // console.log(this.location())
    // console.log(this.filterForm.value)
    this.filterForm = this.fb.group({
      job_position: [this.job_position()],
      start_date: [],
      location: [this.location()],
      job_type: [this.job_type()],
      contractStatus: [this.contract_status()],
      resume_by: [this.resume_by()],
      language: [this.language_skill()],
      skill: [this.main_skill()],
      nationality: [this.nationality()],
      gender: [this.gender()],
      search: [this.search()]
    });

    this.filterForm.valueChanges.subscribe((value) => {
      const jobPositionName = this.findJobPositionName(value['job_position']);
      const formattedDate = this.datePipe.transform(value.start_date, 'yyyy-MM-dd');
      const location = this.findLocationName(value['location']);
      const jobtype = this.findJobTypeName(value['job_type']);
      const contractStatus = this.findContractName(value['contractStatus']);
      const resumeManager = this.findResumeName(value['resume_by']);
      const language = this.findLanguageName(value['language']);
      const skill = this.findSkillName(value['skill']);
      const nationality = this.findNationalityName(value['nationality']);
      const gender = this.findGenderValue(value['gender'])

      this.queryParams = {
        page: this.page,
        job_position: jobPositionName,
        start_date: formattedDate,
        job_type: jobtype,
        post_manager: resumeManager,
        nationality: nationality,
        gender: gender
      }
      if (location) {
        this.queryParams.country = location;
      }
      if (contractStatus) {
        this.queryParams.contract_status = contractStatus;
      }
      if (language) {
        this.queryParams.Language = language;
      }
      if(skill){
        this.queryParams.Main_Skills = skill;
      }

      this.navigateQuery()
      // console.log(this.filterParameter)

    })
  }

  navigateQuery(){
    this.router.navigate([], {
      queryParams: this.queryParams
    });
  }

  masterData = this.store.master.data;
  findJobPositionName(jobPositionId: number): string | undefined {
    const jobPosition = this.masterData().job_position.find(jp => jp.job_position_id === jobPositionId);
    return jobPosition ? jobPosition.position_name.replace(/\s+/g, '-') : undefined
  }

  findJobPositionId(jobPositionName: string): number | undefined {
    const jobPosition = this.masterData().job_position.find(jp => jp.position_name === jobPositionName);
    return jobPosition ? jobPosition.job_position_id : undefined;
  }

  findLocationName(location: number[]): string | undefined {
    const locationNames = location.map(locationId => {
      const foundLocation = this.masterData().candidate_country.find(country => country.country_id === locationId);
      return foundLocation ? foundLocation.country_name : undefined
    });
    return locationNames.filter(name => name !== undefined).join(',').replace(/\s+/g, '-');
  }

  findLocationId(location: string[]) {
    const locationId = location.map(locationName => {
      const foundName = this.masterData().candidate_country.find(country => country.country_name === locationName);
      return foundName ? foundName.country_id : undefined;
    });
    // console.log(locationId)
    this.location.set(locationId)
    return locationId.join(',')
  }

  findJobTypeName(jobTypeId: number): string | undefined {
    const jobPosition = this.masterData().job_type.find(jt => jt.job_type_id === jobTypeId);
    return jobPosition ? jobPosition.job_type_name.replace(/\s+/g, '-') : undefined
  }

  findJobTypeId(jobTypeName: string): number | undefined {
    const jobType = this.masterData().job_type.find(jt => jt.job_type_name === jobTypeName);
    return jobType ? jobType.job_type_id : undefined;
  }

  findContractName(value: number[]): string | undefined {
    const ContractNames = value.map(contractId => {
      const foundContract = this.masterData().contract_status.find(contract => contract.contract_sts_id === contractId);
      return foundContract ? foundContract.contract_sts_name : undefined
    });
    return ContractNames.filter(name => name !== undefined).join(',').replace(/\s+/g, '-');
  }

  findContractId(value: string[]) {
    const contractId = value.map(contractName => {
      const foundName = this.masterData().contract_status.find(contract => contract.contract_sts_name === contractName);
      return foundName ? foundName.contract_sts_id : undefined;
    });
    // console.log(locationId)
    this.contract_status.set(contractId)
    return contractId.join(',')
  }

  findResumeName(resumeId: number): string | undefined {
    const resumeName = this.resumeManager.find(rm => rm.resume_manager_id === resumeId);
    return resumeName ? resumeName.resume_manager_name.replace(/\s+/g, '-') : undefined
  }

  findResumeId(resumeName: string): number | undefined {
    const resumeId = this.resumeManager.find(rm => rm.resume_manager_name === resumeName);
    return resumeId ? resumeId.resume_manager_id : undefined;
  }

  findLanguageName(language: number[]): string | undefined {
    const languageNames = language.map(languageId => {
      const foundLanguage = this.masterData().language.find(lan => lan.language_id === languageId);
      return foundLanguage ? foundLanguage.language_name : undefined
    });
    return languageNames.filter(name => name !== undefined).join(',').replace(/\s+/g, '-');
  }

  findLanguageId(language: string[]) {
    const languageId = language.map(languageName => {
      const foundName = this.masterData().language.find(lan => lan.language_name === languageName);
      return foundName ? foundName.language_id : undefined;
    });
    this.language_skill.set(languageId)
    // console.log(languageId)
    return languageId
  }

  findMainSkill(): any[] {
    const mainSkillsCategoryId = this.masterData().skill_category.find(category => category.skill_category_name === 'Main Skills')?.skill_category_id;
    if(mainSkillsCategoryId !== undefined){
      const mainSkill = this.masterData().skills.filter(skill => skill.skill_category_id === mainSkillsCategoryId);
      const mainSkillDetails = mainSkill.map(skill => ({
        skill_category_id: skill.skill_category_id,
        skill_id: skill.skill_id,
        skill_name: skill.skill_name,
        skill_icon: skill.skill_icon
      }));
      return mainSkillDetails
    }
    else{
      return [];
    }
  }

  findSkillName(skill: number[]): string | undefined {
    const skillNames = skill.map(skillId => {
      const foundSkill = this.masterData().skills.find(val => val.skill_id === skillId);
      return foundSkill ? foundSkill.skill_name : undefined
    });
    return skillNames.filter(name => name !== undefined).join(',').replace(/\s+/g, '-');
  }

  findSkillId(skill: string[]) {
    const skillId = skill.map(languageName => {
      const foundName = this.masterData().skills.find(val => val.skill_name === languageName);
      return foundName ? foundName.skill_id : undefined;
    });
    this.main_skill.set(skillId)
    // console.log(languageId)
    return skillId
  }

  findNationalityName(id: number): string | undefined {
    const nationality = this.masterData().nationality.find(val => val.nationality_id=== id);
    return nationality ? nationality.nationality_name.replace(/\s+/g, '-'): undefined;
  }

  findNationalityId(name: string): number | undefined {
    const nationality = this.masterData().nationality.find(val => val.nationality_name === name);
    return nationality ? nationality.nationality_id : undefined;
  }

  findGenderValue(genderId: number): string | undefined {
    const genderValue = this.Gender.find(val => val.gender_id === genderId);
    return genderValue ? genderValue.gender_value.replace(/\s+/g, '-') : undefined
  }

  findGenderId(value: string): number | undefined {
    const genderId = this.Gender.find(val => val.gender_value === value);
    return genderId ? genderId.gender_id : undefined;
  }

  onSearchClick(){
    const searchValue = this.filterForm.get('search')?.value;
    if(searchValue){
      this.queryParams.name = searchValue;
      this.navigateQuery()
    }
  }



  reset() {
    // this.filterForm.reset(); 
  }


  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }

}
