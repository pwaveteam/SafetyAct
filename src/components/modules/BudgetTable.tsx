// src/components/common/BudgetTable.tsx
import React from "react";
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable";
import Button from "@/components/common/base/Button";
import EditableCell from "@/components/common/inputs/EditableCell";
import ToggleSwitch from "@/components/common/base/ToggleSwitch";
import DatePicker from "@/components/common/inputs/DatePicker";
import { Upload } from "lucide-react";

export type BudgetItem = {
id: number;
year: string;
itemName: string;
category: string;
budget: string;
spent: string;
remaining: string;
carryOver: boolean;
attachment: React.ReactNode | null;
author: string;
entryDate: string;
};

interface BudgetTableProps {
items: BudgetItem[];
onChangeField: (
id: number,
field: keyof Omit<BudgetItem, "id" | "year">,
value: string | boolean
) => void;
onAdd: () => void;
onDelete: () => void;
onSave: () => void;
onPrint: () => void;
}

const BudgetTable: React.FC<BudgetTableProps> = ({
items,
onChangeField,
onAdd,
onDelete,
onSave,
onPrint,
}) => {
const formatNumber = (raw: string) => {
const num = parseInt(raw.replace(/[^0-9]/g, ""), 10);
return isNaN(num) ? "" : num.toLocaleString();
};

const columns: Column[] = [
{ key: "itemName",   label: "항목명",     minWidth: 230 },
{ key: "category",   label: "구분",       minWidth: 330 },
{ key: "budget",     label: "예산액",     minWidth: 100 },
{ key: "spent",      label: "집행액",     minWidth: 100 },
{ key: "remaining",  label: "남은예산",   minWidth: 100 },
{ key: "carryOver",  label: "이월여부",   minWidth: 80  },
{ key: "attachment", label: "첨부파일",   minWidth: 60  },
{ key: "author",     label: "작성자",     minWidth: 60  },
{ key: "entryDate",  label: "작성일",     minWidth: 150 },
];

return (
<>

<DataTable
columns={columns}
data={items}
renderCell={(row: DataRow, col: Column) => {
const item = row as BudgetItem;
switch (col.key) {
case "itemName":
case "category":
case "author":
return (
<EditableCell
value={item[col.key] as string}
onChange={v =>
onChangeField(
item.id,
col.key as keyof Omit<BudgetItem, "id" | "year">,
v
)
}
placeholder={col.label}
parentWidth={(col.minWidth as number) * 0.95}
maxLength={50}
/>
);

case "budget":
case "spent":
case "remaining":
return (
<EditableCell
value={formatNumber(item[col.key] as string)}
onChange={v => {
const raw = v.replace(/,/g, "");
onChangeField(
item.id,
col.key as keyof Omit<BudgetItem, "id" | "year">,
raw
);
}}
placeholder="0"
parentWidth={(col.minWidth as number) * 0.9}
maxLength={12}
onlyNumber
suffix="원"
/>
);

case "carryOver":
return (
<ToggleSwitch
checked={item.carryOver}
onChange={v => onChangeField(item.id, "carryOver", v)}
/>
);

case "attachment":
return (
<div className="flex justify-center">
<Upload
size={18}
role="button"
tabIndex={0}
className="cursor-pointer"
onClick={() => {}}
/>
</div>
);

case "entryDate":
return (
<DatePicker
value={item.entryDate}
onChange={date =>
onChangeField(item.id, "entryDate", date)
}
/>
);

default:
return null;
}
}}
/>

<div className="mt-3 flex justify-between items-center">
<Button variant="rowAdd" onClick={onAdd}>+ 예산추가</Button>
<Button variant="primary" onClick={onSave}>저장하기</Button>
</div>
</>
);
};

export default BudgetTable;