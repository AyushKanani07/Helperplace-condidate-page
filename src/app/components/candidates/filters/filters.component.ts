import { Component, Inject, Injectable, OnDestroy, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { FilterProperties, QueryParamFilterProperties } from '../../data-type';
import { UserStore } from '../../user.store';
import { ServiceService } from '../../services/service.service';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, NgxSliderModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
  providers: [provideNativeDateAdapter()],
})

@Injectable({
  providedIn: 'any'
})

export class FiltersComponent implements OnInit, OnDestroy {

  value: number = 0;
  highValue: number = 40;
  options: Options = {
    floor: 0,
    ceil: 40,
  };

  exp_value = signal(0);
  exp_highValue = signal(40);

  age_value: number = 18;
  age_highValue: number = 60;
  age_options: Options = {
    floor: 18,
    ceil: 60,
  };

  age_val = signal(18);
  age_highVal = signal(60);

  filterForm!: FormGroup;
  private queryParamsSubscription: Subscription;

  filterParameter = signal<FilterProperties>({});
  queryParams: QueryParamFilterProperties = {}
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

  //form default value
  job_position = signal(0);
  job_type = signal(0);
  resume_by = signal(0);
  startDate = signal('');
  location = signal<(number | undefined)[]>([]);
  contract_status = signal<(number | undefined)[]>([]);
  language_skill = signal<(number | undefined)[]>([]);
  main_skill = signal<(number | undefined)[]>([]);
  nationality = signal(0);
  gender = signal(0);
  search = signal('');
  exp_Range = signal('');
  age_Range = signal('');
  page = 1;

