// FormScreen.tsx
import React, { useState, useEffect } from "react"
import Button from "@/components/common/base/Button"
import { X, Search } from "lucide-react"
import RadioGroup from "@/components/common/base/RadioGroup"

export type Field = {
label: string | React.ReactNode
name: string
type?:
| "text"
| "select"
| "password"
| "email"
| "readonly"
| "phone"
| "custom"
| "signature"
| "date"
| "singleDatetime"
| "datetime"
| "daterange"
| "timeRange"
| "textarea"
| "fileUpload"
| "tags"
| "quantityUnit"
| "quantity"
| "autocomplete"
| "radio"
placeholder?: string
options?: { value: string; label: string }[]
customRender?: React.ReactNode
buttonRender?: React.ReactNode
required?: boolean
showPlusOne?: boolean
}

export type FormScreenProps = {
fields: Field[]
values: { [key: string]: string }
onChange: (
e: React.ChangeEvent<
HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>
) => void
onTagRemove?: (name: string, valueToRemove: string) => void
onEmailDomainSelect?: (domain: string) => void
onClose: () => void
onSave: () => void
onSubmit?: () => void
isModal?: boolean
notifyEnabled?: boolean
}

export default function FormScreen({
fields,
values,
onChange,
onTagRemove,
onEmailDomainSelect,
onClose,
onSave,
isModal = false,
notifyEnabled = true,
}: FormScreenProps) {
const BORDER_COLOR = "#AAAAAA"
const COMMON_BORDER = `border border-[${BORDER_COLOR}] rounded-[8px]`
const COMMON_PLACEHOLDER = "placeholder:font-normal placeholder:text-[#86939A] placeholder:text-sm md:placeholder:text-[15px]"
const COMMON_TEXT = "text-sm md:text-[15px] font-medium"
const BG_EDITABLE = "bg-white text-[#333639]"
const BG_READONLY = "bg-[#E4E7EA] text-[#888888]"
const BG_PW = "bg-[#EEF5FF] text-[#333639]"
const TEXTAREA_STYLE = `${COMMON_BORDER} ${COMMON_PLACEHOLDER} ${COMMON_TEXT} p-2 w-full min-h-[150px] ${BG_EDITABLE}`
const FILE_WRAPPER = `w-full h-[38px] ${COMMON_BORDER} flex items-center justify-center ${COMMON_PLACEHOLDER} ${COMMON_TEXT}`
const CELL_TEXT = "text-[#333639] text-sm md:text-[15px] font-normal"
const BASE_INPUT = `${COMMON_BORDER} px-2 h-[39px] w-full appearance-none select-reset ${COMMON_PLACEHOLDER} ${COMMON_TEXT}`


const SELECT_PADDING = "pr-8"

const [tagItems, setTagItems] = useState<{ value: string; label: string }[]>([])
const [tagsOpen, setTagsOpen] = useState(false)


useEffect(() => {
fetch("/api/processes")
.then(res => res.json())
.then((data: { value: string; label: string }[]) => setTagItems(data))
}, [])

const toggleTag = (name: string, v: string) => {
const existing = values[name].split(",").filter(Boolean)
const next = existing.includes(v)
? existing.filter(x => x !== v)
: [...existing, v]
onChange({
target: { name, value: next.join(",") },
} as React.ChangeEvent<HTMLInputElement>)
}

const renderInput = (field: Field) => {
const isRO = field.type === "readonly"
const isPW = field.name === "currentPassword"
const baseInput = `${COMMON_BORDER} px-2 h-[39px] w-full appearance-none ${COMMON_PLACEHOLDER} ${COMMON_TEXT}`
const inputClass = `${baseInput} ${isPW ? BG_PW : isRO ? BG_READONLY : BG_EDITABLE}`

const isRequired =
field.type !== "textarea" && field.type !== "fileUpload" && field.required !== false
const requiredAttrs = isRequired ? { required: true } : {}

if (field.type === "custom" && field.customRender) return field.customRender

if (field.type === "signature")
return (
<div className="py-0">
<div
className={`${BG_EDITABLE} p-2 ${COMMON_BORDER} w-[190px] h-[100px] flex items-center justify-center`}
>
{values[field.name] ? (
<img
src={values[field.name]}
alt="서명 이미지"
className="max-w-full max-h-full object-contain"
/>
) : (
<span className="text-[#999] text-sm md:text-[15px]">서명 이미지 없음</span>
)}
</div>
</div>
)

if (field.type === "radio" && field.options) {
return (
<RadioGroup
name={field.name}
value={values[field.name] || ""}
options={field.options}
onChange={e => onChange(e as React.ChangeEvent<HTMLInputElement>)}
className=""
/>
)
}

if (field.type === "select" && field.options)
return (
<div className="relative w-full md:w-[300px]">
<select
name={field.name}
value={values[field.name]}
onChange={onChange}
className={`${baseInput} ${BG_EDITABLE} pr-8 ${field.name === "notifyWhen" && !notifyEnabled ? "cursor-not-allowed text-gray-400" : ""}`}
{...requiredAttrs}
disabled={field.name === "notifyWhen" && !notifyEnabled}
>
<option value="">{field.placeholder || "선택"}</option>
{field.options.map(o => (
<option key={o.value} value={o.value}>
{o.label}
</option>
))}
</select>
</div>
)

if (field.type === "autocomplete")
return (
<div className="relative w-full">
<input
type="text"
name={field.name}
value={values[field.name]}
onChange={onChange}
placeholder={field.placeholder || "Search"}
className={`${baseInput} ${BG_EDITABLE} pr-8`}
{...requiredAttrs}
/>
<Search className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
</div>
)


if (field.type === "date")
return (
<div className="flex flex-wrap items-center gap-2">
<input
type="date"
name={field.name}
value={values[field.name]}
onChange={onChange}
className={`${COMMON_BORDER} px-2 h-[39px] ${BG_EDITABLE} w-[130px] md:w-[160px]`}
{...requiredAttrs}
/>
{field.showPlusOne !== false && (
<Button
variant="minor"
onClick={() => {
const cur = values[field.name]
if (!cur) return
const next = new Date(cur)
next.setDate(next.getDate() + 1)
const yyyy = next.getFullYear()
const mm = String(next.getMonth() + 1).padStart(2, "0")
const dd = String(next.getDate()).padStart(2, "0")
onChange({
target: { name: field.name, value: `${yyyy}-${mm}-${dd}` },
} as any)
}}
className="h-[39px] px-3 shrink-0"
>
+1일
</Button>
)}
</div>
)

if (field.type === "singleDatetime")
return (
<div className="flex flex-wrap items-center gap-4 w-full">
<div className="flex items-center gap-1 w-full md:w-auto">
<input
type="date"
name="startDate"
value={values.startDate || ""}
onChange={onChange}
className={`${COMMON_BORDER} px-2 h-[39px] ${BG_EDITABLE} w-[130px] md:w-[150px]`}
required
/>
</div>
<div className="flex items-center gap-1 w-full md:w-auto">
<div className="relative w-[60px]">
<select
name="startHour"
value={values.startHour || ""}
onChange={onChange}
className={`${BASE_INPUT} ${BG_EDITABLE} pr-8 w-full`}
required
>
<option value="">시</option>
{[...Array(24).keys()].map(h => (
<option key={h} value={h}>
{h}시
</option>
))}
</select>

</div>
<div className="relative w-[60px]">
<select
name="startMinute"
value={values.startMinute || ""}
onChange={onChange}
className={`${BASE_INPUT} ${BG_EDITABLE} pr-8 w-full`}
required
>
<option value="">분</option>
{["00", "10", "20", "30", "40", "50"].map(m => (
<option key={m} value={m}>
{m}분
</option>
))}
</select>

</div>
</div>

<span className="text-sm md:text-[15px] text-[#333639]">~</span>

<div className="relative w-[60px]">
<select
name="endHour"
value={values.endHour || ""}
onChange={onChange}
className={`${BASE_INPUT} ${BG_EDITABLE} pr-8 w-full`}
required
>
<option value="">시</option>
{[...Array(24).keys()].map(h => (
<option key={h} value={h}>
{h}시
</option>
))}
</select>

</div>
<div className="relative w-[60px]">
<select
name="endMinute"
value={values.endMinute || ""}
onChange={onChange}
className={`${BASE_INPUT} ${BG_EDITABLE} pr-8 w-full`}
required
>
<option value="">분</option>
{["00", "10", "20", "30", "40", "50"].map(m => (
<option key={m} value={m}>
{m}분
</option>
))}
</select>

</div>
</div>
)

if (field.type === "datetime")
return (
<div className="flex flex-wrap items-center gap-1 w-full">
<div className="relative basis-1/5">
<input
type="date"
name="startDate"
value={values.startDate || ""}
onChange={onChange}
className={`${baseInput} ${BG_EDITABLE} px-1 w-[130px] md:w-[160px]`}
required
/>
</div>

<span className="text-sm md:text-[15px] text-[#333639]">~</span>

<div className="relative basis-1/5 mr-4">
<input
type="date"
name="endDate"
value={values.endDate || ""}
onChange={onChange}
className={`${baseInput} ${BG_EDITABLE} px-1 w-[130px] md:w-[160px]`}
/>
</div>

<div className="relative basis-1/6">
<select
name="startHour"
value={values.startHour || ""}
onChange={onChange}
className={`${baseInput} ${BG_EDITABLE} pr-3 w-[130px] md:w-[160px]`}
>
<option value="">시 선택</option>
{[...Array(24).keys()].map(h => (
<option key={h} value={h}>
{h}시
</option>
))}
</select>

</div>

<div className="relative basis-1/6">
<select
name="startMinute"
value={values.startMinute || ""}
onChange={onChange}
className={`${baseInput} ${BG_EDITABLE} pr-3 w-[130px] md:w-[160px]`}
>
<option value="">분</option>
{["00", "10", "20", "30", "40", "50"].map(m => (
<option key={m} value={m}>
{m}분
</option>
))}
</select>

</div>

<span className="text-sm md:text-[15px] text-[#333639]">~</span>

<div className="relative basis-1/6">
<select
name="endHour"
value={values.endHour || ""}
onChange={onChange}
className={`${baseInput} ${BG_EDITABLE} pr-3 w-[130px] md:w-[160px]`}
>
<option value="">시 선택</option>
{[...Array(24).keys()].map(h => (
<option key={h} value={h}>
{h}시
</option>
))}
</select>

</div>

<div className="relative basis-1/6">
<select
name="endMinute"
value={values.endMinute || ""}
onChange={onChange}
className={`${baseInput} ${BG_EDITABLE} pr-3 w-[130px] md:w-[160px]`}
>
<option value="">분</option>
{["00", "10", "20", "30", "40", "50"].map(m => (
<option key={m} value={m}>
{m}분
</option>
))}
</select>

</div>
</div>
)

if (field.type === "daterange")
return (
<div className="flex flex-wrap items-center gap-2 w-full">
<input
type="date"
name="startDate"
value={values.startDate || ""}
onChange={onChange}
className={`${COMMON_BORDER} px-2 h-[39px] ${BG_EDITABLE} w-[130px] md:w-[160px]`}
/>
<span className="text-sm md:text-[15px] text-[#333639]">~</span>
<input
type="date"
name="endDate"
value={values.endDate || ""}
onChange={onChange}
className={`${COMMON_BORDER} px-2 h-[39px] ${BG_EDITABLE} w-[130px] md:w-[160px]`}
/>
</div>
)

if (field.type === "timeRange") {
const adjustEnd = (deltaMin: number) => {
const sh = Number(values.startHour) || 0
const sm = Number(values.startMinute) || 0
let total = sh * 60 + sm + deltaMin
if (total < 0) total = 0
const newH = Math.floor(total / 60) % 24
const newM = total % 60
onChange({ target: { name: "endHour", value: String(newH) } } as any)
onChange({
target: {
name: "endMinute",
value: newM < 10 ? "0" + newM : String(newM),
},
} as any)
}

return (
<div className="flex flex-col gap-2 w-full">
<div className="flex items-center gap-1 flex-wrap md:flex-nowrap">
<div className="relative w-[66px] md:w-[80px] shrink-0">
<select
name="startHour"
value={values.startHour || ""}
onChange={onChange}
className={`${baseInput} ${BG_EDITABLE} pr-3 w-full text-sm md:text-[15px]`}
>
<option value="">시</option>
{[...Array(24).keys()].map(h => (
<option key={h} value={h}>
{h}시
</option>
))}
</select>

</div>

<div className="relative w-[66px] md:w-[80px] shrink-0">
<select
name="startMinute"
value={values.startMinute || ""}
onChange={onChange}
className={`${baseInput} ${BG_EDITABLE} pr-3 w-full text-sm md:text-[15px]`}
>
<option value="">분</option>
{["00", "10", "20", "30", "40", "50"].map(m => (
<option key={m} value={m}>
{m}분
</option>
))}
</select>

</div>

<span className="text-sm md:text-[15px] text-[#333639] shrink-0">~</span>

<div className="relative w-[66px] md:w-[80px] shrink-0">
<select
name="endHour"
value={values.endHour || ""}
onChange={onChange}
className={`${baseInput} ${BG_EDITABLE} pr-3 w-full text-sm md:text-[15px]`}
>
<option value="">시</option>
{[...Array(24).keys()].map(h => (
<option key={h} value={h}>
{h}시
</option>
))}
</select>

</div>

<div className="relative w-[66px] md:w-[80px] shrink-0">
<select
name="endMinute"
value={values.endMinute || ""}
onChange={onChange}
className={`${baseInput} ${BG_EDITABLE} pr-3 w-full text-sm md:text-[15px]`}
>
<option value="">분</option>
{["00", "10", "20", "30", "40", "50"].map(m => (
<option key={m} value={m}>
{m}분
</option>
))}
</select>

</div>
</div>

<div className="flex items-center">
<span className="text-sm md:text-[15px] font-medium text-[#6D808E]">
진행시간:&nbsp;
{(() => {
const sh = Number(values.startHour) || 0
const sm = Number(values.startMinute) || 0
const eh = Number(values.endHour) || sh
const em = Number(values.endMinute) || sm
const diff = eh * 60 + em - (sh * 60 + sm)
if (diff > 0) {
const h = Math.floor(diff / 60)
const m = diff % 60
return `${h}시간 ${m}분`
}
return "0시간 0분"
})()}
</span>
</div>
</div>
)
}

if (field.type === "phone")
return (
<div className="flex items-center gap-2 w-full overflow-x-auto md:overflow-visible">
<div className="relative w-[80px] md:w-[130px] shrink-0">
<select
name="phonePrefix"
value={values.phonePrefix || "010"}
onChange={onChange}
className={`${BASE_INPUT} ${BG_EDITABLE} pr-8 w-full text-sm md:text-[15px]`}
{...requiredAttrs}
>
{(field.options || [{ value: "010", label: "010" }]).map(o => (
<option key={o.value} value={o.value}>
{o.label}
</option>
))}
</select>

</div>

<span className="text-sm md:text-[15px] text-[#333639]">-</span>

<input
type="text"
name="phoneMiddle"
value={values.phoneMiddle || ""}
onChange={onChange}
maxLength={4}
inputMode="numeric"
pattern="[0-9]*"
className={`${inputClass} w-[80px] md:w-[130px] shrink-0 text-sm md:text-[15px]`}
onKeyDown={e => {
if (
!/[0-9]/.test(e.key) &&
!["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(e.key)
) {
e.preventDefault()
}
}}
/>

<span className="text-sm md:text-[15px] text-[#333639]">-</span>

<input
type="text"
name="phoneLast"
value={values.phoneLast || ""}
onChange={onChange}
maxLength={4}
inputMode="numeric"
pattern="[0-9]*"
className={`${inputClass} w-[80px] md:w-[130px] shrink-0 text-sm md:text-[15px]`}
onKeyDown={e => {
if (
!/[0-9]/.test(e.key) &&
!["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(e.key)
) {
e.preventDefault()
}
}}
/>
</div>
)

if (field.type === "email")
return (
<div className="flex items-center gap-2 w-full overflow-x-auto md:overflow-visible">
<input
type="text"
name="emailId"
value={values.emailId || ""}
onChange={onChange}
className={`${inputClass} w-[100px] md:w-[180px] text-sm md:text-[15px] shrink-0`}
onKeyDown={e => {
if (
/[\sㄱ-ㅎㅏ-ㅣ가-힣]/.test(e.key) &&
!["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(e.key)
) {
e.preventDefault()
}
}}
/>

<span className="text-sm md:text-[15px] text-[#333639] shrink-0">@</span>

<input
type="text"
name="emailDomain"
value={values.emailDomain || ""}
onChange={onChange}
className={`${inputClass} w-[100px] md:w-[180px] text-sm md:text-[15px] shrink-0`}
onKeyDown={e => {
if (
/[\sㄱ-ㅎㅏ-ㅣ가-힣]/.test(e.key) &&
!["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(e.key)
) {
e.preventDefault()
}
}}
/>

<div className="relative w-[100px] md:w-[180px] shrink-0">
<select
name="emailDomainSelect"
value={values.emailDomainSelect || ""}
onChange={e => onEmailDomainSelect?.(e.target.value)}
className={`${baseInput} ${BG_EDITABLE} pr-8 w-full text-sm md:text-[15px]`}
{...requiredAttrs}
>
<option value="">직접입력</option>
<option value="gmail.com">gmail.com</option>
<option value="naver.com">naver.com</option>
<option value="hanmail.net">hanmail.net</option>
<option value="nate.com">nate.com</option>
</select>

</div>
</div>
)

if (field.type === "textarea")
return (
<textarea
name={field.name}
value={values[field.name] || ""}
onChange={onChange}
placeholder={field.placeholder ?? `${field.label} 입력`}
className={`${TEXTAREA_STYLE} text-sm md:text-base placeholder:text-sm md:placeholder:text-base`}
/>
)

if (field.type === "fileUpload")
return (
<label className={`${FILE_WRAPPER} relative p-[3px] space-x-[6px]`}>
<span className="h-[30px] flex items-center px-3 bg-[#EFEFEF] border border-[#999999] rounded-[3px] text-sm md:text-base text-[#333639] cursor-pointer">
파일 선택
</span>
<span className="text-sm md:text-base text-[#999999] flex-1 truncate">
{values[field.name] || "선택된 파일 없음"}
</span>
<input
type="file"
name={field.name}
className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
onChange={e =>
onChange({
target: {
name: field.name,
value: (e.target as HTMLInputElement).files?.[0]?.name || "",
},
} as any)
}
/>
</label>
)

if (field.type === "quantity") {
return (
<div className="flex items-center gap-2 w-full">
<div className="basis-1/5 w-full md:w-auto">
<input
type="number"
name={field.name}
value={values[field.name] || ""}
onChange={onChange}
placeholder={field.placeholder || ""}
className={`${BASE_INPUT} w-full ${BG_EDITABLE}`}
min={0}
/>
</div>
</div>
)
}

if (field.type === "quantityUnit") {
return (
<div className="flex flex-wrap md:flex-nowrap items-center gap-2 w-full">
<input
type="number"
name={field.name + "_value"}
placeholder={field.placeholder || "값 입력"}
className={`${BASE_INPUT} ${BG_EDITABLE} basis-1/5 w-full md:w-auto flex-none`}
onChange={onChange}
/>
<div className="relative basis-1/5 flex-none w-full md:w-auto">
<select
name={field.name + "_unit"}
value={values[field.name + "_unit"]}
onChange={onChange}
className={`${BASE_INPUT} ${BG_EDITABLE} w-full ${SELECT_PADDING}`}
>
<option value="">단위 선택</option>
{field.options?.map(o => (
<option key={o.value} value={o.value}>
{o.label}
</option>
))}
</select>

</div>
</div>
)
}

if (field.type === "tags") {
const tags = values[field.name].split(",").filter(Boolean)
return (
<section
className={`w-full max-w-full bg-white px-1 py-0.5 ${COMMON_BORDER} h-[39px] flex items-center`}
>
<div className="relative flex flex-wrap items-center gap-1 w-full">
{tags.length === 0 ? (
<span className="text-sm md:text-[15px] font-normal text-[#86939A] select-none ml-2">
선택된 태그가 없습니다
</span>


) : (
tags.map(t => (
<span
key={t}
className="flex items-center bg-[#EFEFF3] text-[#161616] text-[13px] md:text-sm border rounded-[8px] px-[9px] py-[3px]"
>
{t}
<button
className="ml-1 text-[#AAAAAA] hover:text-[#666666]"
onClick={() => onTagRemove?.(field.name, t)}
type="button"
>
<X size={11} />
</button>
</span>
))
)}
</div>
</section>
)
}

if (isRO)
return (
<input
type="text"
name={field.name}
value={values[field.name] || ""}
disabled
className={`${COMMON_BORDER} px-2 h-[39px] w-full ${COMMON_PLACEHOLDER} ${COMMON_TEXT} ${BG_READONLY}`}
/>
)

return (
<input
type={field.type || "text"}
name={field.name}
value={values[field.name] || ""}
onChange={onChange}
placeholder={field.placeholder}
className={inputClass}
/>
)
}

const inputWrapperClass = isModal ? "w-full p-[8px]" : "w-full md:w-[65%] p-[8px]"

return (
<section className="w-full max-w-full bg-white text-sm md:text-base">
<div className="overflow-x-auto">
<table
className="w-full min-w-[320px] md:min-w-[720px] border-collapse"
style={{ borderTop: "1.9px solid #161616" }}
>
<tbody>
{fields.map(f => (
<tr key={f.name} className="border-b border-[#CCCCCC]">
<th
className={`w-[120px] md:w-[160px] py-[8px] md:py-[11px] px-[8px] md:px-[13px] bg-[#EFEFF3] text-[#666666] font-medium text-left text-sm md:text-base ${
f.type === "textarea" ? "align-top pt-3 md:pt-4" : "align-middle"
}`}
>
{f.label}
{f.type !== "textarea" &&
f.type !== "fileUpload" &&
f.required !== false && (
<span className="text-red-600 ml-1">*</span>
)}
</th>
<td
className={`border-l border-[#CCCCCC] px-0 bg-white ${CELL_TEXT} align-middle text-sm md:text-base`}
>
<div className="flex items-center h-full">
<div className={inputWrapperClass}>{renderInput(f)}</div>
{f.buttonRender && (
<div className="w-[35%] px-1 flex items-center justify-start">
{f.buttonRender}
</div>
)}
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>
</section>
)
}