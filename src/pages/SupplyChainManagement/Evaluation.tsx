import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import { DownloadIcon, Download, CirclePlus, Printer, Trash2, Save } from "lucide-react"
import EvaluationRegister from "@/pages/SupplyChainManagement/EvaluationRegister"

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
{ key: "company", label: "업체명", minWidth: 140 },
{ key: "evaluationName", label: "평가명", minWidth: 200 },
{ key: "evaluationType", label: "평가종류", minWidth: 120 },
{ key: "evaluationFile", label: "평가지", minWidth: 120, renderCell: () => (<span className="flex justify-center items-center"><DownloadIcon size={19} aria-label="평가지 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>) },
{ key: "contractPeriod", label: "평가기간", minWidth: 180 },
{ key: "evaluator", label: "평가자", minWidth: 120 },
{ key: "externalEvaluator", label: "외부 평가업체", minWidth: 140 },
{ key: "manage", label: "관리", minWidth: 110, renderCell: row => (<button style={{ background: "none", border: "none", padding: 0, color: "#999999", cursor: "pointer", width: 110, textAlign: "center" }} onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>자세히보기/편집</button>) }
]

const initialData: DataRow[] = [
{ id: 3, company: "테스트 주식회사", evaluationName: "테스트 주식회사 안전보건수준 선정평가", evaluationType: "선정평가", evaluationFile: "", contractPeriod: "2025-01-01 ~ 2025-12-31", evaluator: "김민수", externalEvaluator: "국가기술안전원" },
{ id: 2, company: "굴착기회사", evaluationName: "굴착기회사 안전보건수준 재평가", evaluationType: "재평가", evaluationFile: "", contractPeriod: "2024-07-01 ~ 2025-06-30", evaluator: "이현주", externalEvaluator: "한국산업안전협회" },
{ id: 1, company: "ABC 협의체", evaluationName: "ABC 협의체 안전보건수준 신규평가", evaluationType: "신규평가", evaluationFile: "", contractPeriod: "2025-04-01 ~ 2026-03-31", evaluator: "박성호", externalEvaluator: "서울안전기술(주)" }
]

export default function Evaluation() {
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
const handleSave = (newItem: any) => {
const newId = (Math.max(...data.map(d => Number(d.id))) + 1).toString()
setData([{ id: newId, ...newItem }, ...data])
setModalOpen(false)
}
const downloadDocx = () => alert("평가지 양식 다운로드")

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
<Download size={16} />평가지 양식
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
{modalOpen && (<EvaluationRegister isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />)}
</section>
)
}