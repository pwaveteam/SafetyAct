import React, { useState } from "react"
import Button from "@/components/common/base/Button"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import { Field } from "@/components/common/forms/FormScreen"
import { Trash2 } from "lucide-react"
import Badge from "@/components/common/base/Badge"

interface Attendee { name: string; phone: string; signed?: boolean }
interface Props { attendees: Attendee[]; onAdd: (att: Attendee) => void; onRemove: (idx: number) => void }

export default function AttendeePanel({ attendees, onAdd, onRemove }: Props) {
const [values, setValues] = useState<{ [key: string]: string }>({ name: "", phonePrefix: "010", phoneMiddle: "", phoneLast: "" })
const [demoRows, setDemoRows] = useState<Attendee[]>(attendees.length === 0 ? [
{ name: "홍길동", phone: "010-1234-5678", signed: false },
{ name: "박안전", phone: "010-2222-3333", signed: true },
{ name: "최관리", phone: "010-4444-5555", signed: true }
] : [])
const isDemo = attendees.length === 0

const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
const handleAdd = () => {
const fullPhone = `${values.phonePrefix}-${values.phoneMiddle}-${values.phoneLast}`
if (!values.name.trim()) return alert("이름을 입력해주세요")
if (!values.phoneMiddle.trim() || !values.phoneLast.trim()) return alert("전화번호를 정확히 입력해주세요")
onAdd({ name: values.name, phone: fullPhone, signed: false })
setValues({ name: "", phonePrefix: "010", phoneMiddle: "", phoneLast: "" })
}

const handleDelete = (idx: number) => {
if (window.confirm("정말 삭제하시겠습니까?")) {
if (isDemo) setDemoRows(rows => rows.filter((_, i) => i !== idx))
else onRemove(idx)
alert("삭제되었습니다.")
}
}

const renderInput = (field: Field) => {
const BORDER_COLOR = "#AAAAAA", COMMON_BORDER = `border border-[${BORDER_COLOR}] rounded-[8px]`, COMMON_PLACEHOLDER = "placeholder:font-normal placeholder:text-[#86939A] placeholder:text-sm md:placeholder:text-[15px]", COMMON_TEXT = "text-sm md:text-[15px] font-medium", BG_EDITABLE = "bg-white text-[#333639]", BASE_INPUT = `${COMMON_BORDER} px-2 h-[39px] w-full appearance-none ${COMMON_PLACEHOLDER} ${COMMON_TEXT}`, isRequired = field.required !== false, requiredAttrs = isRequired ? { required: true } : {}
if (field.type === "text") return (<input type="text" name={field.name} value={values[field.name]||""} onChange={handleChange} placeholder={field.placeholder} maxLength={20} onKeyDown={e=>{if(!/[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]/.test(e.key)&&!["Backspace","ArrowLeft","ArrowRight","Delete","Tab"].includes(e.key))e.preventDefault()}} onPaste={e=>e.preventDefault()} className={`${BASE_INPUT} ${BG_EDITABLE}`} {...requiredAttrs} />)
if (field.type === "phone") return (
<div className="flex items-center gap-2 w-full">
<div className="relative basis-1/3">
<select name="phonePrefix" value={values.phonePrefix||"010"} onChange={handleChange} className={`${BASE_INPUT} ${BG_EDITABLE} pr-8 w-full text-sm md:text-[15px]`} {...requiredAttrs}><option value="010">010</option></select>
</div>
<span className="text-sm md:text-[15px] text-[#333639]">-</span>
<input type="text" name="phoneMiddle" value={values.phoneMiddle||""} onChange={handleChange} maxLength={4} inputMode="numeric" pattern="[0-9]*" className={`${BASE_INPUT} ${BG_EDITABLE} basis-1/3`} onKeyDown={e=>{if(!/[0-9]/.test(e.key)&&!["Backspace","ArrowLeft","ArrowRight","Delete","Tab"].includes(e.key))e.preventDefault()}} {...requiredAttrs} />
<span className="text-sm md:text-[15px] text-[#333639]">-</span>
<input type="text" name="phoneLast" value={values.phoneLast||""} onChange={handleChange} maxLength={4} inputMode="numeric" pattern="[0-9]*" className={`${BASE_INPUT} ${BG_EDITABLE} basis-1/3`} onKeyDown={e=>{if(!/[0-9]/.test(e.key)&&!["Backspace","ArrowLeft","ArrowRight","Delete","Tab"].includes(e.key))e.preventDefault()}} {...requiredAttrs} />
</div>
)
return null
}

const fields: Field[] = [
{ label: "이름", name: "name", type: "text", placeholder: "이름을 입력해주세요", required: true },
{ label: "전화번호", name: "phone", type: "phone", required: true }
]

const columns: Column[] = [
{ key: "name", label: "이름", width: "25%" },
{ key: "phone", label: "휴대폰", width: "35%" },
{ key: "signature", label: "서명", width: "20%" },
{ key: "actions", label: "삭제", width: "20%" }
]

const data: DataRow[] = (isDemo ? demoRows : attendees).map((att, idx) => ({
id: idx,
name: att.name,
phone: att.phone,
signature: <Badge color={att.signed ? "blue" : "red"}>{att.signed ? "완료" : "미완료"}</Badge>,
actions: <button aria-label="삭제" className="p-1 rounded hover:bg-gray-100" onClick={() => handleDelete(idx)}><Trash2 className="w-4 h-4 text-gray-600" /></button>
}))

const tableStyle = `
<style>
.hide-select-col table thead th:first-child, .hide-select-col table tbody td:first-child {display:none!important;}
.no-row-hover table tbody tr:hover {background:transparent!important;}
</style>
`

return (
<div className="flex flex-col h-full">
<div dangerouslySetInnerHTML={{ __html: tableStyle }} />
<section className="flex-grow overflow-y-auto mb-8 border border-[#F3F3F3] rounded-[16px] p-3 min-h-[300px] hide-select-col no-row-hover">
<DataTable columns={columns} data={data} selectable={false} />
{data.length === 0 && (
<div className="w-full text-center text-gray-500 mt-10 whitespace-pre-line text-sm leading-relaxed select-none">
참석자 등록을 하지 않아도 됩니다.{"\n"}저장 시 생성된 QR코드로 근로자가 모바일 서명을 하면 자동 등록됩니다.
</div>
)}
</section>
<div>
<div className="flex justify-between items-center mb-3">
<h3 className="text-[#333639] font-semibold text-base md:font-semibold md:text-lg">참석자 등록하기</h3>
<Button variant="action" onClick={() => alert("이전 내역 불러오기 기능 준비중")}>이전 내역 불러오기</Button>
</div>

<section className="border border-[#F3F3F3] rounded-[16px] p-4 min-h-[180px]">
<div className="flex mb-4 gap-3">
<div className="flex flex-col flex-1 gap-2">{fields.map(f => <div key={f.name}>{renderInput(f)}</div>)}</div>
<div className="flex flex-col justify-center"><Button variant="primary" className="h-full min-h-[88px] px-6" onClick={handleAdd}>등록</Button></div>
</div>
</section>
</div>

</div>
)
}