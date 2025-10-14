import React from "react"
import { useNavigate } from "react-router-dom"
import { CirclePlus, QrCode, Printer, Trash2, Save, Download, Image } from "lucide-react"
import QRCode from "qrcode"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import PageTitle from "@/components/common/base/PageTitle"
import TabMenu from "@/components/common/base/TabMenu"
import { ReportFormat, RFTbmInput } from "@/components/report/ReportFormat"
import SitePhotoViewer from "@/components/modules/SitePhotoViewer"

type ActionButtonsProps = { totalCount: number; selectedIds: (number|string)[]; onRegister: () => void; onGenerateQR: () => void; onPrint: () => void; onDelete: () => void; onDownload: () => void }

function ActionButtons({ totalCount, onRegister, onGenerateQR, onPrint, onDelete, onDownload }: ActionButtonsProps): React.ReactElement {
return (
<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {totalCount}건</span>
<div className="flex flex-nowrap gap-1 w-full justify-end sm:w-auto">
<Button variant="action" onClick={onRegister} className="flex items-center gap-1"><CirclePlus size={16}/>신규등록</Button>
<Button variant="action" onClick={onGenerateQR} className="flex items-center gap-1"><QrCode size={16}/>QR 생성</Button>
<Button variant="action" onClick={onDownload} className="flex items-center gap-1"><Save size={16}/>다운로드</Button>
<Button variant="action" onClick={onPrint} className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action" onClick={onDelete} className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
</div>
)
}

const columns: Column[] = [
{ key: "id", label: "번호", minWidth: "50px" },
{ key: "tbm", label: "TBM명", minWidth: "160px" },
{ key: "eduDate", label: "실시일", minWidth: "128px" },
{ key: "eduTime", label: "진행시간", minWidth: "168px" },
{ key: "targetText", label: "대상", minWidth: "96px" },
{ key: "participantsText", label: "참여", minWidth: "96px" },
{ key: "leader", label: "실시자", minWidth: "96px" },
{
key: "sitePhotos",
label: "현장사진",
minWidth: 80,
renderCell: (row: DataRow): React.ReactElement => (
row.sitePhotos && row.sitePhotos.length > 0 ? (
<button type="button" className="flex items-center justify-center w-full text-gray-700 hover:text-gray-900" onClick={() => row.onOpenPhotos?.(row.sitePhotos ?? [])} aria-label="현장사진 보기">
<Image size={19} strokeWidth={2}/>
</button>
) : <span className="flex items-center justify-center text-gray-400">-</span>
)
},
{
key: "attachments",
label: "첨부파일",
minWidth: 90,
renderCell: (): React.ReactElement => (
<span className="flex justify-center items-center cursor-pointer" role="button" tabIndex={0} aria-label="첨부파일 다운로드">
<Download size={19} strokeWidth={2}/>
</span>
)
},
{
key: "manage",
label: "관리",
minWidth: 110,
renderCell: (): React.ReactElement => (
<button style={{ background: "none", border: "none", padding: 0, color: "#999999", cursor: "pointer", width: 110, textAlign: "center" }}
onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>자세히보기/편집</button>
)
}
]

const rawData: DataRow[] = [
{ id: 3, tbm: "기계장비 안전사용 교육", date: "2025-06-01", start: "15:30", end: "16:30", targetCount: 5, participantsCount: 3, leader: "이동현", sitePhotos: ["/images/photo1.jpg","/images/photo2.jpg","/images/photo3.jpg"] },
{ id: 2, tbm: "프레스 안전작동 교육", date: "2025-06-01", start: "10:00", end: "12:00", targetCount: 9, participantsCount: 7, leader: "이동현", sitePhotos: ["/images/photo2.jpg"] },
{ id: 1, tbm: "신규직원 안전입문 교육", date: "2025-06-01", start: "13:30", end: "15:00", targetCount: 8, participantsCount: 6, leader: "이동현", sitePhotos: [] }
]

