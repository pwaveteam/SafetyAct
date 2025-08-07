import React, { useState } from "react"
import Button from "@/components/common/base/Button"
import FormScreen, { Field } from "@/components/common/forms/FormScreen"
import ToggleSwitch from "@/components/common/base/ToggleSwitch"

type Props = { isOpen: boolean; onClose: () => void; onSave: (data: any) => void }

const unitOptions = [
{ value: "bar", label: "bar" },
{ value: "kg", label: "kg" },
{ value: "ton", label: "ton" },
{ value: "m³", label: "m³" },
{ value: "L", label: "L" }
]
const inspectionCycleOptions = [
{ value: "상시", label: "상시" },
{ value: "주간", label: "주간" },
{ value: "월간", label: "월간" },
{ value: "분기", label: "분기" },
{ value: "연간", label: "연간" }
]

const alertTimingOptions = [
{ value: "1일 전", label: "1일 전" },
{ value: "1주일 전", label: "1주일 전" },
{ value: "1개월 전", label: "1개월 전" }
]


export default function AssetMachineRegister({ isOpen, onClose, onSave }: Props) {
const [formData, setFormData] = useState({
name: "", capacityValue: "", capacityUnit: "bar", quantity: "", location: "",
inspectionCycle: "상시", inspectionDate: "", purpose: "", proof: null as File | null,
notify: false, notifyWhen: "1주일 전"
})

const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => {
const { name, value, type, checked, files } = e.target
if ((name === "quantity" || name === "capacityValue") && value !== "") {
if (!/^\d*\.?\d*$/.test(value)) return }
if (type === "checkbox") setFormData(prev => ({ ...prev, [name]: checked }))
else if (type === "file") {
const fileInput = e.target as HTMLInputElement
setFormData(prev => ({ ...prev, proof: fileInput.files ? fileInput.files[0] : null }))
} else setFormData(prev => ({ ...prev, [name]: value }))
}

const fields: Field[] = [
{ label: "기계/기구/설비명", name: "name", type: "autocomplete", placeholder: "기계명 검색 또는 입력" },
{ label: "용량/단위", name: "capacity", type: "quantityUnit", placeholder: "용량 입력", options: unitOptions },
{ label: "수량", name: "quantity", type: "quantity", placeholder: "수량 입력" },
{ label: "설치/작업장소", name: "location", type: "text", placeholder: "장소 입력" },
{ label: "점검일", name: "inspectionDate", type: "date", placeholder: "점검일 선택" },
{ label: "용도", name: "purpose", type: "text", placeholder: "용도 입력", required: false },
{ label: "점검주기", name: "inspectionCycle", type: "select", options: inspectionCycleOptions, placeholder: "점검주기 선택" },
{ label: "알림 전송여부", name: "notify", type: "custom", customRender: (
<ToggleSwitch checked={formData.notify} onChange={checked => setFormData(prev => ({ ...prev, notify: checked }))} />
) },
{ label: "알림 발송시점", name: "notifyWhen", type: "select", options: alertTimingOptions, placeholder: "알림 발송시점 선택" },
{ label: "첨부파일", name: "fileUpload", type: "fileUpload" }
]

const handleSave = () => { onSave(formData) }

if (!isOpen) return null

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto transform transition duration-300 ease-in-out scale-100 opacity-100">
<h2 className="text-2xl font-semibold tracking-wide mb-3">위험기계/기구/설비 등록</h2>
<FormScreen fields={fields} values={formData} onChange={handleChange} onClose={onClose} onSave={handleSave} isModal={true} notifyEnabled={formData.notify} />
<div className="mt-6 flex justify-center gap-1">
<Button variant="clear" onClick={onClose}>닫기</Button>
<Button variant="primary" onClick={handleSave}>저장하기</Button>
</div>
</div>
</div>
)
}