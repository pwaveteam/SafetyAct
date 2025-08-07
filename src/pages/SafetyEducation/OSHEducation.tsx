import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/common/base/Button"
import QRCode from "qrcode"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import RegularEducationRegister from "@/pages/SafetyEducation/OSHEducationRegister"
import { CirclePlus, QrCode, Printer, Trash2, Download, Save } from "lucide-react"
import jsPDF from "jspdf"

const columns: Column[] = [
{ key: "id", label: "번호", minWidth: 50 },
{ key: "course", label: "교육과정", minWidth: 120 },
{ key: "targetGroup", label: "교육대상", minWidth: 120 },
{ key: "eduName", label: "교육명", minWidth: 160 },
{ key: "date", label: "교육일자", minWidth: 120 },
{ key: "place", label: "장소", minWidth: 120 },
{ key: "trainer", label: "강사", minWidth: 96 },
{ key: "eduMaterial", label: "교육자료", minWidth: 80, renderCell: () => <span className="flex justify-center items-center cursor-pointer" role="button" tabIndex={0} aria-label="교육자료 다운로드"><Download size={19} strokeWidth={2} /></span> },
{ key: "proof", label: "첨부파일", minWidth: 80, renderCell: () => <span className="flex justify-center items-center cursor-pointer" role="button" tabIndex={0} aria-label="첨부파일 다운로드"><Download size={19} strokeWidth={2} /></span> },
{ key: "manage", label: "관리", minWidth: 110, renderCell: () => <button style={{ background: "none", border: "none", padding: 0, color: "#999999", cursor: "pointer", width: 110, textAlign: "center" }} onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>자세히보기/편집</button> }
]

const initialData: DataRow[] = [
{ id: 1, course: "정기교육", targetGroup: "사무직 종사 근로자", eduName: "정기 안전보건교육", date: "2025-06-03", place: "본사 강의실", trainer: "홍길동" },
{ id: 2, course: "채용 시 교육", targetGroup: "일용근로자·계약 1주 이하 기간제근로자", eduName: "신규 채용 안전교육", date: "2025-06-14", place: "현장 안전교육장", trainer: "이은영" },
{ id: 3, course: "작업내용 변경 시 교육", targetGroup: "일용근로자·계약 1주 이하 기간제근로자", eduName: "작업 전 변경교육", date: "2025-07-01", place: "제1작업장", trainer: "김도윤" }
]

const TAB_LABELS = ["안전보건교육"]
const TAB_PATHS = ["/safety-education"]

export default function RegularEducation() {
const navigate = useNavigate()
const location = useLocation()
const [data, setData] = useState<DataRow[]>(initialData)
const [checked, setChecked] = useState<(number | string)[]>([])
const [startDate, setStartDate] = useState("2025-06-16")
const [endDate, setEndDate] = useState("2025-12-16")
const [educationTarget, setEducationTarget] = useState("")
const [educationMethod, setEducationMethod] = useState("")
const [isModalOpen, setIsModalOpen] = useState(false)
const currentTabIdx = TAB_PATHS.indexOf(location.pathname)

const handleTabClick = (idx: number) => {
if (location.pathname !== TAB_PATHS[idx]) navigate(TAB_PATHS[idx])
}

const handleSave = (newItem: Partial<DataRow>) => {
setData(prev => [{ id: prev.length + 1, ...newItem }, ...prev])
setIsModalOpen(false)
}

const handleGenerateQR = async () => {
if (checked.length === 0) return alert("QR 생성할 항목을 선택하세요")
for (const id of checked) {
const row = data.find(d => d.id === id)
if (!row) continue
const qrText = `교육명: ${row.eduName}\n교육일자: ${row.date}\n교육대상 구분: ${row.course}\n대상: ${row.targetGroup}\n장소: ${row.place}\n강사: ${row.trainer}`
try {
const dataUrl = await QRCode.toDataURL(qrText, { width: 300 })
const link = document.createElement("a")
link.href = dataUrl
link.download = `QR_${id}.png`
document.body.appendChild(link)
link.click()
document.body.removeChild(link)
} catch {
alert("QR 생성 실패")
}
}
}

const handlePrint = () => window.print()

const handleDelete = () => {
if (checked.length === 0) return alert("삭제할 항목을 선택하세요")
if (window.confirm("정말 삭제하시겠습니까?")) {
setData(prev => prev.filter(row => !checked.includes(row.id)))
setChecked([])
}
}

const handleDownload = () => {
if (checked.length === 0) return alert("다운로드할 항목을 선택하세요")
const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "")
const doc = new jsPDF()
doc.save(`안전보건교육_${dateStr}.pdf`)
}

return (
<section className="education-content w-full bg-white">
<PageTitle>안전보건교육</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={currentTabIdx} onTabClick={handleTabClick} className="mb-6" />
<div className="mb-3">
<FilterBar
startDate={startDate}
endDate={endDate}
onStartDate={setStartDate}
onEndDate={setEndDate}
educationTarget={educationTarget}
onEducationTargetChange={setEducationTarget}
educationMethod={educationMethod}
onEducationMethodChange={setEducationMethod}
onSearch={() => {}}
/>
</div>
<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {data.length}건</span>
<div className="flex flex-nowrap gap-1 w-full justify-end self-end sm:w-auto sm:self-auto">
<Button variant="action" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1">
<CirclePlus size={16} />신규등록
</Button>
<Button variant="action" onClick={handleGenerateQR} className="flex items-center gap-1">
<QrCode size={16} />QR 생성
</Button>
<Button variant="action" onClick={handleDownload} className="flex items-center gap-1">
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
<DataTable columns={columns} data={data} onCheckedChange={setChecked} className="min-w-[600px] md:min-w-auto" />
</div>
{isModalOpen && (
<RegularEducationRegister isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
)}
</section>
)
}