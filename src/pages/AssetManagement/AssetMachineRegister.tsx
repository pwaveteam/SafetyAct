import React, {useCallback, useMemo, useState} from "react";
import Button from "@/components/common/base/Button";
import FormScreen, {Field} from "@/components/common/forms/FormScreen";
import ToggleSwitch from "@/components/common/base/ToggleSwitch";
import MachineAutocomplete from "@/components/common/inputs/MachineAutocomplete";

type AlertWhen="1일 전"|"1주일 전"|"1개월 전";
type Props={isOpen:boolean;onClose:()=>void;onSave:(data:FormDataState)=>void};
type FormDataState={
name:string;capacityValue:string;capacityUnit:string;quantity:string;location:string;inspectionCycle:string;inspectionDate:string;purpose:string;proof:File|null;notify:boolean;notifyWhen:AlertWhen
};

type Option={value:string;label:string};
const unitOptions:Option[]=[
{value:"bar",label:"bar"},
{value:"kg",label:"kg"},
{value:"ton",label:"ton"},
{value:"m³",label:"m³"},
{value:"L",label:"L"}
];
const inspectionCycleOptions:Option[]=[
{value:"상시",label:"상시"},
{value:"주간",label:"주간"},
{value:"월간",label:"월간"},
{value:"분기",label:"분기"},
{value:"연간",label:"연간"}
];
const alertTimingOptions:Option[]=[
{value:"1일 전",label:"1일 전"},
{value:"1주일 전",label:"1주일 전"},
{value:"1개월 전",label:"1개월 전"}
];

export default function AssetMachineRegister({isOpen,onClose,onSave}:Props):React.ReactElement|null{
const [formData,setFormData]=useState<FormDataState>({name:"",capacityValue:"",capacityUnit:"bar",quantity:"",location:"",inspectionCycle:"상시",inspectionDate:"",purpose:"",proof:null,notify:false,notifyWhen:"1주일 전"});
const numericNames=useMemo(()=>new Set(["quantity","capacity_value"]),[]);

const handleChange=useCallback((e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>):void=>{
const {name,value,type,checked,files}=e.target as HTMLInputElement;
if(numericNames.has(name)&&value!==""&&!/^\d*\.?\d*$/.test(value))return;
if(type==="checkbox"){setFormData(prev=>({...prev,[name]:checked}));return}
if(type==="file"){if(name==="fileUpload"){setFormData(prev=>({...prev,proof:files?.[0]??null}))}return}
if(name==="capacity_value"){setFormData(prev=>({...prev,capacityValue:value}));return}
if(name==="capacity_unit"){setFormData(prev=>({...prev,capacityUnit:value}));return}
setFormData(prev=>({...prev,[name]:value}));
},[numericNames]);

const fields:Field[]=[
{
label:"기계/기구/설비명",
name:"name",
type:"custom",
customRender:(
<MachineAutocomplete
id="machineName"
value={formData.name}
placeholder="기계명 입력 또는 선택"
onChange={(v)=>setFormData(prev=>({...prev,name:v}))}
onSelect={(opt)=>setFormData(prev=>({...prev,name:opt.label}))}
className="w-full"
/>
)
},
{label:"용량/단위",name:"capacity",type:"quantityUnit",placeholder:"용량 입력",options:unitOptions},
{label:"수량",name:"quantity",type:"quantity",placeholder:"수량 입력"},
{label:"설치/작업장소",name:"location",type:"text",placeholder:"장소 입력"},
{label:"점검일",name:"inspectionDate",type:"date",placeholder:"점검일 선택"},
{label:"용도",name:"purpose",type:"text",placeholder:"용도 입력"},
{label:"점검주기",name:"inspectionCycle",type:"select",options:inspectionCycleOptions,placeholder:"점검주기 선택"},
{label:"알림 전송여부",name:"notify",type:"custom",customRender:(<ToggleSwitch checked={formData.notify} onChange={(checked)=>setFormData(prev=>({...prev,notify:checked}))}/>)},
{label:"알림 발송시점",name:"notifyWhen",type:"select",options:alertTimingOptions,placeholder:"알림 발송시점 선택"},
{label:"첨부파일",name:"fileUpload",type:"fileUpload"}
];

if(!isOpen)return null;

const valuesForForm:{[key:string]:string}={
name:formData.name,
capacity_value:formData.capacityValue,
capacity_unit:formData.capacityUnit,
quantity:formData.quantity,
location:formData.location,
inspectionDate:formData.inspectionDate,
purpose:formData.purpose,
inspectionCycle:formData.inspectionCycle,
fileUpload:formData.proof?.name??"",
notify:formData.notify?"true":"",
notifyWhen:formData.notifyWhen
};

return(
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
<h2 className="text-2xl font-semibold tracking-wide mb-3">위험기계/기구/설비 등록</h2>
<FormScreen
fields={fields}
values={valuesForForm}
onChange={handleChange}
onClose={onClose}
onSave={()=>onSave(formData)}
isModal
notifyEnabled={formData.notify}
/>
<div className="mt-6 flex justify-center gap-1">
<Button variant="clear" onClick={onClose}>닫기</Button>
<Button variant="primary" onClick={()=>onSave(formData)}>저장하기</Button>
</div>
</div>
</div>
);
}