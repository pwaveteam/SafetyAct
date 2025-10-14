import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import PartnerRegister from "./PartnersRegister"
import { DownloadIcon, CirclePlus, Printer, Trash2, Save } from "lucide-react"

const TAB_LABELS = ["수급업체 관리", "안전보건수준 평가", "도급안전보건 협의체", "안전보건 점검", "안전보건 교육/훈련"]
const TAB_PATHS = [
"/supply-chain-management/partners",
"/supply-chain-management/evaluation",
"/supply-chain-management/committee",
"/supply-chain-management/siteaudit",
"/supply-chain-management/training"
]

const columns: Column[] = [
{ key: "id", label: "번호", minWidth: 50 },
{ key: "company", label: "업체명", minWidth: 200 },
{ key: "contractPeriod", label: "계약기간", minWidth: 180 },
{ key: "manager", label: "현장관리자", minWidth: 120 },
{ key: "contact", label: "연락처", minWidth: 140 },
{ key: "planFile", label: "안전보건계획서", minWidth: 132 },
{ key: "etcFile", label: "계약서류", minWidth: 110 },
{ key: "manage", label: "관리", minWidth: 110, renderCell: row => (<button style={{ background: "none", border: "none", padding: 0, color: "#999999", cursor: "pointer", width: 110, textAlign: "center" }} onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>자세히보기/편집</button>) }
]

const initialData: DataRow[] = [
{ id: 3, company: "B건설안전", contractPeriod: "2025-01-10 ~ 2025-12-31", manager: <>김영희</>, contact: "010-1234-5678", planFile: (<span className="flex justify-center items-center"><DownloadIcon size={19} aria-label="안전보건계획서 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>), etcFile: (<span className="flex justify-center items-center"><DownloadIcon size={19} aria-label="기타서류 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>) },
{ id: 2, company: "E하역", contractPeriod: "2025-02-01 ~ 2025-08-31", manager: <>이안전</>, contact: "010-2345-6789", planFile: (<span className="flex justify-center items-center"><DownloadIcon size={19} aria-label="안전보건계획서 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>), etcFile: (<span className="flex justify-center items-center"><DownloadIcon size={19} aria-label="기타서류 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>) },
{ id: 1, company: "G하역", contractPeriod: "2025-03-15 ~ 2025-09-14", manager: <>박민수</>, contact: "010-3333-1230", planFile: (<span className="flex justify-center items-center"><DownloadIcon size={19} aria-label="안전보건계획서 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>), etcFile: (<span className="flex justify-center items-center"><DownloadIcon size={19} aria-label="기타서류 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>) }
]

export default function Partners() {
const navigate = useNavigate()
const location = useLocation()
const currentTabIdx = Math.max(TAB_PATHS.indexOf(location.pathname), 0)

const [startDate, setStartDate] = React.useState("2025-06-16")
const [endDate, setEndDate] = React.useState("2025-12-16")
const [searchText, setSearchText] = React.useState("")
const [data, setData] = React.useState<DataRow[]>(initialData)
const [checkedIds, setCheckedIds] = React.useState<(number|string)[]>([])
const [modalOpen, setModalOpen] = React.useState(false)

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
const handleSave = (newItem: any) => {
const newId = (Math.max(...data.map(d => Number(d.id))) + 1).toString()
setData([{ id: newId, ...newItem }, ...data])
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
{modalOpen && (<PartnerRegister isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />)}
</section>
)
}