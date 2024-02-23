import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../services/service.service';
import { UserStore } from '../user.store';
import { SharedModule } from '../../shared/shared.module';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfilesComponent } from "../candidates/profiles/profiles.component";

@Component({
  selector: 'app-resume',
  standalone: true,
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css',
  imports: [SharedModule, ProfilesComponent]
})
export class ResumeComponent {
  // [x: string]: any;
  @Input() country: string = '';
  @Input() jobType: string = '';
  @Input() candidateName: string = '';
  @Input() candidateId: string = '';

  url: string = '';

  readonly store = inject(UserStore);

  masterdata = this.store.master().data

  main_content = {
    1: { img: '1_1599642484', name: 'Language', color: 'transparent' },
    4: { img: '4_1599643968', name: 'Main Skills', color: '#7a7a7a' },
    2: { img: '2_1599644151', name: 'Cooking Skills', color: '#25ae88' },
    3: { img: '3_1599642528', name: 'Other Skills', color: '#054a84' },
    5: { img: '5_1599644127', name: 'Personality', color: 'transparent' }
  }

  order = ['1', '4', '2', '3', '5']

  mainContentEntries: [string, { img: string; name: string; color: string }][] = [];

  details: any;

  data: any
  helperName: string = ''
  img: string = ''
  age: number = 0
  gender: string = ''
  marital_status: string = ''
  child_count: string = ''
  nationality: string = ''
  religion: string = ''
  resume_manager: string = ''
  job_position: string = ''
  contract_status: string = ''
  candidate_country: string = ''
  experience_year: number = 0
  startDtae: string = ''
  job_type: string = ''

  resume_content: string = ''

  constructor(private router: Router, private ngxService: NgxUiLoaderService,
    private activatedRoute: ActivatedRoute, private service: ServiceService) {
    this.mainContentEntries = Object.entries(this.main_content).sort(([a], [b]) => this.order.indexOf(a) - this.order.indexOf(b));
  }

  async ngOnInit() {
    this.url = this.country + '/' + this.jobType + '/' + this.candidateName + '/' + this.candidateId
    // this.ngxService.start();

    try {

    this.data = await this.store.getCandidateByUrl(this.url);

    this.helperName = this.data?.resume_detail?.helper_name;
    this.img = this.data?.resume_detail?.profile_photo;
    this.age = this.data?.resume_detail?.age;
    this.gender = this.data?.resume_detail?.gender;
    this.marital_status = this.data?.resume_detail?.marital_status;
    const child = this.data?.resume_detail?.child_count;
    this.child_count = child === '0' ? 'No Kids' : child;

    const nationality_id = this.data?.resume_detail?.nationality_id;
    const nationality_name = this.masterdata.nationality.find(id => id.nationality_id === nationality_id);
    this.nationality = nationality_name ? nationality_name.nationality_name : '';

    const religion_id = this.data?.resume_detail?.religion_id;
    const religion_name = this.masterdata.religion.find(id => id.religion_id === religion_id);
    this.religion = religion_name ? religion_name.religion_name : '';

    this.resume_manager = this.data?.resume_detail?.resume_manager;

    const position_id = this.data?.resume_detail?.position_id;
    const position_name = this.masterdata.job_position.find(id => id.job_position_id === position_id);
    this.job_position = position_name ? position_name.position_name : '';

    const contract_status_id = this.data?.resume_detail?.contract_status_id;
    const contract_status_name = this.masterdata.contract_status.find(id => id.contract_sts_id === contract_status_id);
    this.contract_status = contract_status_name ? contract_status_name.contract_sts_name : '';

    const current_country_id = this.data?.resume_detail?.current_country_id;
    const current_country_name = this.masterdata.candidate_country.find(id => id.country_id === current_country_id);
    this.candidate_country = current_country_name ? current_country_name.country_name : '';

    this.experience_year = this.data?.resume_detail?.experience_year;

    const date = this.data?.resume_detail?.next_job_available_date;
    const formatedDate = new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    this.startDtae = formatedDate;

    const job_type_id = this.data?.resume_detail?.job_type_id;
    const job_type_name = this.masterdata.job_type.find(id => id.job_type_id === job_type_id);
    this.job_type = job_type_name ? job_type_name.job_type_name : '';

    let about = this.data?.resume_detail?.resume_content;
    about = about.replace(/<p>|<\/p>/g, '');
    about = about.replace(/&nbsp;/g, '');
    about = about.replace(/&#39;/g, "'");
    this.resume_content = about;

    const resume_skill = this.data?.resume_detail?.resume_skill;
    const skills = this.masterdata.skills;
    const skill_category = this.masterdata.skill_category;
    const category_ids: number[] = [];
    resume_skill.forEach((id: number) => {
      const skill = skills.find(skill => skill.skill_id === id);
      if (skill) {
        if (!category_ids.includes(skill.skill_category_id)) {
          category_ids.push(skill.skill_category_id);
        }
      }
    });
    const category_object: { [key: number]: any[] } = {};
    category_ids.forEach(id => {
      category_object[id] = [];
    });
    resume_skill.forEach((skill_id: number) => {
      const skill = skills.find(skill => skill.skill_id === skill_id);
      if (skill) {
        category_object[skill.skill_category_id].push(skill.skill_name)
      }
    })
    this.details = category_object

  } 
  catch(error) {
    console.error('Error:', error);
  } 
  // finally {
  //   this.ngxService.stop();
  // }
  }


ngOnDestroy(): void {
  this.store.clearCandidateByUrl();
}

}
