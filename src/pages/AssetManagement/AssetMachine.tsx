import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/common/base/Button"
import QRCode from "qrcode"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import AssetMachineRegister from "./AssetMachineRegister"
import jsPDF from "jspdf"
import { CirclePlus, QrCode, Printer, Trash2, Download, Save } from "lucide-react"

const TAB_LABELS = ["위험기계/기구/설비", "유해/위험물질"]
const TAB_PATHS = ["/asset-management/machine", "/asset-management/hazard"]

const machineColumns: Column[] = [
{ key: "id", label: "번호", minWidth: 48 },
{ key: "name", label: "기계/기구/설비명", minWidth: 200 },
{ key: "capacity", label: "용량/단위", minWidth: 90 },
{ key: "quantity", label: "수량", minWidth: 60 },
{ key: "location", label: "설치/작업장소", minWidth: 150 },
{ key: "inspectionDate", label: "점검일", minWidth: 110 },
{ key: "purpose", label: "용도", minWidth: 120 },
{ key: "inspectionCycle", label: "점검주기", minWidth: 90 },
{
key: "attachments",
label: "첨부파일",
minWidth: 80,
renderCell: (): React.ReactElement => (
<span className="flex justify-center items-center cursor-pointer" role="button" tabIndex={0} aria-label="첨부파일 다운로드">
<Download size={19} strokeWidth={2} />
</span>
)
},
{
key: "manage",
label: "관리",
minWidth: 110,
renderCell: (): React.ReactElement => (
<button
style={{ background: "none", border: "none", padding: 0, color: "#999999", cursor: "pointer", width: 110, textAlign: "center" }}
onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
>
자세히보기/편집
</button>
)
}
]

const initialMachineData: DataRow[] = [
{ id: 3, name: "프레스(P-1-0001)", capacity: "5ton", quantity: 2, location: "A공장", inspectionCycle: "3개월", inspectionDate: "2025/06/01", purpose: "금속 판재 가공용" },
{ id: 2, name: "CNC밀링(M-3-2000)", capacity: "2ton", quantity: 2, location: "B공장", inspectionCycle: "1년", inspectionDate: "2025/03/30", purpose: "정밀 부품 가공" },
{ id: 1, name: "컨베이어(C-2-1000)", capacity: "150m/min", quantity: 1, location: "C공장", inspectionCycle: "6개월", inspectionDate: "2025/05/20", purpose: "제품 운반" }
]

const hazardColumns: Column[] = [
{ key: "id", label: "번호", minWidth: 52 },
{ key: "chemicalName", label: "화학물질명", minWidth: 160 },
{ key: "casNo", label: "CAS No", minWidth: 110 },
{ key: "exposureLimit", label: "노출기준", minWidth: 90 },
{ key: "dailyUsage", label: "일일사용량", minWidth: 90 },
{ key: "storageAmount", label: "저장량", minWidth: 90 },
{
key: "msds",
label: "MSDS",
minWidth: 60,
renderCell: (): React.ReactElement => (
<span title="MSDS 다운로드" aria-label="MSDS 다운로드" className="flex justify-center items-center cursor-pointer" role="button" tabIndex={0}>
<Download size={19} strokeWidth={2} />
</span>
)
},
{
key: "attachments",
label: "첨부파일",
minWidth: 80,
renderCell: (): React.ReactElement => (
<span className="flex justify-center items-center cursor-pointer" role="button" tabIndex={0} aria-label="첨부파일 다운로드">
<Download size={19} strokeWidth={2} />
</span>
)
},
{ key: "registrationDate", label: "등록일", minWidth: 110 },
{
key: "actions",
label: "관리",
minWidth: 130,
renderCell: (): React.ReactElement => (
<button
style={{ background: "none", border: "none", padding: 0, color: "#999999", cursor: "pointer" }}
onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
>
자세히보기/편집
</button>
)
}
]

const initialHazardData: DataRow[] = [
{ id: 3, chemicalName: "메틸알코올", casNo: "67-56-1", exposureLimit: "200 ppm", dailyUsage: "25 L", storageAmount: "1 m³", registrationDate: "2025/06/01" },
{ id: 2, chemicalName: "벤젠", casNo: "71-43-2", exposureLimit: "1 ppm", dailyUsage: "1.2 L", storageAmount: "0.7 t", registrationDate: "2025/03/30" },
{ id: 1, chemicalName: "톨루엔", casNo: "108-88-3", exposureLimit: "50 ppm", dailyUsage: "10 kg", storageAmount: "700 L", registrationDate: "2025/05/20" }
]

