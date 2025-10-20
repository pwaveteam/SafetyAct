import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import CommitteeRegister from "./CommitteeRegister"
import { DownloadIcon, Download, CirclePlus, Printer, Trash2, ShieldAlert, Save, Image, Upload } from "lucide-react"
import SitePhotoViewer from "@/components/modules/SitePhotoViewer"

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
{ key: "completionDate", label: "회의일시", minWidth: 110 },
{ key: "meetingPlace", label: "회의장소", minWidth: 110 },
{ key: "sitePhotos", label: "현장사진", minWidth: 80, renderCell: (row: DataRow) => (row.sitePhotos && row.sitePhotos.length > 0 ? (<button type="button" className="flex items-center justify-center w-full text-gray-700 hover:text-gray-900" onClick={() => row.onOpenPhotos?.(row.sitePhotos ?? [])} aria-label="현장사진 보기"><Image size={19} strokeWidth={2} /></button>) : (<span className="flex items-center justify-center text-gray-400">-</span>)) },
{ key: "proof", label: "회의록", minWidth: 40, renderCell: row => (<span className="flex justify-center items-center"><DownloadIcon size={19} aria-label="첨부파일 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>) },
{ key: "manage", label: "관리", minWidth: 110, renderCell: row => (<button style={{ background: "none", border: "none", padding: 0, color: "#999999", cursor: "pointer", width: 110, textAlign: "center" }} onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>자세히보기/편집</button>) }
]

const initialData: DataRow[] = [
{ id: 3, completionDate: "2025-06-10 13:00 ~ 15:00", meetingPlace: "본사 대회의실", sitePhotos: ["/images/photo11.jpg"], proof: (<span className="flex justify-center items-center"><DownloadIcon size={19} aria-label="첨부파일 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>), note: "기초 이론 교육 포함" }
]

const downloadDocx = () => alert("회의록 양식 다운로드")

export default function ContractDocument() {
const navigate = useNavigate()
const location = useLocation()
const currentTabIdx = Math.max(TAB_PATHS.indexOf(location.pathname), 0)

const [startDate, setStartDate] = useState("2025-06-16")
const [endDate, setEndDate] = useState("2025-12-16")
const [searchText, setSearchText] = useState("")
const [photoPreview, setPhotoPreview] = useState<{open:boolean; images:string[]; index:number}>({ open:false, images:[], index:0 })
const enrich = (r: DataRow): DataRow => ({ ...r, onOpenPhotos: (images: string[]) => setPhotoPreview({ open:true, images, index:0 }) })
const [data, setData] = useState<DataRow[]>(initialData.map(enrich))
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
setData([{ id: newId, ...newItem, onOpenPhotos: (images: string[]) => setPhotoPreview({ open:true, images, index:0 }) }, ...data])
setModalOpen(false)
}

const hasOrganization = false
const closePreview = () => setPhotoPreview(p => ({ ...p, open:false }))
const prevImg = () => setPhotoPreview(p => ({ ...p, index: p.index > 0 ? p.index - 1 : p.index }))
const nextImg = () => setPhotoPreview(p => ({ ...p, index: p.index < p.images.length - 1 ? p.index + 1 : p.index }))

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
<Download size={16} />회의록 양식
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
<PageTitle className="mt-8 mb-3">도급협의체 조직도</PageTitle>
{!hasOrganization ? (
<div className="flex flex-col items-center text-center text-gray-600 mt-16 mb-16">
<div className="mb-4 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center">
<ShieldAlert size={24} className="sm:w-8 sm:h-8 w-6 h-6 text-gray-500" />
</div>
<h2 className="text-sm sm:text-lg font-semibold mb-1">도급협의체 조직도가 없습니다.</h2>
<p className="text-xs sm:text-base text-gray-300 mb-6">조직도 파일을 업로드한 후 조직관리를 시작해보세요.</p>
<Button variant="circle" className="flex items-center justify-center gap-1 px-6">
<Upload size={16} className="text-gray-500" />
조직도 이미지 업로드
</Button>
</div>
) : (
<div className="flex justify-center mb-6">{/* 조직도 이미지 자리 */}</div>
)}
{modalOpen && (<CommitteeRegister isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />)}
<SitePhotoViewer open={photoPreview.open} images={photoPreview.images} index={photoPreview.index} onClose={closePreview} onPrev={prevImg} onNext={nextImg} />
</section>
)
}
