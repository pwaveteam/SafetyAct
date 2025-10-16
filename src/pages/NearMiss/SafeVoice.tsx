import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import SafeVoiceRegisterModal from "@/pages/NearMiss/SafeVoiceRegister"
import Badge from "@/components/common/base/Badge"
import { CirclePlus, Printer, Trash2, Save, Image } from "lucide-react"
import SitePhotoViewer from "@/components/modules/SitePhotoViewer"
import jsPDF from "jspdf"

const TAB_LABELS = ["아차사고", "안전보이스"]
const TAB_PATHS = ["/nearmiss", "/nearmiss/safevoice"]

const initialData: DataRow[] = [
{ id: 3, content: "기계실 바닥이 미끄러워 미끄럼 방지 매트 설치가 필요", registrant: "김근로", date: "2025-06-01", status: "미조치", reason: "매트 재고 확보 필요", sitePhotos: ["/images/photo1.jpg", "/images/photo2.jpg"] },
{ id: 2, content: "출입구에 비상 연락처 QR 코드 부착 요청", registrant: "익명", date: "2025-06-01", status: "미조치", reason: "관리자 승인 대기 중", sitePhotos: ["/images/photo3.jpg"] },
{ id: 1, content: "고소 작업 난간 간격 개선 요청", registrant: "익명", date: "2025-06-01", status: "미조치", reason: "현장 조사 후 결정 예정", sitePhotos: [] }
]

function StatusToggle({ row, onChange }: { row: DataRow; onChange: (id: string | number, status: string, reason: string) => void }) {
const handleClick = (value: string) => {
if (row.status === value) return
if (value === "조치") {
const confirmText = "'조치'로 변경 시 미조치 사유는 삭제되고 '조치 완료'로 처리됩니다.\n변경하시겠습니까?"
if (!window.confirm(confirmText)) return
onChange(row.id, "조치", "조치 완료")
} else {
onChange(row.id, "미조치", "")
}
}
const isSelected = (value: string) => row.status === value
return (
<div className="inline-flex select-none" role="group" aria-label="조치여부 선택">
<button type="button" onClick={() => handleClick("조치")} className={`mr-1 px-1 py-1 rounded font-semibold cursor-pointer ${isSelected("조치") ? "text-green-600" : "text-gray-300"}`} aria-pressed={isSelected("조치")}><Badge color="green" className={isSelected("조치") ? "" : "opacity-30"}>조치</Badge></button>
<button type="button" onClick={() => handleClick("미조치")} className={`px-1 py-1 rounded font-semibold cursor-pointer ${isSelected("미조치") ? "text-orange-500" : "text-gray-300"}`} aria-pressed={isSelected("미조치")}><Badge color="orange" className={isSelected("미조치") ? "" : "opacity-30"}>미조치</Badge></button>
</div>
)
}

function ActionButtons({ totalCount, onRegister, onPrint, onDelete, onDownload }: { totalCount: number; onRegister: () => void; onPrint: () => void; onDelete: () => void; onDownload: () => void }) {
return (
<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {totalCount}건</span>
<div className="flex flex-nowrap gap-1 w-full justify-end self-end sm:w-auto sm:self-auto">
<Button variant="action" onClick={onRegister} className="flex items-center gap-1"><CirclePlus size={16} />신규등록</Button>
<Button variant="action" onClick={onDownload} className="flex items-center gap-1"><Save size={16} />다운로드</Button>
<Button variant="action" onClick={onPrint} className="flex items-center gap-1"><Printer size={16} />인쇄</Button>
<Button variant="action" onClick={onDelete} className="flex items-center gap-1"><Trash2 size={16} />삭제</Button>
</div>
</div>
)
}

