import React from "react"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import Button from "@/components/common/base/Button"
import EditableCell from "@/components/common/inputs/EditableCell"
import Checkbox from "@/components/common/base/Checkbox"
import DatePicker from "@/components/common/inputs/DatePicker"

export type InspectionItem = {
id: number
corporateGoal: string
detailPlan: string
scheduleQ1: boolean
scheduleQ2: boolean
scheduleQ3: boolean
scheduleQ4: boolean
KPI: string
department: string
achievementRate: string
resultRemark: string
entryDate: string
}

interface InspectionTableProps {
items: InspectionItem[]
onChangeField: (id: number, field: keyof InspectionItem, value: string | boolean) => void
onAdd: () => void
onSave: () => void
onPrint: () => void
}

const InspectionTable: React.FC<InspectionTableProps> = ({ items, onChangeField, onAdd, onSave, onPrint }) => {
const columns: Column[] = [
{ key: "detailPlan", label: "목표/세부추진계획", minWidth: 200 },
{ key: "scheduleQ1", label: "1분기", minWidth: 33 },
{ key: "scheduleQ2", label: "2분기", minWidth: 33 },
{ key: "scheduleQ3", label: "3분기", minWidth: 33 },
{ key: "scheduleQ4", label: "4분기", minWidth: 33 },
{ key: "KPI", label: "성과지표", minWidth: 190 },
{ key: "department", label: "담당부서", minWidth: 100 },
{ key: "achievementRate", label: "달성률%", minWidth: 100 },
{ key: "resultRemark", label: "실적/부진사유", minWidth: 200 },
{ key: "entryDate", label: "작성일", minWidth: 120 },
]

return (
<div className="inspection-table">
<DataTable
columns={columns}
data={items}
renderCell={(row: DataRow, col: Column) => {
const item = row as InspectionItem
if (col.key.startsWith("scheduleQ")) return (
<Checkbox
checked={item[col.key as keyof InspectionItem] as boolean}
onChange={() => onChangeField(item.id, col.key as keyof InspectionItem, !(item[col.key as keyof InspectionItem] as boolean))}
/>
)
if (col.key === "entryDate") return <DatePicker value={item.entryDate} onChange={date => onChangeField(item.id, "entryDate", date)} />
const key = col.key as keyof InspectionItem
return <EditableCell value={String(item[key])} onChange={v => onChangeField(item.id, key, v)} placeholder={col.label} parentWidth={(col.minWidth as number) * 0.95} maxLength={100} />
}}
/>
<div className="mt-3 flex justify-between items-center">
<Button variant="rowAdd" onClick={onAdd}>+ 점검항목추가</Button>
<Button variant="primary" onClick={onSave}>저장하기</Button>
</div>
</div>
)
}

export default InspectionTable