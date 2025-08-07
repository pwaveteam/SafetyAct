import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Button from "@/components/common/base/Button"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import TabMenu from "@/components/common/base/TabMenu"
import PageTitle from "@/components/common/base/PageTitle"
import FilterBar from "@/components/common/base/FilterBar"
import { DownloadIcon, Printer, Trash2, Save } from "lucide-react"

const columns: Column[] = [
{ key: "id", label: "번호", minWidth: "50px" },
{ key: "title", label: "제목", minWidth: "500px", align: "left" },
{ key: "organization", label: "소관기관", minWidth: "100px" },
{ key: "date", label: "발표일", minWidth: "100px" },
{ key: "attachment", label: "첨부파일", minWidth: "60px" }
]

const initialData: DataRow[] = [
{ id: 103, title: "『중대재해 처벌 등에 관한 법률 시행령』 일부개정령안 행정예고", organization: "고용노동부", date: "2025-06-28", attachment: (<span className="text-gray-400 text-sm text-center block">없음</span>) },
{ id: 102, title: "『중대재해 처벌법』 개정법률 공포 (2025.06.21 시행)", organization: "안전보건공단", date: "2025-06-21", attachment: (<span className="flex justify-center items-center"><DownloadIcon size={19} aria-label="첨부파일 다운로드" role="button" tabIndex={0} className="cursor-pointer" /></span>) },
{ id: 101, title: "중대산업재해 발생 시 보고 및 조치 매뉴얼(제5차 개정판)", organization: "안전보건공단", date: "2025-06-19", attachment: (<span className="text-gray-400 text-sm text-center block">없음</span>) }
]

const TAB_LABELS = ["공지사항", "자료실", "중대재해처벌법"]
const TAB_PATHS = ["/notice-board/notice", "/notice-board/resources", "/notice-board/law"]

export default function LawBoard() {
const navigate = useNavigate()
const location = useLocation()
const [data, setData] = useState<DataRow[]>(initialData)
const [keyword, setKeyword] = useState("")
const [checkedIds, setCheckedIds] = useState<(number | string)[]>([])

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
if (checkedIds.length === 0) { alert("삭제할 항목을 선택하세요"); return }
if (window.confirm("정말 삭제하시겠습니까?")) {
setData(prev => prev.filter(row => !checkedIds.includes(row.id)))
setCheckedIds([])
}
}

return (
<section className="law-board-content w-full bg-white">
<PageTitle>{TAB_LABELS[activeTabIdx]}</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={activeTabIdx} onTabClick={handleTabClick} className="mb-6" />
<div className="mb-3">
<FilterBar keyword={keyword} onKeywordChange={setKeyword} startDate="" endDate="" onStartDate={() => {}} onEndDate={() => {}} onSearch={handleSearch} />
</div>
<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {data.length}건</span>
<div className="flex flex-nowrap gap-1 w-full justify-end self-end sm:w-auto sm:self-auto">
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
</section>
)
}