  datePipe = inject(DatePipe);
  private store = inject(UserStore)
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private service: ServiceService) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.jobPositions = this.store.master().data.job_position;
    this.candidateLocation = this.store.master().data.candidate_country;
    this.jobType = this.store.master().data.job_type;
    this.contractStatus = this.store.master().data.contract_status;
    this.language = this.store.master().data.language;
    this.mainSkill = this.findMainSkill();
    this.nationalities = this.store.master().data.nationality;
    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe((res) => {
      if (res['page']) {
        this.page = res['page'];
        this.filterParameter().page = this.page - 1;
      } else {
        this.page = 1
      }

      if (res['experience_range']) {
        const [min, max] = res['experience_range'].split('-').map(Number);
        this.filterParameter().experience_min = min;
        this.filterParameter().experience_max = max;
        this.exp_value.set(min);
        this.exp_highValue.set(max);
      }
      else {
        this.filterParameter().experience_min = undefined;
        this.filterParameter().experience_max = undefined;
      }

      if (res['age_range']) {
        const [min, max] = res['age_range'].split('-').map(Number);
        this.filterParameter().age_min = min;
        this.filterParameter().age_max = max;
        this.age_val.set(min);
        this.age_highVal.set(max);
      }
      else {
        this.filterParameter().age_min = undefined;
        this.filterParameter().age_max = undefined;
      }

      if (res['job_position']) {
        const jobPosition = res['job_position'] ? res['job_position'].replace(/-/g, ' ') : '';
        if (jobPosition) {
          const jobPositionId = this.findJobPositionId(jobPosition);
          if (jobPositionId !== undefined) {
            this.filterParameter().job_position = jobPositionId;
            // this.store.updateFilterState(jobPositionId,'job_postion');
            this.job_position.set(jobPositionId);
          }
        }
      }
      else {
        this.filterParameter().job_position = undefined
      }

      if (res['start_date']) {
        this.filterParameter().start_date = res['start_date'];
        const date = this.datePipe.transform(res['start_date'], 'M-d-yyyy');
        this.startDate.set(date as string);
      }
      else {
        this.filterParameter().start_date = '';
      }

      if (res['country']) {
        const location = res['country'] ? res['country'].replace(/-/g, ' ').split(',').map((item: string) => item.trim()) : [];
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
      else {
        this.filterParameter().job_type = undefined;
      }

      if (res['contract_status']) {
        const contract = res['contract_status'] ? res['contract_status'].replace(/-/g, ' ').split(',').map((item: string) => item.trim()) : [];
        const contractId = this.findContractId(contract);
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
      else {
        this.filterParameter().post_manager = undefined
      }

      if (res['Language']) {
        const language = res['Language'] ? res['Language'].replace(/-/g, ' ').split(',').map((item: string) => item.trim()) : [];;
        const languageId = this.findLanguageId(language);
        this.filterParameter().Language = languageId;
      } else {
        this.filterParameter().Language = [];
      }

      if (res['Main_Skills']) {
        const skill = res['Main_Skills'] ? res['Main_Skills'].replace(/-/g, ' ').split(',').map((item: string) => item.trim()) : [];
        const skillId = this.findSkillId(skill);
        this.filterParameter().Main_Skills = skillId
      } else {
        this.filterParameter().Main_Skills = [];
      }

      if (res['nationality']) {
        const nationality = res['nationality'] ? res['nationality'].replace(/-/g, ' ') : '';
        if (nationality) {
          const id = this.findNationalityId(nationality);
          if (id !== undefined) {
            this.filterParameter().nationality = id;
            this.nationality.set(id)
          }
        }
      } else {
        this.nationality.set(0);
        this.filterParameter().nationality = '';
      }

      if (res['gender']) {
        this.filterParameter().gender = res['gender'];
        const gender = res['gender'] ? res['gender'].replace(/-/g, ' ') : '';
        if (gender) {
          const genderId = this.findGenderId(gender);
          if (genderId !== undefined) {
            this.gender.set(genderId)
          }
        }
      }
      else {
        this.filterParameter().gender = undefined
      }

      if (res['name']) {
        this.filterParameter().name = res['name'];
        this.search.set(res['name']);
      }
      else {
        this.filterParameter().name = ''
      }

      this.service.updateFilterParameter(this.filterParameter())
      this.store.loadCandidates(this.service.getCurrentFilterParameters());
      // console.log(this.service.getCurrentFilterParameters())
    })
  }

  ngOnInit(): void {
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
      search: [this.search()],
      exprange: [[this.exp_value(), this.exp_highValue()]],
      age: [[this.age_val(), this.age_highVal()]],
    });


    this.filterForm.valueChanges.subscribe((value) => {
      this.queryParams.page = 1;
      if (value['job_position'] !== null) {
        const jobPosition = this.findJobPositionName(value['job_position']);
        if (jobPosition) {
          this.queryParams.job_position = jobPosition;
        }
      }
      else{
        this.queryParams.job_position = undefined;
      }

      if (value['start_date']) {
        const date = this.datePipe.transform(value['start_date'], 'yyyy-MM-dd');
        if (date) {
          this.queryParams.start_date = date;
        }
      }
      else{
        this.queryParams.start_date = undefined;
      }

      if (value['location'].length >=1 ) {
        const location = this.findLocationName(value['location']);
        if (location) {
          this.queryParams.country = location;
        }
      }
      else{
        this.queryParams.country = undefined;
      }

      if (value['job_type']) {
        const jobType = this.findJobTypeName(value['job_type']);
        if (jobType) {
          this.queryParams.job_type = jobType;
        }
      }
      else{
        this.queryParams.job_type = undefined;
      }

      if (value['contractStatus'].length >=1) {
        const contract = this.findContractName(value['contractStatus']);
        if (contract) {
          this.queryParams.contract_status = contract;
        }
      }
      else{
        this.queryParams.contract_status = undefined;
      }

      if (value['resume_by']) {
        const resumeBy = this.findResumeName(value['resume_by']);
        if (resumeBy) {
          this.queryParams.post_manager = resumeBy;
        }
      }
      else{
        this.queryParams.post_manager = undefined;
      }

      if (value['language'].length >=1) {
        const language = this.findLanguageName(value['language']);
        if (language) {
          this.queryParams.Language = language;
        }
      }
      else{
        this.queryParams.Language = undefined;
      }

      if (value['skill']) {
        const skill = this.findSkillName(value['skill']);
        if (skill) {
          this.queryParams.Main_Skills = skill;
        }
      }
      else{
        this.queryParams.Main_Skills = undefined;
      }

      if (value['nationality']) {
        const nationality = this.findNationalityName(value['nationality']);
        if (nationality) {
          this.queryParams.nationality = nationality;
        }
      }
      else{
        this.queryParams.nationality = undefined;
      }

      if (value['gender']) {
        const gender = this.findGenderValue(value['gender']);
        if (gender) {
          this.queryParams.gender = gender;
        }
      }
      else{
        this.queryParams.gender = undefined;
      }
      this.navigateQuery()
    })
  }

  toggleRadioButton(id: number, name: string) {
    if (name === 'jobposition') {
      const control = this.filterForm.get('job_position');
      const currentValue = control?.value;
      if (currentValue === id) {
        control?.patchValue(null);
      }
      else {
        control?.patchValue(id);
      }
    }
    if(name === 'jobtype'){
      const control = this.filterForm.get('job_type');
      const currentValue = control?.value;
      if (currentValue === id) {
        control?.patchValue(null);
      }
      else {
        control?.patchValue(id);
      }
    }
    if(name === 'resume'){
      const control = this.filterForm.get('resume_by');
      const currentValue = control?.value;
      if (currentValue === id) {
        control?.patchValue(null);
      }
      else {
        control?.patchValue(id);
      }
    }
    if(name === 'gender'){
      const control = this.filterForm.get('gender');
      const currentValue = control?.value;
      if (currentValue === id) {
        control?.patchValue(null);
      }
      else {
        control?.patchValue(id);
      }
    }
  }

  expRange(event: any) {
    const range = event.value + '-' + event.highValue;
    if (range !== '0-40') {
      this.queryParams.experience_range = range;
    }
    else{
      this.queryParams.experience_range = undefined;
      this.filterParameter().experience_min = 0;
      this.filterParameter().experience_max = 40;
    }
    this.navigateQuery()
  }

  ageRange(event: any) {
    const range = event.value + '-' + event.highValue
    if (range !== '18-60') {
      this.queryParams.age_range = range;
    }
    else{
      this.queryParams.age_range = undefined;
      this.filterParameter().age_min = 18;
      this.filterParameter().age_max = 60;
    }
    this.navigateQuery()
  }


  navigateQuery() {
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
    if (!location) return ''
    const locationNames = location.map(locationId => {
      const foundLocation = this.masterData().candidate_country.find(country => country.country_id === locationId);
      return foundLocation ? foundLocation.country_name : undefined
    });
    return locationNames.filter(name => name !== undefined).join(',').replace(/\s+/g, '-');
  }

  findLocationId(location: string[]) {
    if (!location) return ''
    const locationId = location.map(locationName => {
      const foundName = this.masterData().candidate_country.find(country => country.country_name === locationName);
      return foundName ? foundName.country_id : undefined;
    });
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
    return languageId
  }

  findMainSkill(): any[] {
    const mainSkillsCategoryId = this.masterData().skill_category.find(category => category.skill_category_name === 'Main Skills')?.skill_category_id;
    if (mainSkillsCategoryId !== undefined) {
      const mainSkill = this.masterData().skills.filter(skill => skill.skill_category_id === mainSkillsCategoryId);
      const mainSkillDetails = mainSkill.map(skill => ({
        skill_category_id: skill.skill_category_id,
        skill_id: skill.skill_id,
        skill_name: skill.skill_name,
        skill_icon: skill.skill_icon
      }));
      return mainSkillDetails
    }
    else {
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
    return skillId
  }

  findNationalityName(id: number): string | undefined {
    const nationality = this.masterData().nationality.find(val => val.nationality_id === id);
    return nationality ? nationality.nationality_name.replace(/\s+/g, '-') : undefined;
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

  onSearchClick() {
    const searchValue = this.filterForm.get('search')?.value;
    if (searchValue) {
      this.queryParams.name = searchValue;
    }
    else{
      this.queryParams.name = undefined
    }
    this.navigateQuery()
  }


  reset() {
    this.filterForm.patchValue({
      job_position: 0,
      start_date: '',
      location: [],
      job_type: 0,
      contractStatus: [],
      resume_by: 0,
      language: [],
      skill: [],
      nationality: 0,
      gender: 0,
      search: '',
      exprange: [0, 40],
      age: [18, 60]
    });

    this.exp_value.set(0);
    this.exp_highValue.set(40)

    this.queryParams = {
      page: this.page
    }
    this.navigateQuery();
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }

}