export default function SafeVoice() {
const [checkedIds, setCheckedIds] = React.useState<(string | number)[]>([])
const [isModalOpen, setIsModalOpen] = React.useState(false)
const [startDate, setStartDate] = React.useState("2025-06-16")
const [endDate, setEndDate] = React.useState("2025-12-16")
const [searchText, setSearchText] = React.useState("")
const [data, setData] = React.useState<DataRow[]>(initialData)
const [photoPreview, setPhotoPreview] = React.useState<{ open: boolean; images: string[]; index: number }>({ open: false, images: [], index: 0 })
const closePreview = () => setPhotoPreview(p => ({ ...p, open: false }))
const prevImg = () => setPhotoPreview(p => ({ ...p, index: p.index > 0 ? p.index - 1 : p.index }))
const nextImg = () => setPhotoPreview(p => ({ ...p, index: p.index < p.images.length - 1 ? p.index + 1 : p.index }))
const navigate = useNavigate()
const location = useLocation()
const currentTabIdx = TAB_PATHS.indexOf(location.pathname)
const handleTabClick = (idx: number) => {
const path = TAB_PATHS[idx]
if (location.pathname !== path) navigate(path)
}
const handleStatusChange = (id: string | number, status: string, reason: string) => {
setData(prev => prev.map(row => (row.id === id ? { ...row, status, reason } : row)))
}
const handleReasonChange = (id: string | number, value: string) => {
setData(prev => prev.map(row => (row.id === id ? { ...row, reason: value } : row)))
}
const renderCell = (row: DataRow, col: Column) => {
if (col.key === "status") return <StatusToggle row={row} onChange={handleStatusChange} />
if (col.key === "reason") return (
<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
<input type="text" value={row.reason || ""} onChange={(e) => handleReasonChange(row.id, e.target.value)} placeholder="미조치 사유 입력" disabled={row.status === "조치"} style={{ width: "100%", padding: "8px 8px", borderRadius: 8, border: "1px solid #A0B3C9", fontSize: "0.875rem", backgroundColor: row.status === "조치" ? "#f3f3f3" : "white", cursor: row.status === "조치" ? "not-allowed" : "auto" }} />
</div>
)
return row[col.key]
}

const columns: Column[] = React.useMemo(() => [
{ key: "id", label: "번호", minWidth: "50px" },
{ key: "content", label: "내용", minWidth: "240px" },
{ key: "registrant", label: "작성자", minWidth: "60px" },
{ key: "date", label: "등록일", minWidth: "100px" },
{
key: "sitePhotos",
label: "현장사진",
minWidth: 80,
renderCell: (row: DataRow): React.ReactElement => (
row.sitePhotos && row.sitePhotos.length > 0 ? (
<button type="button" className="flex items-center justify-center w-full text-gray-700 hover:text-gray-900" onClick={() => setPhotoPreview({ open: true, images: row.sitePhotos ?? [], index: 0 })} aria-label="현장사진 보기">
<Image size={19} strokeWidth={2} />
</button>
) : (
<span className="flex items-center justify-center text-gray-400">-</span>
)
)
},
{ key: "status", label: "조치여부", minWidth: "60px" },
{ key: "reason", label: "미조치 사유", minWidth: "300px" }
], [])

const handleSave = (newData: Omit<DataRow, "id">) => {
setData(prev => [{ id: prev.length + 1, ...newData }, ...prev])
setIsModalOpen(false)
}
const handleRegister = () => setIsModalOpen(true)
const handlePrint = () => window.print()
const handleDelete = () => {
if (checkedIds.length === 0) { alert("삭제할 항목을 선택하세요"); return }
if (window.confirm("정말 삭제하시겠습니까?")) {
setData(prev => prev.filter(row => !checkedIds.includes(row.id)))
setCheckedIds([])
}
}
const handleDownload = () => {
const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "")
const fileName = `안전보이스_${dateStr}.pdf`
const doc = new jsPDF()
doc.save(fileName)
}

return (
<section className="nearmiss-content w-full bg-white">
<PageTitle>안전보이스</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={currentTabIdx} onTabClick={handleTabClick} className="mb-6" />
<div className="mb-3"><FilterBar startDate={startDate} endDate={endDate} onStartDate={setStartDate} onEndDate={setEndDate} searchText={searchText} onSearchText={setSearchText} onSearch={() => {}} /></div>
<ActionButtons totalCount={data.length} onRegister={handleRegister} onPrint={handlePrint} onDelete={handleDelete} onDownload={handleDownload} />
<div className="overflow-x-auto bg-white"><DataTable columns={columns} data={data} renderCell={renderCell} onCheckedChange={setCheckedIds} /></div>
<div className="flex justify-end mt-5"><Button variant="primary">저장하기</Button></div>
<SitePhotoViewer open={photoPreview.open} images={photoPreview.images} index={photoPreview.index} onClose={closePreview} onPrev={prevImg} onNext={nextImg} />
{isModalOpen && <SafeVoiceRegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
</section>
)
}