export default function AssetManagement() {
const navigate = useNavigate()
const location = useLocation()
const [machineData, setMachineData] = useState<DataRow[]>(initialMachineData)
const [hazardData, setHazardData] = useState<DataRow[]>(initialHazardData)
const [checkedIds, setCheckedIds] = useState<(number | string)[]>([])
const [isModalOpen, setIsModalOpen] = useState(false)
const [startDate, setStartDate] = useState("2025-06-16")
const [endDate, setEndDate] = useState("2025-12-16")
const [searchText, setSearchText] = useState("")

const currentTabIdx = TAB_PATHS.indexOf(location.pathname)
const handleTabClick = (idx: number) => {
if (location.pathname !== TAB_PATHS[idx]) {
navigate(TAB_PATHS[idx])
setCheckedIds([])
}
}

const columns = currentTabIdx === 0 ? machineColumns : hazardColumns
const data = currentTabIdx === 0 ? machineData : hazardData

const handleSave = (newItem: Partial<DataRow>) => {
if (currentTabIdx === 0) setMachineData(prev => [{ id: prev.length + 1, ...newItem }, ...prev])
setIsModalOpen(false)
}

const handleGenerateQR = async () => {
if (checkedIds.length === 0) return alert("QR 생성할 항목을 선택하세요")
for (const id of checkedIds) {
const row = data.find(d => d.id === id)
if (!row) continue
let qrText = ""
if (currentTabIdx === 0) qrText = `기계/기구/설비명: ${row.name}\n용량/단위: ${row.capacity}\n수량: ${row.quantity}\n설치/작업장소: ${row.location}\n점검주기: ${row.inspectionCycle}\n점검일: ${row.inspectionDate}\n용도: ${row.purpose}`
else qrText = `화학물질명: ${row.chemicalName}\nCAS No: ${row.casNo}\n노출기준: ${row.exposureLimit}\n일일사용량: ${row.dailyUsage}\n저장량: ${row.storageAmount}\n등록일: ${row.registrationDate}`
try {
const dataUrl = await QRCode.toDataURL(qrText, { width: 300 })
const link = document.createElement("a")
link.href = dataUrl
link.download = `QR_${id}.png`
document.body.appendChild(link)
link.click()
document.body.removeChild(link)
} catch { alert("QR 생성 실패") }
}
}

const handlePrint = () => window.print()

const handleDelete = () => {
if (checkedIds.length === 0) return alert("삭제할 항목을 선택하세요")
if (window.confirm("정말 삭제하시겠습니까?")) {
if (currentTabIdx === 0) setMachineData(prev => prev.filter(row => !checkedIds.includes(row.id)))
else setHazardData(prev => prev.filter(row => !checkedIds.includes(row.id)))
setCheckedIds([])
}
}

const handleSafetyApplication = () => alert("안전검사 신청서 버튼 클릭됨")

return (
<section className="asset-management-content w-full bg-white">
<PageTitle>{TAB_LABELS[currentTabIdx]}</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={currentTabIdx} onTabClick={handleTabClick} className="mb-6" />
<div className="mb-3">
<FilterBar startDate={startDate} endDate={endDate} onStartDate={setStartDate} onEndDate={setEndDate} searchText={searchText} onSearchText={setSearchText} onSearch={() => {}} />
</div>
<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {data.length}건</span>

<div className="flex flex-col gap-1 w-full justify-end sm:hidden">
<div className="flex gap-1 justify-end">
{currentTabIdx === 0 && (
<>
<Button variant="action" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1"><CirclePlus size={16} />신규등록</Button>
<Button variant="action" onClick={handleSafetyApplication} className="flex items-center gap-1"><Download size={16} />안전검사신청서 양식</Button>
<Button variant="action" onClick={handleGenerateQR} className="flex items-center gap-1"><QrCode size={16} />QR 생성</Button>
</>
)}
</div>
<div className="flex gap-1 justify-end">
<Button variant="action" onClick={handlePrint} className="flex items-center gap-1"><Save size={16} />다운로드</Button>
<Button variant="action" onClick={handlePrint} className="flex items-center gap-1"><Printer size={16} />인쇄</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1"><Trash2 size={16} />삭제</Button>
</div>
</div>

<div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
{currentTabIdx === 0 && (
<>
<Button variant="action" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1"><CirclePlus size={16} />신규등록</Button>
<Button variant="action" onClick={handleSafetyApplication} className="flex items-center gap-1"><Download size={16} />안전검사신청서 양식</Button>
<Button variant="action" onClick={handleGenerateQR} className="flex items-center gap-1"><QrCode size={16} />QR 생성</Button>
</>
)}
<Button variant="action" onClick={handlePrint} className="flex items-center gap-1"><Save size={16} />다운로드</Button>
<Button variant="action" onClick={handlePrint} className="flex items-center gap-1"><Printer size={16} />인쇄</Button>
<Button variant="action" onClick={handleDelete} className="flex items-center gap-1"><Trash2 size={16} />삭제</Button>
</div>
</div>

<div className="overflow-x-auto bg-white">
<DataTable columns={columns} data={data} onCheckedChange={setCheckedIds} />
</div>
{isModalOpen && currentTabIdx === 0 && (
<AssetMachineRegister isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />
)}
</section>
)
}