export default function TBMContent(): React.ReactElement {
const navigate = useNavigate()
const [startDate, setStartDate] = React.useState<string>("2025-06-16")
const [endDate, setEndDate] = React.useState<string>("2025-12-16")
const [searchText, setSearchText] = React.useState<string>("")
const [photoPreview, setPhotoPreview] = React.useState<{open:boolean; images:string[]; index:number}>({ open:false, images:[], index:0 })
const enrich = (r: DataRow): DataRow => {
const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h*60 + m }
const diff = Math.max(0, toMin(String(r.end||"00:00")) - toMin(String(r.start||"00:00")))
const dh = Math.floor(diff/60), dm = diff%60
const durText = diff>0 ? (dh>0 ? `${dh}시간${dm?` ${dm}분`:""}` : `${dm}분`) : "0분"
return { ...r, eduDate: r.date, eduTime: `${r.start} ~ ${r.end}${diff>0?` (${durText})`:""}`, targetText: `${r.targetCount ?? 0}명`, participantsText: `${r.participantsCount ?? 0}명`, onOpenPhotos: (images: string[]) => setPhotoPreview({ open:true, images, index:0 }) }
}
const [data, setData] = React.useState<DataRow[]>(rawData.map(enrich))
const [selectedIds, setSelectedIds] = React.useState<(number|string)[]>([])
const handleRegister = (): void => navigate("/tbm/register")
const handleGenerateQR = async (): Promise<void> => {
if (selectedIds.length === 0) { alert("QR 생성할 항목을 선택하세요"); return }
for (const id of selectedIds) {
const row = data.find(d => String(d.id) === String(id)); if (!row) continue
const qrText = `TBM명: ${row.tbm}\n실시일: ${row.eduDate}\n진행시간: ${row.eduTime}\n대상: ${row.targetText}\n참여: ${row.participantsText}\n실시자: ${row.leader}`
try { const dataUrl = await QRCode.toDataURL(qrText, { width: 300 }); const link = document.createElement("a"); link.href = dataUrl; link.download = `QR_${row.id}.png`; document.body.appendChild(link); link.click(); document.body.removeChild(link) }
catch { alert("QR 생성 실패") }
}
}
const buildTbmInput = async (row: DataRow): Promise<RFTbmInput> => {
let qrDataUrl: string|undefined
try { const qrText = `TBM명: ${row.tbm}\n실시일: ${row.eduDate}\n진행시간: ${row.eduTime}\n대상: ${row.targetText}\n참여: ${row.participantsText}\n실시자: ${row.leader}`; qrDataUrl = await QRCode.toDataURL(qrText, { width: 300 }) } catch { qrDataUrl = undefined }
const durationText = typeof row.eduTime === "string" && row.eduTime.includes("(") ? row.eduTime.split("(")[1]?.replace(")","") : ""
return { id: row.id as number|string, factory: "", tbmName: String(row.tbm), location: "교육장 A", date: String(row.eduDate ?? ""), eduTime: String(row.eduTime ?? ""), durationText, targetText: String(row.targetText ?? "0명"), participantsText: String(row.participantsText ?? "0명"), leader: String(row.leader), content: "1. 작업내용 및 절차 전달\n2. 위험성평가 내용 공유\n3. 비상시 행동요령 안내", remark: "개인보호구 착용 확인 및 장비 점검 완료", riskProcessTitle: "", riskItems: [{ hazard: "전도/충돌 위험", countermeasure: "작업 전 TBM 실시, 안전모·안전화 착용" }], attendees: [{ name: "홍길동", phone: "010-1111-2222" }, { name: "김철수", phone: "010-3333-4444" }], qrDataUrl, attachments: [{ name: "현장점검사진_2025-06-01.jpg" }] }
}
const handleDownload = async (): Promise<void> => {
if (selectedIds.length === 0) { alert("다운로드할 항목을 선택하세요"); return }
const id = selectedIds[0]; const row = data.find(d => String(d.id) === String(id))
if (!row) { alert("선택한 항목을 찾을 수 없습니다"); return }
try { const input = await buildTbmInput(row); await ReportFormat.generate<RFTbmInput>("tbm", input) } catch (err) { console.error(err); alert("리포트 생성 실패") }
}
const handlePrint = (): void => window.print()
const handleDelete = (): void => {
if (selectedIds.length === 0) { alert("삭제할 항목을 선택하세요"); return }
if (window.confirm("정말 삭제하시겠습니까?")) { setData(prev => prev.filter(row => !selectedIds.includes(row.id))); setSelectedIds([]) }
}
const closePreview = () => setPhotoPreview(p => ({ ...p, open:false }))
const prevImg = () => setPhotoPreview(p => ({ ...p, index: p.index > 0 ? p.index - 1 : p.index }))
const nextImg = () => setPhotoPreview(p => ({ ...p, index: p.index < p.images.length - 1 ? p.index + 1 : p.index }))
return (
<section className="tbm-content w-full bg-white">
<PageTitle>TBM</PageTitle>
<TabMenu tabs={["TBM 목록"]} activeIndex={0} onTabClick={() => {}} className="mb-6"/>
<FilterBar startDate={startDate} endDate={endDate} onStartDate={setStartDate} onEndDate={setEndDate} searchText={searchText} onSearchText={setSearchText} onSearch={() => {}}/>
<ActionButtons totalCount={data.length} selectedIds={selectedIds} onRegister={handleRegister} onGenerateQR={handleGenerateQR} onPrint={handlePrint} onDelete={handleDelete} onDownload={handleDownload}/>
<div className="overflow-x-auto bg-white"><DataTable columns={columns} data={data} onCheckedChange={setSelectedIds}/></div>
<SitePhotoViewer open={photoPreview.open} images={photoPreview.images} index={photoPreview.index} onClose={closePreview} onPrev={prevImg} onNext={nextImg}/>
</section>
)
}