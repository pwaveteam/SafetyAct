import React,{useEffect,useMemo,useState}from"react"
import{useNavigate,useLocation}from"react-router-dom"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable,{Column,DataRow}from"@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import Pagination from "@/components/common/base/Pagination"
import {Save,Printer,Trash2,Eye} from"lucide-react"

const TAB_LABELS:string[]=["점검일정","점검결과","점검표(체크리스트)"]
const TAB_PATHS:string[]=["/inspection/plan","/inspection/results","/inspection/checklist"]
const PAGE_SIZE=30

type ResultRow=DataRow&{template:string;workplace:string;field:string;kind:string;inspector:string;inspectedAt:string}

const initialData:ResultRow[]=[
{id:3,template:"이동장비 안전점검표",workplace:"제3공장",field:"시설물",kind:"수시점검",inspector:"김현장",inspectedAt:"2025-07-30"},
{id:2,template:"배전반 열화상 점검표",workplace:"제8공장",field:"자산(설비)",kind:"정기점검",inspector:"곽현장",inspectedAt:"2025-07-18"},
{id:1,template:"화학물질 취급작업 점검표",workplace:"제1공장",field:"시설물",kind:"특별점검",inspector:"김현장",inspectedAt:"2025-06-27"}
]

const InspectionResults:React.FC=()=>{
const navigate=useNavigate(),location=useLocation()
const initIdx=TAB_PATHS.indexOf(location.pathname)
const[currentTabIdx,setCurrentTabIdx]=useState<number>(initIdx===-1?2:initIdx)
const[data,setData]=useState<ResultRow[]>(initialData)
const[checkedIds,setCheckedIds]=useState<(number|string)[]>([])
const[searchText,setSearchText]=useState<string>("")
const[inspectionField,setInspectionField]=useState<string>("")
const[inspectionKind,setInspectionKind]=useState<string>("")
const[currentPage,setCurrentPage]=useState<number>(1)

const columns:Column[]=useMemo(()=>[
{key:"id",label:"번호",minWidth:50},
{key:"template",label:"점검표명",minWidth:250},
{key:"workplace",label:"장소",minWidth:100},
{key:"field",label:"점검분야",minWidth:100},
{key:"kind",label:"점검종류",minWidth:100},
{key:"inspectedAt",label:"점검일",minWidth:100},
{key:"inspector",label:"점검자",minWidth:100},
{
key:"manage",
label:"점검결과",
minWidth:100,
renderCell:(row)=>{
const r=row as ResultRow
return (
<div style={{display:"flex",justifyContent:"center"}}>
<button
style={{
display:"flex",
alignItems:"center",
gap:"3px",
background:"none",
border:"none",
padding:0,
cursor:"pointer",
color:"inherit",
font:"inherit"
}}
onClick={()=>navigate(`/inspection/results/${r.id}`)}
>
<Eye size={16}/>점검결과 보기
</button>
</div>
)
}
}  
],[navigate])

const handleTabClick=(idx:number):void=>{
if(location.pathname!==TAB_PATHS[idx]){
setCurrentTabIdx(idx);navigate(TAB_PATHS[idx]);setCheckedIds([])
}
}
const handleDownload=():void=>{alert("다운로드 기능 준비 중")}
const handlePrint=():void=>window.print()
const handleDelete=():void=>{
if(checkedIds.length===0){alert("삭제할 항목을 선택하세요");return}
if(window.confirm("정말 삭제하시겠습니까?")){
setData(prev=>prev.filter(row=>!checkedIds.includes(row.id)))
setCheckedIds([])
}
}

const filteredData=useMemo(()=>data.filter(r=>{
const byField=!inspectionField||r.field===inspectionField
const byKind=!inspectionKind||r.kind===inspectionKind
const bySearch=!searchText||[r.template,r.workplace,r.field,r.kind,r.inspector,r.inspectedAt,String(r.id)].some(v=>v.toLowerCase().includes(searchText.toLowerCase()))
return byField&&byKind&&bySearch
}),[data,inspectionField,inspectionKind,searchText])

const totalPages=Math.max(1,Math.ceil(filteredData.length/PAGE_SIZE))
useEffect(()=>{setCurrentPage(p=>Math.min(Math.max(1,p),totalPages))},[totalPages])
useEffect(()=>{setCurrentPage(1)},[inspectionField,inspectionKind,searchText])

const pagedData=useMemo(()=>{
const start=(currentPage-1)*PAGE_SIZE
return filteredData.slice(start,start+PAGE_SIZE)
},[filteredData,currentPage])

return(
<section className="w-full bg-white">
<PageTitle>{TAB_LABELS[currentTabIdx]??"점검결과지"}</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={currentTabIdx} onTabClick={handleTabClick} className="mb-6"/>
<div className="mb-3">
<FilterBar
showDateRange={true}
inspectionField={inspectionField}
onInspectionFieldChange={setInspectionField}
inspectionKind={inspectionKind}
onInspectionKindChange={setInspectionKind}
searchText={searchText}
onSearchText={setSearchText}
onSearch={()=>{}}
/>
</div>
<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {filteredData.length}건</span>
<div className="flex flex-col gap-1 w-full justify-end sm:hidden">
<div className="flex gap-1 justify-end">
<Button variant="action" onClick={handleDownload} className="flex items-center gap-1"><Save size={16}/>다운로드</Button>
<Button variant="action" onClick={handlePrint} className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>
<div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
<Button variant="action" onClick={handleDownload} className="flex items-center gap-1"><Save size={16}/>다운로드</Button>
<Button variant="action" onClick={handlePrint} className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>
<div className="overflow-x-auto bg-white">
<DataTable columns={columns} data={pagedData} onCheckedChange={setCheckedIds}/>
</div>
<div className="mt-4 flex justify-center">
<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page:number)=>setCurrentPage(page)}/>
</div>
</section>
)
}

export default InspectionResults