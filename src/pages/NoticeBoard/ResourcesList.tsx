import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/common/base/Button"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import FilterBar from "@/components/common/base/FilterBar"
import { DownloadIcon, CirclePlus, Printer, Trash2, Save } from "lucide-react"
import ResourcesListRegister from "./ResourcesListRegister"

const columns: Column[] = [
{ key: "id", label: "번호", minWidth: "50px" },
{ key: "title", label: "자료명", minWidth: "400px", align: "left" },
{ key: "author", label: "작성자", minWidth: "80px" },
{ key: "date", label: "등록일", minWidth: "100px" },
{ key: "attachment", label: "첨부파일", minWidth: "60px" },
{ key: "manage", label: "관리", minWidth: 110, renderCell: (row) => (<button style={{ background: "none", border: "none", padding: 0, color: "#999999", cursor: "pointer", width: 110, textAlign: "center" }} onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")} onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>자세히보기/편집</button>) }
]

const initialData: DataRow[] = [
{ id: 103, title: "중대재해 예방조치 이행점검 서식", author: "이안전", date: "2025-05-30", attachment: (<span className="flex justify-center items-center"><DownloadIcon size={19} aria-label="첨부파일 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>) },
{ id: 102, title: "중대재해 예방관리계획 수립 및 자체점검 결과보고서 서식", author: "이안전", date: "2025-05-19", attachment: (<span className="flex justify-center items-center"><DownloadIcon size={19} aria-label="첨부파일 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>) },
{ id: 101, title: "도급·용역·위탁에 따른 협력업체 유해·위험요인 평가 확인서 서식", author: "박관리", date: "2025-05-11", attachment: (<span className="flex justify-center items-center"><DownloadIcon size={19} aria-label="첨부파일 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>) }
]

const TAB_LABELS = ["공지사항", "자료실", "중대재해처벌법"]
const TAB_PATHS = ["/notice-board/notice", "/notice-board/resources", "/notice-board/law"]

export default function ResourcesList() {
const navigate = useNavigate()
const location = useLocation()
const [data, setData] = useState<DataRow[]>(initialData)
const [keyword, setKeyword] = useState("")
const [checkedIds, setCheckedIds] = useState<(number | string)[]>([])
const [isRegisterOpen, setIsRegisterOpen] = useState(false)

const currentTabIdx = TAB_PATHS.findIndex(path => location.pathname.startsWith(path))
const activeTabIdx = currentTabIdx === -1 ? 0 : currentTabIdx

const handleTabClick = (idx: number) => {
if (location.pathname !== TAB_PATHS[idx]) {
navigate(TAB_PATHS[idx])
setCheckedIds([])
}
}

const handleSearch = () => {}
const handlePrint = () => window.print()
const handleDelete = () => {
if (checkedIds.length === 0) return alert("삭제할 항목을 선택하세요")
if (window.confirm("정말 삭제하시겠습니까?")) {
setData(prev => prev.filter(row => !checkedIds.includes(row.id)))
setCheckedIds([])
}
}

const handleRegisterSave = (newItem: any) => {
const newId = data.length > 0 ? Math.max(...data.map(d => Number(d.id))) + 1 : 1
const newRow: DataRow = { id: newId, title: newItem.title, author: newItem.author, date: newItem.date, attachment: newItem.attachment || null }
setData(prev => [newRow, ...prev])
setIsRegisterOpen(false)
}

return (
<section className="resources-list-content w-full bg-white">
<PageTitle>{TAB_LABELS[activeTabIdx]}</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={activeTabIdx} onTabClick={handleTabClick} className="mb-6" />
<div className="mb-3">
<FilterBar keyword={keyword} onKeywordChange={setKeyword} startDate="" endDate="" onStartDate={() => {}} onEndDate={() => {}} onSearch={handleSearch} />
</div>
<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {data.length}건</span>
<div className="flex flex-nowrap gap-1 w-full justify-end self-end sm:w-auto sm:self-auto">
<Button variant="action" onClick={() => setIsRegisterOpen(true)} className="flex items-center gap-1">
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
<DataTable columns={columns} data={data} onCheckedChange={setCheckedIds} />
</div>
{isRegisterOpen && (
<ResourcesListRegister isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onSave={handleRegisterSave} userName="박관리" />
)}
</section>
)
}