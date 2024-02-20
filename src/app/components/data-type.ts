
export interface Candidate {
    age: number,
    contract_status_id: number,
    contract_sts_name?: string,
    current_country_id: number,
    country_name?: string,
    experience_year: number,
    helper_name: string,
    job_type_id: number,
    job_type_name?: string,
    meta_data: string,
    next_job_available_date: string,
    position_id: number,
    position_name?: string,
    profile_photo: string,
    resume_url: string,
    resume_id: number,
    resume_manager: string,
    very_active: number,
}

// export interface CandidateWithMaster extends candidate{
//     contract_sts_name: string,
//     country_name: string,
//     job_type_name: string,
//     position_name: string,
// }

export interface CandidateResponse {
    success: boolean;
    status: number;
    data: Candidate[];
    records_total: number;
    records_filtered: number;
    message: string;
}

export interface FilterProperties {
    page?: number,
    pageSize?: number,
    job_position?: number,
    start_date?: string,
    country?: string,
    job_type?: number,
    contract_status?: string,
    post_manager?: string,
    Language?: (number | undefined)[],
    Main_Skills?: (number | undefined)[],
    nationality?: number | string,
    gender?: string,
    order_by?: string,
    name?: string,
    experience_min?: number,
    experience_max?: number,
    age_min?: number,
    age_max?: number
}

export interface QueryParamFilterProperties {
    page?: string | number,
    pageSize?: string,
    job_position?: string,
    start_date?: string | null,
    country?: string,
    job_type?: string,
    contract_status?: string,
    post_manager?: string,
    Language?: string,
    Main_Skills?: string,
    nationality?: string,
    gender?: string,
    order_by?: string,
    name?: string,
    experience_range?: string,
    age_range?: string
}

export interface MasterData {
    success: boolean,
    status: number,
    data: {
        contract_status: ContractStatus[];
        candidate_country: CandidateCountry[];
        job_type: JobType[];
        job_position: JobPosition[];
        language: Language[];
        skill_category: Skill_category[];
        skills: Skill[];
        nationality: Nationality[]
    },
    message: string
}

export interface State {
    candidate: CandidateResponse,
    master: MasterData,
    filteredData: Candidate[],
    filterState: FilterState
}

interface FilterState {
    job_position: number,
    // start_date: string,
    // candidate_location: number[],
    // job_type: number,
    // contract_status: number[],
    // resume_by: number,
}

interface ContractStatus {
    contract_sts_id: number;
    contract_sts_name: string;
    for_resume: number;
    for_job: number;
}

interface JobType {
    job_type_id: number,
    job_type_name: string,
    en_job_type_name: string,
    job_type_icon: string
}

interface JobPosition {
    job_position_id: number,
    position_name: string,
    position_icon: string
}
interface Language {
    language_id: number,
    language_name: string,
    en_language_name: string
}

interface CandidateCountry {
    country_id: number,
    country_name: string,
    en_country_name: string,
    country_code: string,
    job_location_id: number,
    location_name: string,
    en_location_name: string,
    country_flag_icon: string
}

interface Skill_category {
    skill_category_id: number,
    skill_category_name: string,
    en_skill_category_name: string,
    for_helper: number,
    skill_category_icon: string,
    for_employer: number,
    mandatory_for_job: number,
    mandatory_for_resume: number
}

interface Skill {
    skill_id: number,
    skill_category_id: number,
    skill_name: string,
    skill_icon: string
}

interface Nationality {
    nationality_id: number,
    nationality_name: string,
    en_nationality_name: string,
    country_id: null,
    for_resume: number,
    flag_icon: string,
    for_job: number
}