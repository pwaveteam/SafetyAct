import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import SiteAuditRegister from "@/pages/SupplyChainManagement/SiteAuditRegister"
import { Download, CirclePlus, Printer, Trash2, Save, Image } from "lucide-react"
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
{ key: "id", label: "번호", minWidth: 48 },
{ key: "inspectionDate", label: "점검일", minWidth: 110 },
{ key: "inspectionType", label: "점검종류", minWidth: 120 },
{ key: "inspectionName", label: "점검명(계획명)", minWidth: 200 },
{ key: "inspectionResult", label: "점검결과", minWidth: 140 },
{ key: "note", label: "비고", minWidth: 200 },
{ key: "inspector", label: "점검자", minWidth: 80 },
{ key: "sitePhotos", label: "현장사진", minWidth: 80, renderCell: (row: DataRow) => (row.sitePhotos && row.sitePhotos.length > 0 ? (<button type="button" className="flex items-center justify-center w-full text-gray-700 hover:text-gray-900" onClick={() => row.onOpenPhotos?.(row.sitePhotos ?? [])} aria-label="현장사진 보기"><Image size={19} strokeWidth={2} /></button>) : (<span className="flex items-center justify-center text-gray-400">-</span>)) },
{ key: "fileAttach", label: "점검지", minWidth: 90, renderCell: () => (<button type="button" className="flex items-center justify-center w-full text-gray-700 hover:text-gray-900" aria-label="점검지 다운로드"><Download size={19} strokeWidth={2} /></button>) },
{ key: "manage", label: "관리", minWidth: 110, renderCell: row => (<button style={{ background: "none", border: "none", padding: 0, color: "#999999", cursor: "pointer", width: 110, textAlign: "center" }} onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>자세히보기/편집</button>) }
]

const initialData: DataRow[] = [
{ id: 3, inspectionDate: "2025-01-10", inspectionType: "합동점검", inspectionName: "비상구 개폐 상태 확인", inspectionResult: "이상없음", note: "-", inspector: "박점검", sitePhotos: ["/images/photo11.jpg"] },
{ id: 2, inspectionDate: "2025-02-01", inspectionType: "일반점검", inspectionName: "이동식 사다리 고정 상태 점검", inspectionResult: "시정조치 완료", note: "나사 조임/고정 브래킷 교체 완료", inspector: "이점검", sitePhotos: [] },
{ id: 1, inspectionDate: "2025-03-15", inspectionType: "특별점검", inspectionName: "화학물질 보관 용기 누수 여부 확인", inspectionResult: "중대 위험요인", note: "누수 용기 즉시 교체/바닥 세척 및 방수 처리", inspector: "최안전", sitePhotos: [] }
]

export default function SiteManagement() {
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
const downloadDocx = () => alert("점검지 양식 다운로드")

const handleSave = (newItem: any) => {
const newId = (Math.max(...data.map(d => Number(d.id))) + 1).toString()
setData([{ id: newId, ...newItem, onOpenPhotos: (images: string[]) => setPhotoPreview({ open:true, images, index:0 }) }, ...data])
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
<Button variant="action" onClick={downloadDocx} className="flex items-center gap-1">
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
<SitePhotoViewer open={photoPreview.open} images={photoPreview.images} index={photoPreview.index} onClose={() => setPhotoPreview(p => ({ ...p, open:false }))} onPrev={() => setPhotoPreview(p => ({ ...p, index: p.index > 0 ? p.index - 1 : p.index }))} onNext={() => setPhotoPreview(p => ({ ...p, index: p.index < p.images.length - 1 ? p.index + 1 : p.index }))} />
</section>
)
}