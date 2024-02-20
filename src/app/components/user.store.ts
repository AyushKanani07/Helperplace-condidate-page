import { computed, inject, signal } from "@angular/core";
import { CandidateResponse, FilterProperties, State } from "./data-type";
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { withDevtools } from "@angular-architects/ngrx-toolkit";
import { ServiceService } from "./services/service.service";
import { DatePipe } from "@angular/common";


const UserState: State = {
    candidate: {
        success: true,
        status: 1,
        data: [],
        records_total: 0,
        records_filtered: 0,
        message: '',
    },
    master: {
        success: true,
        status: 1,
        data: {
            contract_status: [],
            candidate_country: [],
            job_type: [],
            job_position: [],
            language: [],
            skill_category: [],
            skills: [],
            nationality: []
        },
        message: ''
    },
    filteredData: [],
    filterState: {
        job_position: 0,
    }
}

const InitialState = signal(UserState);

export const UserStore = signalStore(
    { providedIn: 'root' },
    withDevtools('user'),
    withState(InitialState),
    withComputed((store) => ({
        totalItems: computed(() => store.candidate().records_total ? Math.ceil(store.candidate().records_total / 20) : 0)
    })),
    withMethods(store => {
        const service = inject(ServiceService);
        const datePipe = inject(DatePipe)
        return {
            loadCandidates(filterParameter: FilterProperties) {
                service.getCandidates(filterParameter).subscribe((result: CandidateResponse) => {
                    if (result && result.data) {
                        patchState(store, { candidate: result });
                        this.filtering()
                    }
                })
            },
            loadMasterData() {
                service.getMasterdata().subscribe((result: any) => {
                    if (result && result.data) {
                        patchState(store, { master: result })
                    }
                })
            },
            filtering() {
                const candidateData = store.candidate.data;
                const masterData = store.master.data;
                if (!candidateData || !masterData) {
                    return;
                }

                const filter = candidateData().map(candidate => {
                    // Map each candidate with the master data
                    const contractStatusName = masterData().contract_status.find(csn => csn.contract_sts_id === candidate.contract_status_id);
                    const countryName = masterData().candidate_country.find(cn => cn.country_id === candidate.current_country_id);
                    const jobType = masterData().job_type.find(jt => jt.job_type_id === candidate.job_type_id);
                    const position = masterData().job_position.find(jp => jp.job_position_id === candidate.position_id);

                    const formattedDate = datePipe.transform(candidate.next_job_available_date, 'dd MMM yyyy');

                    return {
                        ...candidate,
                        job_type_name: jobType ? jobType.job_type_name : 'Unknown',
                        position_name: position ? position.position_name : 'Unknown',
                        contract_sts_name: contractStatusName ? contractStatusName.contract_sts_name : 'Unknown',
                        country_name: countryName ? countryName.country_name : 'Unknown',
                        next_job_available_date: formattedDate || 'Unknown'
                    };
                });
                // Update the store state with the filtered data
                patchState(store, { filteredData: filter });
            },
            updateFilterState(id,name){
                if(name == 'job_postion'){
                    patchState(store, store.filterState().job_position = id)
                }
            }
        }
    }),
    withHooks({
        onInit({loadMasterData, filtering}){
            loadMasterData();
            filtering()
        },
        onDestroy() {
        }
    })

)