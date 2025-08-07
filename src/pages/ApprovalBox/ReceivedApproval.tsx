import React from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/common/base/Button"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import FilterBar from "@/components/common/base/FilterBar"
import { EyeIcon, ClipboardPenIcon, Printer, Trash2, X, Save } from "lucide-react"
import Badge from "@/components/common/base/Badge"

const TAB_LABELS = ["받은결재함", "보낸결재함"]
const TAB_PATHS = ["/approval-box/received", "/approval-box/sent"]

const columns: Column[] = [
{ key: "id", label: "번호", minWidth: "50px" },
{ key: "date", label: "기안일", minWidth: "100px" },
{ key: "type", label: "결재유형", minWidth: "120px" },
{ key: "content", label: "결재내용", minWidth: "300px", align: "left" },
{ key: "drafter", label: "기안자", minWidth: "80px" },
{ key: "status", label: "상태", minWidth: "80px" },
{ key: "sign", label: "서명", minWidth: "80px" },
{ key: "detail", label: "상세보기", minWidth: "80px" }
]

const initialData: DataRow[] = [
{ id: 1, date: "2025-05-30", type: "예산계획서", content: "안전보건 예산 및 인력계획 결재 요청", drafter: "박관리", status: "결재완료" },
{ id: 2, date: "2025-05-19", type: "점검계획서", content: "정기 자체점검 계획 결재 요청", drafter: "박안전", status: "결재대기" },
{ id: 3, date: "2025-05-11", type: "위험요인개선", content: "유해·위험요인 개선계획 결재 요청", drafter: "박근로", status: "결재대기" }
]

function StatusCell({ status }: { status: string }) {
if (status === "결재완료") return <Badge color="gray">결재완료</Badge>
if (status === "결재대기") return <Badge color="orange">결재대기</Badge>
return <span>{status}</span>
}

function DetailModal({ row, onClose }: { row: DataRow; onClose: () => void }) {
const isSigned = row.status === "결재완료"
const isPending = row.status === "결재대기"

return (
<div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center">
<div className="bg-white p-6 w-full max-w-md rounded-[16px] shadow-lg relative">
<button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 transition-colors">
<X size={20} />
</button>
<div className="flex justify-between items-center mb-4 border-b pb-2">
<h2 className="text-lg font-semibold">결재 상세 정보</h2>
</div>
<div className="grid grid-cols-3 gap-y-3 text-sm py-4">
<div className="font-medium text-gray-600">기안일</div>
<div className="col-span-2">{row.date}</div>
<div className="font-medium text-gray-600">결재유형</div>
<div className="col-span-2">{row.type}</div>
<div className="font-medium text-gray-600">결재내용</div>
<div className="col-span-2 whitespace-pre-line">{row.content}</div>
<div className="font-medium text-gray-600">기안자</div>
<div className="col-span-2">{row.drafter}</div>
<div className="font-medium text-gray-600">상태</div>
<div className="col-span-2 flex items-center gap-2">
{isSigned ? <Badge color="gray">결재완료</Badge> : <Badge color="orange">결재대기</Badge>}
{isPending && <Button variant="signature" />}
{isSigned && <Button variant="signed" />}
</div>
</div>
<div className="flex justify-center mt-4">
<Button onClick={onClose} className="text-sm px-5">닫기</Button>
</div>
</div>
</div>
)
}

export default function ReceivedApproval() {
const navigate = useNavigate()
const currentPath = window.location.pathname
const currentTabIdx = TAB_PATHS.findIndex(path => currentPath.startsWith(path))
const activeIndex = currentTabIdx === -1 ? 0 : currentTabIdx
const [data, setData] = React.useState<DataRow[]>(initialData)
const [keyword, setKeyword] = React.useState("")
const [startDate, setStartDate] = React.useState("2025-06-16")
const [endDate, setEndDate] = React.useState("2025-12-16")
const [checkedIds, setCheckedIds] = React.useState<(number|string)[]>([])
const [selectedRow, setSelectedRow] = React.useState<DataRow|null>(null)

const handleTabClick = (idx: number) => { navigate(TAB_PATHS[idx]); setCheckedIds([]) }
const handleSearch = () => {}
const handlePrint = () => window.print()
const handleDelete = () => {
if (checkedIds.length === 0) { alert("삭제할 항목을 선택하세요"); return }
if (window.confirm("정말 삭제하시겠습니까?")) {
setData(prev => prev.filter(row => !checkedIds.includes(row.id)))
setCheckedIds([])
}
}

const renderCell = (row: DataRow, col: Column) => {
if (col.key === "status") return <StatusCell status={row.status as string} />
if (col.key === "sign") return <span className="flex justify-center items-center"><ClipboardPenIcon size={19} className="cursor-pointer" /></span>
if (col.key === "detail") return <span className="flex justify-center items-center cursor-pointer" onClick={() => setSelectedRow(row)}><EyeIcon size={19} /></span>
return row[col.key]
}

return (
<section className="received-approval-content w-full bg-white">
<PageTitle>{TAB_LABELS[activeIndex]}</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={activeIndex} onTabClick={handleTabClick} className="mb-6" />
<div className="mb-3">
<FilterBar startDate={startDate} endDate={endDate} onStartDate={setStartDate} onEndDate={setEndDate} keyword={keyword} onKeywordChange={setKeyword} onSearch={handleSearch} />
</div>

<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {data.length}건</span>
<div className="flex flex-nowrap gap-1 w-full justify-end sm:w-auto self-end sm:self-auto">
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
<DataTable columns={columns} data={data} renderCell={renderCell} onCheckedChange={setCheckedIds} />
</div>
{selectedRow && <DetailModal row={selectedRow} onClose={() => setSelectedRow(null)} />}
</section>
)
}