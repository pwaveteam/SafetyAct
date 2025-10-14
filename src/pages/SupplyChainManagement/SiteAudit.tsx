import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import SiteAuditRegister from "@/pages/SupplyChainManagement/SiteAuditRegister"
import Badge from "@/components/common/base/Badge"
import { Download, CirclePlus, Printer, Trash2, Save } from "lucide-react"

const TAB_LABELS = ["수급업체 관리", "안전보건수준 평가", "도급안전보건 협의체", "안전보건 점검", "안전보건 교육/훈련"]
const TAB_PATHS = [
"/supply-chain-management/partners",
"/supply-chain-management/evaluation",
"/supply-chain-management/committee",
"/supply-chain-management/siteaudit",
"/supply-chain-management/training"
]

const columns: Column[] = [
{ key: "id", label: "번호", minWidth: 48 },
{ key: "inspectionDate", label: "점검일", minWidth: 110 },
{ key: "inspectionType", label: "점검종류", minWidth: 120 },
{ key: "inspectionName", label: "점검명(계획명)", minWidth: 200 },
{ key: "inspectionPlace", label: "점검지", minWidth: 150 },
{ key: "inspectionResult", label: "점검결과", minWidth: 120 },
{ key: "note", label: "비고", minWidth: 200 },
{ key: "inspector", label: "점검자", minWidth: 80 },
{ key: "fileAttach", label: "첨부파일", minWidth: 90 },
{ key: "manage", label: "관리", minWidth: 110, renderCell: row => (<button style={{ background: "none", border: "none", padding: 0, color: "#999999", cursor: "pointer", width: 110, textAlign: "center" }} onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>자세히보기/편집</button>) }
]

const initialData: DataRow[] = [
{ id: 3, inspectionDate: "2025-01-10", inspectionType: "합동점검", inspectionName: "비상구 개폐 상태 확인", inspectionPlace: "본관 1층", inspectionResult: <Badge color="sky">이상없음</Badge>, note: "", inspector: "박점검", fileAttach: (<span className="flex justify-center items-center"><Download size={19} aria-label="첨부파일 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>) },
{ id: 2, inspectionDate: "2025-02-01", inspectionType: "일반점검", inspectionName: "이동식 사다리 고정 상태 점검", inspectionPlace: "창고동 2층", inspectionResult: <Badge color="red">주의</Badge>, note: "나사 조임/고정 브래킷 교체 완료", inspector: "이점검", fileAttach: (<span className="flex justify-center items-center"><Download size={19} aria-label="첨부파일 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>) },
{ id: 1, inspectionDate: "2025-03-15", inspectionType: "특별점검", inspectionName: "화학물질 보관 용기 누수 여부 확인", inspectionPlace: "화학물질 보관소", inspectionResult: <Badge color="red">주의</Badge>, note: "누수 용기 즉시 교체/바닥 세척 및 방수 처리", inspector: "최안전", fileAttach: (<span className="flex justify-center items-center"><Download size={19} aria-label="첨부파일 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>) }
]

export default function SiteManagement() {
const navigate = useNavigate()
const location = useLocation()
const currentTabIdx = Math.max(TAB_PATHS.indexOf(location.pathname), 0)

const [startDate, setStartDate] = useState("2025-06-16")
const [endDate, setEndDate] = useState("2025-12-16")
const [searchText, setSearchText] = useState("")
const [data, setData] = useState<DataRow[]>(initialData)
const [checkedIds, setCheckedIds] = useState<(number|string)[]>([])
const [modalOpen, setModalOpen] = useState(false)

const handleSearch = () => {}
const handleTabClick = (idx: number) => { navigate(TAB_PATHS[idx]); setCheckedIds([]) }
const handlePrint = () => window.print()
const handleDelete = () => {
if (checkedIds.length === 0) { alert("삭제할 항목을 선택하세요"); return }
if (window.confirm("정말 삭제하시겠습니까?")) {
setData(prev => prev.filter(row => !checkedIds.includes(row.id)))
setCheckedIds([])
}
}
const downloadDocx = () => alert("점검지 양식 다운로드")

const handleSave = (newItem: any) => {
const newId = (Math.max(...data.map(d => Number(d.id))) + 1).toString()
const resultText = newItem.inspectionResult || ""
let resultTag = <Badge>{resultText}</Badge>
if (resultText === "이상없음") resultTag = <Badge color="sky">이상없음</Badge>
else if (resultText === "주의") resultTag = <Badge color="red">주의</Badge>
else if (resultText === "위험") resultTag = <Badge color="red">위험</Badge>
setData([{ id: newId, ...newItem, inspectionResult: resultTag }, ...data])
setModalOpen(false)
}

return (
<section className="w-full bg-white">
<PageTitle>{TAB_LABELS[currentTabIdx]}</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={currentTabIdx} onTabClick={handleTabClick} className="mb-6" />
<div className="mb-3">
<FilterBar startDate={startDate} endDate={endDate} onStartDate={setStartDate} onEndDate={setEndDate} searchText={searchText} onSearchText={setSearchText} onSearch={handleSearch} />
</div>
<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {data.length}건</span>
<div className="flex flex-nowrap gap-1 w-full justify-end self-end sm:w-auto sm:self-auto">
<Button variant="action" onClick={() => setModalOpen(true)} className="flex items-center gap-1">
<CirclePlus size={16} />신규등록
</Button>
<Button
variant="action"
onClick={downloadDocx}
className="flex items-center gap-1"
>
<Download size={16} />점검지 양식
</Button>
<Button variant="action" onClick={handlePrint} className="flex items-center gap-1">
<Save size={16} />다운로드
</Button>
<Button variant="action" onClick={handlePrint} className="flex items-center gap-1">
<Printer size={16} />인쇄
</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1">
<Trash2 size={16} />삭제
</Button>
</div>
</div>
<div className="overflow-x-auto bg-white">
<DataTable columns={columns} data={data} onCheckedChange={setCheckedIds} />
</div>
{modalOpen && (<SiteAuditRegister isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />)}
</section>
)
}