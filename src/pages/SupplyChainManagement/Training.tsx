import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import Badge from "@/components/common/base/Badge"
import TrainingRegister from "./TrainingRegister"
import { CirclePlus, Trash2, Printer, Save } from "lucide-react"

const TAB_LABELS = ["수급업체 관리", "안전보건수준 평가", "도급안전보건 협의체", "안전보건 점검", "안전보건 교육/훈련"]
const TAB_PATHS = [
"/supply-chain-management/partners",
"/supply-chain-management/evaluation",
"/supply-chain-management/committee",
"/supply-chain-management/siteaudit",
"/supply-chain-management/training"
]

type AgreementStatus = "completed" | "pending"

interface PartnerStatus extends DataRow {
id: number
name: string
riskAssessment: AgreementStatus
hazardousMaterial: AgreementStatus
responseManual: AgreementStatus
allSigned: AgreementStatus
updatedAt: string | null
}

function renderStatusBadge(key: keyof PartnerStatus, status: AgreementStatus) {
if (status === "pending") return <Badge color="red">미완료</Badge>
switch (key) {
case "riskAssessment":
case "hazardousMaterial":
case "responseManual":
case "allSigned":
return <Badge color="gray">완료</Badge>
default:
return null
}
}

const initialPartnerStatusData: PartnerStatus[] = [
{ id: 1, name: "협의체 A", riskAssessment: "completed", hazardousMaterial: "completed", responseManual: "completed", allSigned: "completed", updatedAt: "2025-07-22" },
{ id: 2, name: "협의체 B", riskAssessment: "completed", hazardousMaterial: "pending", responseManual: "completed", allSigned: "pending", updatedAt: "2025-07-20" },
{ id: 3, name: "협의체 C", riskAssessment: "pending", hazardousMaterial: "pending", responseManual: "pending", allSigned: "pending", updatedAt: null }
]

const columns: Column[] = [
{ key: "id", label: "번호", minWidth: 48 },
{ key: "name", label: "도급협의체명", minWidth: 140 },
{ key: "riskAssessment", label: "위험성평가 확인", minWidth: 130, renderCell: row => renderStatusBadge("riskAssessment", (row as PartnerStatus).riskAssessment) },
{ key: "hazardousMaterial", label: "유해물질 확인", minWidth: 140, renderCell: row => renderStatusBadge("hazardousMaterial", (row as PartnerStatus).hazardousMaterial) },
{ key: "responseManual", label: "대응매뉴얼 확인", minWidth: 140, renderCell: row => renderStatusBadge("responseManual", (row as PartnerStatus).responseManual) },
{ key: "updatedAt", label: "최종 업데이트 일자", minWidth: 140, renderCell: row => (row as PartnerStatus).updatedAt ?? "-" },
{ key: "manage", label: "관리", minWidth: 110, renderCell: row => (<button type="button" className="text-[#999999] cursor-pointer w-[110px] text-center bg-none border-none p-0" onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")} onClick={() => alert(`협의체명: ${(row as PartnerStatus).name} 상세/편집 열기`)}>자세히보기/편집</button>) }
]

export default function PartnerTraining() {
const navigate = useNavigate()
const location = useLocation()
const currentTabIdx = Math.max(TAB_PATHS.indexOf(location.pathname), 0)

const [startDate, setStartDate] = useState("2025-06-16")
const [endDate, setEndDate] = useState("2025-12-16")
const [searchText, setSearchText] = useState("")
const [partnerStatusData, setPartnerStatusData] = useState<PartnerStatus[]>(initialPartnerStatusData)
const [checkedIds, setCheckedIds] = useState<(number|string)[]>([])
const [modalOpen, setModalOpen] = useState(false)

const handleSearch = () => {}
const handleTabClick = (idx: number) => { navigate(TAB_PATHS[idx]); setCheckedIds([]) }
const handleDelete = () => {
if (checkedIds.length === 0) { alert("삭제할 항목을 선택하세요"); return }
if (!window.confirm("정말 삭제하시겠습니까?")) return
setPartnerStatusData(prev => prev.filter(row => !checkedIds.includes(row.id)))
setCheckedIds([])
}
const handlePrint = () => window.print()
const handleOpenModal = () => setModalOpen(true)
const handleCloseModal = () => setModalOpen(false)

const handleSave = (newItem: { name: string; riskAssessment: boolean; hazardousMaterial: boolean; responseManual: boolean; allSigned: boolean }) => {
setPartnerStatusData(prev => [{
id: prev.length + 1,
name: newItem.name,
riskAssessment: newItem.riskAssessment ? "completed" : "pending",
hazardousMaterial: newItem.hazardousMaterial ? "completed" : "pending",
responseManual: newItem.responseManual ? "completed" : "pending",
allSigned: newItem.allSigned ? "completed" : "pending",
updatedAt: new Date().toISOString().slice(0, 10)
}, ...prev])
}

return (
<section className="w-full bg-white">
<PageTitle>{TAB_LABELS[currentTabIdx]}</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={currentTabIdx} onTabClick={handleTabClick} className="mb-6" />
<div className="mb-3">
<FilterBar startDate={startDate} endDate={endDate} onStartDate={setStartDate} onEndDate={setEndDate} searchText={searchText} onSearchText={setSearchText} onSearch={handleSearch} />
</div>
<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {partnerStatusData.length}건</span>
<div className="flex flex-nowrap gap-1 w-full justify-end self-end sm:w-auto sm:self-auto">
<Button variant="action" onClick={handleOpenModal} className="flex items-center gap-1">
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
<DataTable columns={columns} data={partnerStatusData} onCheckedChange={setCheckedIds} />
</div>
{modalOpen && (<TrainingRegister isOpen={modalOpen} onClose={handleCloseModal} onSave={handleSave} />)}
</section>
)
}