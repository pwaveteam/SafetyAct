import React, { useState } from "react"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import PageTitle from "@/components/common/base/PageTitle"
import NoticeRegister from "./ResponseManualRegister"
import { DownloadIcon, CirclePlus, Printer, Trash2, Save, ShieldAlert } from "lucide-react"
import TabMenu from "@/components/common/base/TabMenu"

const columns: Column[] = [
{ key: "id", label: "번호", minWidth: "50px" },
{ key: "title", label: "제목", minWidth: "300px", align: "left" },
{ key: "author", label: "작성자", minWidth: "120px" },
{ key: "date", label: "작성일", minWidth: "120px" },
{ key: "views", label: "조회수", minWidth: "90px" },
{ key: "attachment", label: "첨부파일", minWidth: "90px" },
{
key: "manage",
label: "관리",
minWidth: 110,
renderCell: (): React.ReactElement => (
<button
style={{ background: "none", border: "none", padding: 0, color: "#999999", cursor: "pointer", width: 110, textAlign: "center" }}
onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
>
자세히보기/편집
</button>
),
},
]

const initialData: DataRow[] = [
{
id: 3,
title: "(산업안전) 2025년 산업안전보건법령의 요지",
author: "김작성",
date: "2025-05-30",
views: 25,
attachment: (
<span className="flex justify-center items-center">
<DownloadIcon size={19} aria-label="첨부파일 다운로드" role="button" tabIndex={0} className="cursor-pointer" />
</span>
),
},
{
id: 2,
title: "(중대재해) 중대산업재해 등 사고 발생 대비·대응 매뉴얼(2025)",
author: "김작성",
date: "2025-05-30",
views: 234,
attachment: (
<span className="flex justify-center items-center">
<DownloadIcon size={19} aria-label="첨부파일 다운로드" role="button" tabIndex={0} className="cursor-pointer" />
</span>
),
},
{
id: 1,
title: "(산업안전) 2025년 산업안전보건법령의 요지",
author: "김작성",
date: "2025-05-30",
views: 860,
attachment: (
<span className="flex justify-center items-center">
<DownloadIcon size={19} aria-label="첨부파일 다운로드" role="button" tabIndex={0} className="cursor-pointer" />
</span>
),
},
]

type ModalKind = "none" | "register"
type RegisterItem = { title: string; author: string; date: string; attachment?: boolean }

export default function ResponseManual(): React.ReactElement {
const [data, setData] = useState<DataRow[]>(initialData)
const [searchText, setSearchText] = useState<string>("")
const [startDate, setStartDate] = useState<string>("")
const [endDate, setEndDate] = useState<string>("")
const [checkedIds, setCheckedIds] = useState<(number | string)[]>([])
const [modalType, setModalType] = useState<ModalKind>("none")
const userName = "김작성"

const handleSearch = (): void => {}
const handlePrint = (): void => window.print()

const handleDelete = (): void => {
if (checkedIds.length === 0) {
alert("삭제할 항목을 선택하세요")
return
}
if (window.confirm("정말 삭제하시겠습니까?")) {
setData((prev) => prev.filter((row) => !checkedIds.includes(row.id)))
setCheckedIds([])
}
}

const handleSave = (newItem: RegisterItem): void => {
const newId = data.length > 0 ? Math.max(...data.map((d) => Number(d.id))) + 1 : 1
const newData: DataRow = {
id: newId,
title: newItem.title,
author: newItem.author,
date: newItem.date,
views: 0,
attachment: newItem.attachment ? (
<span className="flex justify-center items-center">
<DownloadIcon size={19} aria-label="첨부파일 다운로드" role="button" tabIndex={0} className="cursor-pointer" />
</span>
) : (
""
),
}
setData((prev) => [newData, ...prev])
setModalType("none")
}

const handleEmergencySystemDownload = (): void => {
alert("비상대응체계 다운로드")
}

return (
<section className="response-manual w-full">
<PageTitle>대응매뉴얼</PageTitle>
<TabMenu tabs={["대응매뉴얼 목록"]} activeIndex={0} onTabClick={() => {}} className="mb-6" />
<FilterBar
startDate={startDate}
endDate={endDate}
onStartDate={setStartDate}
onEndDate={setEndDate}
keyword={searchText}
onKeywordChange={setSearchText}
onSearch={handleSearch}
/>

<div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
<span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {data.length}건</span>

<div className="flex flex-col gap-1 w-full justify-end self-end sm:hidden">
<div className="flex gap-1 justify-end">
<Button variant="action" onClick={() => setModalType("register")} className="flex items-center gap-1">
<CirclePlus size={16} />신규등록
</Button>
<Button variant="urgent" onClick={handleEmergencySystemDownload} className="flex items-center gap-1">
<ShieldAlert size={16} />비상대응체계 가이드
</Button>
</div>
<div className="flex gap-1 justify-end">
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

<div className="hidden sm:flex flex-nowrap gap-1 w-auto justify-end">
<Button variant="action" onClick={() => setModalType("register")} className="flex items-center gap-1">
<CirclePlus size={16} />신규등록
</Button>
<Button variant="urgent" onClick={handleEmergencySystemDownload} className="flex items-center gap-1">
<ShieldAlert size={16} />비상대응체계 가이드
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

{modalType === "register" && (
<NoticeRegister isOpen onClose={() => setModalType("none")} onSave={handleSave} userName={userName} />
)}
</section>
)
}