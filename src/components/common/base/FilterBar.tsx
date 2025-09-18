import React from "react"
import Button from "@/components/common/base/Button"
import { Search } from "lucide-react"

interface FilterBarProps {
showDateRange?: boolean
startDate?: string
endDate?: string
onStartDate?: (date: string) => void
onEndDate?: (date: string) => void
keyword?: string
onKeywordChange?: (value: string) => void
searchText?: string
onSearchText?: (value: string) => void
educationTarget?: string
onEducationTargetChange?: (value: string) => void
educationMethod?: string
onEducationMethodChange?: (value: string) => void
inspectionField?: string
onInspectionFieldChange?: (value: string) => void
inspectionKind?: string
onInspectionKindChange?: (value: string) => void
onSearch: () => void
}

const LABEL_CLASS="text-sm font-medium text-[#333639] whitespace-nowrap"
const INPUT_CLASS="h-[36px] border border-[#AAAAAA] rounded-[8px] px-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#B9D0F6] text-sm font-normal text-[#333639] placeholder:text-[#AAAAAA]"

const targetOptions=[{value:"",label:"-전체-"},{value:"근로자 교육",label:"근로자 교육"},{value:"관리자 교육",label:"관리자 교육"},{value:"기타 교육",label:"기타 교육"}]
const methodOptionsEdu=[{value:"",label:"-전체-"},{value:"자체교육",label:"자체교육"},{value:"온라인·집체교육",label:"온라인·집체교육"}]

export const inspectionFieldOptions=[{value:"",label:"-전체-"},{value:"시설물",label:"시설물"},{value:"자산(설비)",label:"자산(설비)"},{value:"자율점검",label:"자율점검"}]
export const inspectionKindOptions=[
{value:"",label:"-전체-"},
{value:"정기점검",label:"정기점검"},
{value:"수시점검",label:"수시점검"},
{value:"특별점검",label:"특별점검"},
{value:"일일점검",label:"일일점검"}
]

const renderSelect=(label:string,value:string,onChange:(v:string)=>void,options:{value:string;label:string}[])=>(
<div className="relative flex items-center gap-x-3 min-w-[160px]">
<span className={LABEL_CLASS}>{label}</span>
<select className={`${INPUT_CLASS} w-full appearance-none pr-8`} value={value} onChange={e=>onChange(e.target.value)}>
{options.map(opt=>(<option key={opt.value} value={opt.value}>{opt.label}</option>))}
</select>
</div>
)

const FilterBar:React.FC<FilterBarProps>=({
showDateRange=true,
startDate,
endDate,
onStartDate,
onEndDate,
keyword,
onKeywordChange,
searchText,
onSearchText,
educationTarget,
onEducationTargetChange,
educationMethod,
onEducationMethodChange,
inspectionField,
onInspectionFieldChange,
inspectionKind,
onInspectionKindChange,
onSearch
})=>{
const shouldShowDate=Boolean(showDateRange&&startDate!==undefined&&endDate!==undefined&&onStartDate&&onEndDate)
return(
<section className="tbm-filter w-full flex flex-wrap items-center gap-3 px-3 py-3 mb-3 bg-[#F8F8F8] border border-[#E5E5E5] rounded-[10px]">
<div className="flex flex-wrap items-center gap-3 flex-grow min-w-0">
{shouldShowDate&&(
<div className="flex items-center gap-x-3 flex-shrink-0 w-full sm:w-auto min-w-[280px]">
<span className={LABEL_CLASS}>기간 선택</span>
<input type="date" className={`${INPUT_CLASS} w-[130px]`} value={startDate} onChange={e=>onStartDate!(e.target.value)}/>
<span className="text-sm font-normal text-[#333639] select-none">~</span>
<input type="date" className={`${INPUT_CLASS} w-[130px]`} value={endDate} onChange={e=>onEndDate!(e.target.value)}/>
</div>
)}
{educationTarget!==undefined&&educationMethod!==undefined&&onEducationTargetChange&&onEducationMethodChange&&(
<div className="flex flex-nowrap gap-3 w-full sm:w-auto flex-shrink-0">
{renderSelect("교육대상",educationTarget,onEducationTargetChange,targetOptions)}
{renderSelect("교육방식",educationMethod,onEducationMethodChange,methodOptionsEdu)}
</div>
)}
{(inspectionField!==undefined&&onInspectionFieldChange)||(inspectionKind!==undefined&&onInspectionKindChange)?(
<div className="flex flex-nowrap gap-3 w-full sm:w-auto flex-shrink-0">
{inspectionField!==undefined&&onInspectionFieldChange&&renderSelect("점검분야",inspectionField,onInspectionFieldChange,inspectionFieldOptions)}
{inspectionKind!==undefined&&onInspectionKindChange&&renderSelect("점검종류",inspectionKind,onInspectionKindChange,inspectionKindOptions)}
</div>
):null}
{(keyword!==undefined&&onKeywordChange)||(searchText!==undefined&&onSearchText)?(
<div className="flex items-center gap-x-3 flex-shrink-0 w-full sm:w-auto min-w-[300px] max-w-[360px]">
<span className={LABEL_CLASS}>검색</span>
<div className="relative w-[240px]">
<input type="text" className={`${INPUT_CLASS} w-full pr-10`} placeholder="검색어 입력" value={keyword??searchText??""} onChange={e=>{if(onKeywordChange)onKeywordChange(e.target.value);else if(onSearchText)onSearchText(e.target.value)}}/>
<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"/>
</div>
</div>
):null}
</div>
<div className="w-full sm:w-auto flex justify-end">
<Button variant="secondary" className="flex-shrink-0 text-xs md:text-sm h-[33px] md:h-[39px] min-w-[80px]" onClick={onSearch}>검색</Button>
</div>
</section>
)
}

export default FilterBar