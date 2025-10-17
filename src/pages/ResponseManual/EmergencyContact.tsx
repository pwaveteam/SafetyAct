"use client"
import React, { useMemo, useState } from "react"
import Button from "@/components/common/base/Button"
import { Trash2 } from "lucide-react"

type Contact = { role: string; name: string; phone: string }
type Row = Contact & { id: number }

interface Props {
isOpen: boolean
onClose: () => void
onSave?: (contacts: Contact[]) => void
initialContacts?: Contact[]
}

export default function EmergencyContact({ isOpen, onClose, onSave, initialContacts }: Props) {
const seeded: Row[] = useMemo<Row[]>(
() =>
(initialContacts?.length
? initialContacts
: Array.from({ length: 6 }, () => ({ role: "", name: "", phone: "" }))).map((c, i) => ({
...c,
id: i + 1
})),
[initialContacts]
)

const [rows, setRows] = useState<Row[]>(seeded)

if (!isOpen) return null

const addRow = (): void =>
setRows(prev => [
...prev,
{ id: prev.length ? Math.max(...prev.map(r => r.id)) + 1 : 1, role: "", name: "", phone: "" }
])

const removeRow = (id: number): void =>
setRows(prev => {
if (prev.length <= 1) return prev
return prev.filter(r => r.id !== id)
})

const updateCell = (id: number, key: keyof Contact, value: string): void =>
setRows(prev => prev.map(r => (r.id === id ? { ...r, [key]: value } : r)))

const handleSave = (): void => {
const cleaned: Contact[] = rows
.map(({ id, ...c }) => c)
.filter(c => Object.values(c).some(v => String(v || "").trim() !== ""))

const invalid = cleaned.filter(c => !c.name?.trim() || !c.phone?.trim())
if (invalid.length) {
alert("각 행의 ‘이름’과 ‘연락처’는 필수입니다.")
return
}
onSave?.(cleaned)
onClose()
}

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
<div className="bg-white rounded-2xl w-[700px] max-w-[95%] h-[60vh] max-h-[60vh] p-6 md:p-8 shadow-2xl flex flex-col">
<div className="flex justify-between items-center mb-4 shrink-0">
<h2 className="text-2xl font-semibold tracking-wide">비상연락망 관리</h2>
<Button variant="rowAdd" onClick={addRow} aria-label="항목 추가">+ 항목추가</Button>
</div>

<div className="border rounded-xl overflow-hidden flex-1 min-h-0">
<div className="grid grid-cols-[200px_180px_1fr_56px] bg-gray-50 text-gray-700 text-sm font-medium sticky top-0 z-10">
<div className="border-r px-3 py-2">기관/역할</div>
<div className="border-r px-3 py-2">이름</div>
<div className="border-r px-3 py-2">연락처</div>
<div className="px-3 py-2 text-center">관리</div>
</div>

<div className="overflow-y-auto max-h-full">
{rows.map(row => (
<div key={row.id} className="grid grid-cols-[200px_180px_1fr_56px] border-t">
<InputCell
value={row.role}
onChange={v => updateCell(row.id, "role", v)}
placeholder="구분"
/>
<InputCell
value={row.name}
onChange={v => updateCell(row.id, "name", v)}
placeholder="담당자명"
required
/>
<InputCell
value={row.phone}
onChange={v => updateCell(row.id, "phone", v)}
placeholder="010-0000-0000"
required
isPhone
/>
<div className="px-2 py-2 flex items-center justify-center">
<button
type="button"
onClick={() => removeRow(row.id)}
className={`p-2 rounded-md ${rows.length <= 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 active:bg-gray-200"}`}
aria-label="행 삭제"
aria-disabled={rows.length <= 1}
title={rows.length <= 1 ? "최소 1개 행은 유지되어야 합니다" : "삭제"}
disabled={rows.length <= 1}
>
<Trash2 size={18} />
</button>
</div>
</div>
))}
</div>
</div>

<div className="mt-6 flex justify-center gap-1 shrink-0">
<Button variant="clear" onClick={onClose}>닫기</Button>
<Button variant="primary" onClick={handleSave}>저장하기</Button>
</div>
</div>
</div>
)
}

function InputCell({
value,
onChange,
placeholder,
required,
isPhone
}: {
value: string
onChange: (v: string) => void
placeholder?: string
required?: boolean
isPhone?: boolean
}) {
const sanitizePhone = (v: string): string => v.replace(/[^\d-]/g, "")
const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
const v = e.target.value
onChange(isPhone ? sanitizePhone(v) : v)
}
const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
if (!isPhone) return
e.preventDefault()
const text = (e.clipboardData || (window as any).clipboardData).getData("text")
onChange(sanitizePhone(text))
}
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
if (isPhone && e.key === " ") e.preventDefault()
}
return (
<div className="px-2 py-2">
<input
value={value}
onChange={handleChange}
onPaste={handlePaste}
onKeyDown={handleKeyDown}
placeholder={placeholder}
className="w-full h-[39px] px-2 border rounded-[8px] bg-white text-[#333639] text-sm md:text-[15px] font-medium placeholder:text-[#86939A] border-[#AAAAAA]"
required={required}
inputMode={isPhone ? "numeric" : undefined}
autoComplete={isPhone ? "tel" : undefined}
pattern={isPhone ? "^[0-9-]+$" : undefined}
/>
</div>
)
}