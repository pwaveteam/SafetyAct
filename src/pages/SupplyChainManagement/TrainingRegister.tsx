import React, { useState } from "react"
import Button from "@/components/common/base/Button"
import FormScreen, { Field } from "@/components/common/forms/FormScreen"
import ToggleSwitch from "@/components/common/base/ToggleSwitch"

type Props = {
isOpen: boolean
onClose: () => void
onSave: (data: {
name: string
riskAssessment: boolean
hazardousMaterial: boolean
responseManual: boolean
allSigned: boolean
updatedAt: string
proof?: File | null
remarks?: string
}) => void
}

export default function PartnerTrainingRegister({ isOpen, onClose, onSave }: Props) {
const [formData, setFormData] = useState({
name: "",
riskAssessment: false,
hazardousMaterial: false,
responseManual: false,
allSigned: false,
updatedAt: new Date().toISOString().slice(0, 10),
proof: null,
remarks: ""
})

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
const { name, type, checked, value, files } = e.target as HTMLInputElement
if (type === "checkbox") setFormData(prev => ({ ...prev, [name]: checked }))
else if (type === "file") setFormData(prev => ({ ...prev, [name]: files && files[0] ? files[0] : null }))
else setFormData(prev => ({ ...prev, [name]: value }))
}

const renderToggle = (fieldName: keyof typeof formData) => (
<ToggleSwitch checked={formData[fieldName]} onChange={checked => setFormData(prev => ({ ...prev, [fieldName]: checked }))} />
)

const fields: Field[] = [
{ label: "도급협의체명", name: "name", type: "text", placeholder: "도급협의체명을 입력하세요" },
{ label: "위험성평가 확인", name: "riskAssessment", type: "custom", customRender: renderToggle("riskAssessment") },
{ label: "유해물질 확인", name: "hazardousMaterial", type: "custom", customRender: renderToggle("hazardousMaterial") },
{ label: "대응매뉴얼 확인", name: "responseManual", type: "custom", customRender: renderToggle("responseManual") },
{ label: "최종 업데이트 일자", name: "updatedAt", type: "date" },
{ label: "첨부파일", name: "fileUpload", type: "fileUpload" },
{ label: "비고", name: "remarks", type: "textarea", placeholder: "비고를 입력하세요" }
]

const handleSave = () => {
if (!formData.name.trim()) { alert("도급협의체명을 입력하세요"); return }
if (!formData.updatedAt) { alert("최종 업데이트 일자를 입력하세요"); return }
onSave(formData)
onClose()
}

if (!isOpen) return null

return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto transform transition duration-300 ease-in-out scale-100 opacity-100">
<h2 className="text-2xl font-semibold tracking-wide mb-6">안전보건 교육/훈련 등록</h2>
<FormScreen fields={fields} values={formData} onChange={handleChange} onClose={onClose} onSave={handleSave} isModal={true} className="w-full" />
<div className="mt-6 flex justify-center gap-1">
<Button variant="clear" onClick={onClose}>닫기</Button>
<Button variant="primary" onClick={handleSave}>저장하기</Button>
</div>
</div>
</div>
)
}