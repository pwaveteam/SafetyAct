import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/common/base/Button"
import QRCode from "qrcode"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import AssetHazardRegister from "./AssetHazardRegister"
import { DownloadIcon, CirclePlus, QrCode, Printer, Trash2 } from "lucide-react"

const style = `@media (max-width: 1024px) { .responsive-font { font-size: 0.95rem !important; } } @media (max-width: 640px) { .responsive-font { font-size: 0.87rem !important; } }`

const columns: Column[] = [
{ key: "id", label: "번호", minWidth: "52px" },
{ key: "chemicalName", label: "화학물질명", minWidth: "160px" },
{ key: "casNo", label: "CAS No", minWidth: "110px" },
{ key: "exposureLimit", label: "노출기준", minWidth: "90px" },
{ key: "dailyUsage", label: "일일사용량", minWidth: "90px" },
{ key: "storageAmount", label: "저장량", minWidth: "90px" },
{ key: "registrationDate", label: "등록일", minWidth: "110px" },
{ key: "msds", label: "MSDS", minWidth: "60px" },
{
key: "manage", label: "관리", minWidth: 110,
renderCell: row => (
<button style={{ background: "none", border: "none", padding: 0, color: "#999999", cursor: "pointer", width: 110, textAlign: "center" }} onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>자세히보기/편집</button>
)
}
]

const initialData: DataRow[] = [
{ id: 3, chemicalName: "메틸알코올", casNo: "67-56-1", exposureLimit: "200 ppm", dailyUsage: "25 L", storageAmount: "1 m³", registrationDate: "2025/06/01", msds: <span className="flex justify-center items-center"><DownloadIcon size={19} aria-label="MSDS 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>, actions: <span className="flex justify-center items-center"><button>자세히보기/편집</button></span> },
{ id: 2, chemicalName: "벤젠", casNo: "71-43-2", exposureLimit: "1 ppm", dailyUsage: "1.2 L", storageAmount: "0.7 t", registrationDate: "2025/03/30", msds: <span className="flex justify-center items-center"><DownloadIcon size={19} aria-label="MSDS 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>, actions: <span className="flex justify-center items-center"><button>자세히보기/편집</button></span> },
{ id: 1, chemicalName: "톨루엔", casNo: "108-88-3", exposureLimit: "50 ppm", dailyUsage: "10 kg", storageAmount: "700 L", registrationDate: "2025/05/20", msds: <span className="flex justify-center items-center"><DownloadIcon size={19} aria-label="MSDS 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>, actions: <span className="flex justify-center items-center"><button>자세히보기/편집</button></span> }
]

const TAB_LABELS = ["위험기계/기구/설비", "유해/위험물질"]
const TAB_PATHS = ["/asset-management/machine", "/asset-management/hazard"]

export default function AssetHazard() {
const [startDate, setStartDate] = useState("2025-06-16")
const [endDate, setEndDate] = useState("2025-12-16")
const [searchText, setSearchText] = useState("")
const [data, setData] = useState<DataRow[]>(initialData)
const [checkedIds, setCheckedIds] = useState<(number|string)[]>([])
const [isModalOpen, setIsModalOpen] = useState(false)

const navigate = useNavigate()
const location = useLocation()
const currentTabIdx = TAB_PATHS.indexOf(location.pathname)

const handleTabClick = (idx: number) => {
if (location.pathname !== TAB_PATHS[idx]) {
navigate(TAB_PATHS[idx])
setCheckedIds([])
}
}

const handleSave = (formData: any) => {
setData(prev => [{ id: prev.length + 1, ...formData, msds: prev[0]?.msds, actions: prev[0]?.actions }, ...prev])
setIsModalOpen(false)
}

const handleGenerateQR = async () => {
if (checkedIds.length === 0) { alert("QR 생성할 항목을 선택하세요"); return }
for (const id of checkedIds) {
const row = data.find(d => d.id === id)
if (!row) continue
const qrText = `화학물질명: ${row.chemicalName}\nCAS No: ${row.casNo}\n노출기준: ${row.exposureLimit}\n일일사용량: ${row.dailyUsage}\n저장량: ${row.storageAmount}\n등록일: ${row.registrationDate}`
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
if (checkedIds.length === 0) { alert("삭제할 항목을 선택하세요"); return }
if (window.confirm("정말 삭제하시겠습니까?")) {
setData(prev => prev.filter(row => !checkedIds.includes(row.id)))
setCheckedIds([])
}
}

return (
<section className="asset-management-content w-full bg-white">
<style>{style}</style>
<PageTitle>유해/위험물질</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={currentTabIdx} onTabClick={handleTabClick} className="mb-6" />
<div className="mb-3">
<FilterBar startDate={startDate} endDate={endDate} onStartDate={setStartDate} onEndDate={setEndDate} searchText={searchText} onSearchText={setSearchText} onSearch={() => {}} />
</div>
<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {data.length}건</span>
<div className="flex flex-nowrap gap-1 w-full justify-end self-end sm:w-auto sm:self-auto">
{currentTabIdx === 1 && (
<Button variant="action" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1">
<CirclePlus size={16} />신규등록
</Button>
)}
<Button variant="action" onClick={handleGenerateQR} className="flex items-center gap-1">
<QrCode size={16} />QR 생성
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
{isModalOpen && <AssetHazardRegister isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
</section>
)
}