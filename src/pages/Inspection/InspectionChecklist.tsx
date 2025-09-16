import React,{useEffect,useMemo,useState}from"react"
import{useNavigate,useLocation}from"react-router-dom"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import Pagination from "@/components/common/base/Pagination"
import Badge from "@/components/common/base/Badge"
import{CirclePlus,Save,Printer,Trash2}from"lucide-react"

const TAB_LABELS:string[]=["점검일정","점검결과","점검표(체크리스트)"]
const TAB_PATHS:string[]=["/inspection/plan","/inspection/results","/inspection/checklist"]
const PAGE_SIZE=30


type ChecklistRow=DataRow&{template:string;field:string;kind:string;status:"사용"|"미사용";registrant:string;registeredAt:string}

const columns:Column[]=[
{key:"id",label:"번호",minWidth:50},
{key:"template",label:"점검표명",minWidth:300},
{key:"field",label:"점검분야",minWidth:100},
{key:"kind",label:"점검종류",minWidth:100},
{key:"status",label:"사용여부",minWidth:100,renderCell:(row)=>(<Badge color={(row as ChecklistRow).status==="사용"?"blue":"red"}>{(row as ChecklistRow).status}</Badge>)},
{key:"registeredAt",label:"최종등록일",minWidth:100},
{key:"registrant",label:"등록인",minWidth:100},
{key:"manage",label:"관리",minWidth:130,renderCell:()=>(<button aria-label="자세히보기/편집" style={{background:"none",border:"none",padding:0,color:"#999999",cursor:"pointer"}} onMouseEnter={(e)=>(e.currentTarget.style.textDecoration="underline")} onMouseLeave={(e)=>(e.currentTarget.style.textDecoration="none")}>자세히보기/편집</button>)}
]

const initialData:ChecklistRow[]=[
{id:3,template:"전기설비 정기점검(9월)",field:"시설물",kind:"정기점검",status:"사용",registrant:"김안전",registeredAt:"2025-06-20"},
{id:2,template:"개인보호구 일상점검표",field:"자율점검",kind:"수시점검",status:"사용",registrant:"박현장",registeredAt:"2025-05-28"},
{id:1,template:"화기작업 사전점검표",field:"자산(설비)",kind:"특별점검",status:"미사용",registrant:"이관리",registeredAt:"2025-04-10"}
]

const InspectionChecklist:React.FC=()=>{
const navigate=useNavigate(),location=useLocation()
const initIdx:number=TAB_PATHS.indexOf(location.pathname)
const[currentTabIdx,setCurrentTabIdx]=useState<number>(initIdx===-1?1:initIdx)
const[data,setData]=useState<ChecklistRow[]>(initialData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[searchText,setSearchText]=useState<string>("")
const[inspectionField,setInspectionField]=useState<string>("")
const[inspectionKind,setInspectionKind]=useState<string>("")
const[currentPage,setCurrentPage]=useState<number>(1)

const handleTabClick=(idx:number):void=>{if(location.pathname!==TAB_PATHS[idx]){setCurrentTabIdx(idx);navigate(TAB_PATHS[idx]);setCheckedIds([])}}
const handleCreate=():void=>{navigate("/inspection/checklist/register")}
const handleDownload=():void=>{alert("다운로드 기능 준비 중")}
const handlePrint=():void=>{window.print()}
const handleDelete=():void=>{if(checkedIds.length===0){alert("삭제할 항목을 선택하세요");return}if(window.confirm("정말 삭제하시겠습니까?")){setData(prev=>prev.filter(row=>!checkedIds.includes(row.id)));setCheckedIds([]);alert("삭제되었습니다.")}}

const filteredData=useMemo<ChecklistRow[]>(()=>data.filter(r=>{
const byField:boolean=!inspectionField||r.field===inspectionField
const byKind:boolean=!inspectionKind||r.kind===inspectionKind
const bySearch:boolean=!searchText||[r.template,r.field,r.kind,r.status,r.registrant,r.registeredAt,String(r.id)].some(v=>String(v).toLowerCase().includes(searchText.toLowerCase()))
return byField&&byKind&&bySearch
}),[data,inspectionField,inspectionKind,searchText])

const totalPages:number=Math.max(1,Math.ceil(filteredData.length/PAGE_SIZE))
useEffect(()=>{setCurrentPage(p=>Math.min(Math.max(1,p),totalPages))},[totalPages])
useEffect(()=>{setCurrentPage(1)},[inspectionField,inspectionKind,searchText])

const pagedData=useMemo<ChecklistRow[]>(()=>{const s=(currentPage-1)*PAGE_SIZE;return filteredData.slice(s,s+PAGE_SIZE)},[filteredData,currentPage])

return(
<section className="w-full bg-white">
<PageTitle>{TAB_LABELS[currentTabIdx]??"점검표관리"}</PageTitle>
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

export default InspectionChecklist