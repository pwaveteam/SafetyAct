import React,{useEffect,useMemo,useState}from"react"
import{useNavigate,useLocation}from"react-router-dom"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import Pagination from "@/components/common/base/Pagination"
import Badge from "@/components/common/base/Badge"
import{CirclePlus,Trash2,Printer,Save}from"lucide-react"

const TAB_LABELS:string[]=["점검일정","점검결과","점검표(체크리스트)"]
const TAB_PATHS:string[]=["/inspection/plan","/inspection/results","/inspection/checklist"]
const PAGE_SIZE=30

type PlanRow=DataRow&{planName:string;site:string;area:string;kind:string;inspector:string;schedule:string;registrant:string;progress:"미점검"|"완료"}

const InspectionPlan:React.FC=()=>{
const navigate=useNavigate(),location=useLocation()
const[currentTabIdx,setCurrentTabIdx]=useState<number>(TAB_PATHS.indexOf(location.pathname)===-1?0:TAB_PATHS.indexOf(location.pathname))
const handleStartInspection=(id:number|string):void=>{navigate(`/inspection/plan/${id}/execute`)}

const columns:Column[]=[
{key:"id",label:"번호",minWidth:50},
{key:"planName",label:"점검표명",minWidth:300},
{key:"site",label:"장소",minWidth:100},
{key:"area",label:"점검분야",minWidth:100},
{key:"kind",label:"점검종류",minWidth:100},
{key:"schedule",label:"점검일정",minWidth:160},
{key:"inspector",label:"점검자",minWidth:100},
{key:"registrant",label:"등록인",minWidth:100},
{key:"progress",label:"점검여부",minWidth:100,renderCell:(row)=>((row as PlanRow).progress==="완료"?<div className="flex justify-center"><Badge color="gray">점검완료</Badge></div>:<div className="flex justify-center"><Badge color="blue" onClick={()=>handleStartInspection((row as PlanRow).id)}>점검하기</Badge></div>)}
]

const initialData:PlanRow[]=[
{id:3,planName:"전기설비 정기점검(9월)",site:"제3공장",area:"시설물",kind:"수시점검",inspector:"김안전",schedule:"2025/09/10 ~ 2025/09/15",registrant:"관리자",progress:"미점검"},
{id:2,planName:"화기작업 사전점검",site:"제1공장",area:"시설물",kind:"수시점검",inspector:"박현장",schedule:"2025/09/01 ~ 2025/09/03",registrant:"관리자",progress:"완료"},
{id:1,planName:"보호구 일상점검(주간)",site:"제3공장",area:"자산(설비)",kind:"특별점검",inspector:"김현장",schedule:"2025/08/18 ~ 2025/08/22",registrant:"안전팀",progress:"미점검"}
]

const[data,setData]=useState<PlanRow[]>(initialData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[searchText,setSearchText]=useState<string>("")
const[inspectionField,setInspectionField]=useState<string>("")
const[inspectionKind,setInspectionKind]=useState<string>("")
const[currentPage,setCurrentPage]=useState<number>(1)

const handleTabClick=(idx:number):void=>{if(location.pathname!==TAB_PATHS[idx]){setCurrentTabIdx(idx);navigate(TAB_PATHS[idx]);setCheckedIds([])}}
const handleCreate=():void=>{navigate("/inspection/plan/register")}
const handleDownload=():void=>{alert("다운로드 기능 준비 중")}
const handlePrint=():void=>{window.print()}
const handleDelete=():void=>{if(checkedIds.length===0){alert("삭제할 항목을 선택하세요");return}if(window.confirm("정말 삭제하시겠습니까?")){setData(prev=>prev.filter(r=>!checkedIds.includes(r.id)));setCheckedIds([]);alert("삭제되었습니다.")}}

const filteredData:PlanRow[]=data.filter(r=>{
const byField:boolean=!inspectionField||r.area===inspectionField
const byKind:boolean=!inspectionKind||(`${r.kind}점검`===inspectionKind||r.kind===inspectionKind)
const bySearch:boolean=!searchText||[r.planName,r.site,r.area,r.kind,r.inspector,r.schedule,r.registrant,r.progress,String(r.id)].some(v=>String(v).toLowerCase().includes(searchText.toLowerCase()))
return byField&&byKind&&bySearch
})

const totalPages:number=Math.max(1,Math.ceil(filteredData.length/PAGE_SIZE))
useEffect(()=>{setCurrentPage(p=>Math.min(Math.max(1,p),totalPages))},[totalPages])
useEffect(()=>{setCurrentPage(1)},[inspectionField,inspectionKind,searchText])

const pagedData:PlanRow[]=useMemo(()=>{const s=(currentPage-1)*PAGE_SIZE;return filteredData.slice(s,s+PAGE_SIZE)},[filteredData,currentPage])

return(
<section className="w-full bg-white">
<PageTitle>{TAB_LABELS[currentTabIdx]??TAB_LABELS[0]}</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={currentTabIdx} onTabClick={handleTabClick} className="mb-6"/>
<div className="mb-3">
<FilterBar showDateRange={false} inspectionField={inspectionField} onInspectionFieldChange={setInspectionField} inspectionKind={inspectionKind} onInspectionKindChange={setInspectionKind} searchText={searchText} onSearchText={setSearchText} onSearch={()=>{}}/>
</div>
<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {filteredData.length}건</span>
<div className="flex w-full justify-end sm:hidden">
<div className="flex gap-1 justify-end flex-nowrap overflow-x-auto -mx-2 px-2">
<Button variant="action" onClick={handleCreate} className="flex items-center gap-1 shrink-0 whitespace-nowrap">
<CirclePlus size={16}/>신규등록
</Button>
<Button variant="action" onClick={handleDownload} className="flex items-center gap-1 shrink-0 whitespace-nowrap">
<Save size={16}/>다운로드
</Button>
<Button variant="action" onClick={handlePrint} className="flex items-center gap-1 shrink-0 whitespace-nowrap">
<Printer size={16}/>인쇄
</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1 shrink-0 whitespace-nowrap">
<Trash2 size={16}/>삭제
</Button>
</div>
</div>
<div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
<Button variant="action" onClick={handleCreate} className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action" onClick={handleDownload} className="flex items-center gap-1"><Save size={16}/>다운로드</Button>
<Button variant="action" onClick={handlePrint} className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>
<div className="overflow-x-auto bg-white"><DataTable columns={columns} data={pagedData} onCheckedChange={setCheckedIds}/></div>
<div className="mt-4 flex justify-center"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p:number)=>setCurrentPage(p)}/></div>
</section>
)
}

export default InspectionPlan