import React, {useCallback, useState} from "react";
import Button from "@/components/common/base/Button";
import FormScreen, {Field} from "@/components/common/forms/FormScreen";
import ToggleSwitch from "@/components/common/base/ToggleSwitch";
import RadioGroup from "@/components/common/base/RadioGroup";
import ChemicalAutocomplete from "@/components/common/inputs/ChemicalAutocomplete";

type Props={isOpen:boolean;onClose:()=>void;onSave:(data:FormDataState)=>void};
type FormDataState={
chemicalName:string;casNo:string;
exposureLimitValue:string;exposureLimitUnit:string;
dailyUsageValue:string;dailyUsageUnit:string;
storageAmountValue:string;storageAmountUnit:string;
corrosive:"예"|"아니오";toxicity:string;adverseReaction:string;
registrationDate:string;inspectionCycle:string;
msds:File|null;note:string;notify:boolean;notifyWhen:"1일 전"|"1주일 전"|"1개월 전"
};

export default function AssetHazardRegister({isOpen,onClose,onSave}:Props):React.ReactElement{
const [formData,setFormData]=useState<FormDataState>({
chemicalName:"",casNo:"",
exposureLimitValue:"",exposureLimitUnit:"",
dailyUsageValue:"",dailyUsageUnit:"",
storageAmountValue:"",storageAmountUnit:"",
corrosive:"예",toxicity:"",adverseReaction:"",
registrationDate:"",inspectionCycle:"",
msds:null,note:"",notify:false,notifyWhen:"1일 전"
});

const handleChange=useCallback((e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>):void=>{
const {name,value,type,checked,files}=e.target as HTMLInputElement;
if(name.endsWith("Value")&&value!==""&&!/^\d*\.?\d*$/.test(value))return;
if(type==="checkbox")setFormData(prev=>({...prev,[name]:checked}));
else if(type==="file")setFormData(prev=>({...prev,msds:files?.[0]??null}));
else setFormData(prev=>({...prev,[name]:value}));
},[]);

const concentrationUnits:{value:string;label:string}[]=[
{value:"ppb",label:"ppb"},{value:"ppm",label:"ppm"},
{value:"mg/m³",label:"mg/m³"},{value:"µg/m³",label:"µg/m³"},
{value:"mg/L",label:"mg/L"},{value:"µg/L",label:"µg/L"}
];
const usageUnits:{value:string;label:string}[]=[
{value:"µL",label:"µL"},{value:"mL",label:"mL"},{value:"L",label:"L"},
{value:"cm³",label:"cm³"},{value:"m³",label:"m³"},
{value:"µg",label:"µg"},{value:"mg",label:"mg"},{value:"g",label:"g"},{value:"kg",label:"kg"}
];
const storageUnits:{value:string;label:string}[]=[
{value:"ng",label:"ng"},{value:"µg",label:"µg"},{value:"mg",label:"mg"},
{value:"g",label:"g"},{value:"kg",label:"kg"},{value:"t",label:"t"},
{value:"µL",label:"µL"},{value:"mL",label:"mL"},{value:"L",label:"L"},
{value:"cm³",label:"cm³"},{value:"m³",label:"m³"}
];
const inspectionCycleOptions:{value:string;label:string}[]=[
{value:"상시",label:"상시"},{value:"주간",label:"주간"},
{value:"월간",label:"월간"},{value:"분기",label:"분기"},{value:"연간",label:"연간"}
];
const alertTimingOptions:{value:string;label:string}[]=[
{value:"1일 전",label:"1일 전"},{value:"1주일 전",label:"1주일 전"},{value:"1개월 전",label:"1개월 전"}
];

const fields:Field[]=[
{
label:"화학물질명",
name:"chemicalName",
type:"custom",
customRender:(
<ChemicalAutocomplete
id="chemicalName"
value={formData.chemicalName}
placeholder="화학물질명 입력 또는 선택"
onChange={(v)=>setFormData(prev=>({...prev,chemicalName:v}))}
onSelect={(opt)=>setFormData(prev=>({...prev,chemicalName:opt.label}))}
className="w-full"
/>
)
},
{label:"CAS No",name:"casNo",type:"text",placeholder:"CAS No 입력"},
{label:"노출기준",name:"exposureLimit",type:"quantityUnit",placeholder:"0",options:concentrationUnits},
{label:"일일사용량",name:"dailyUsage",type:"quantityUnit",placeholder:"0",options:usageUnits},
{label:"저장량",name:"storageAmount",type:"quantityUnit",placeholder:"0",options:storageUnits},
{label:"부식성 유무",name:"corrosive",type:"custom",customRender:(<RadioGroup name="corrosive" value={formData.corrosive} options={[{value:"예",label:"예"},{value:"아니오",label:"아니오"}]} onChange={handleChange}/>)},
{label:"독성치",name:"toxicity",type:"text",placeholder:"독성치 입력"},
{label:"이상반응",name:"adverseReaction",type:"text",placeholder:"이상반응 입력"},
{label:"등록일",name:"registrationDate",type:"date",placeholder:"등록일 선택"},
{label:"점검주기",name:"inspectionCycle",type:"select",options:inspectionCycleOptions,placeholder:"점검주기 선택"},
{label:"알림 전송여부",name:"notify",type:"custom",customRender:(<ToggleSwitch checked={formData.notify} onChange={(checked)=>setFormData(prev=>({...prev,notify:checked}))}/>)},
{label:"알림 발송시점",name:"notifyWhen",type:"select",options:alertTimingOptions,placeholder:"알림 발송시점 선택"},
{label:"첨부파일 (MSDS)",name:"msds",type:"fileUpload"}
];

if(!isOpen)return null;

const valuesForForm:{[key:string]:string}={
chemicalName:formData.chemicalName,
casNo:formData.casNo,
exposureLimit_value:formData.exposureLimitValue,
exposureLimit_unit:formData.exposureLimitUnit,
dailyUsage_value:formData.dailyUsageValue,
dailyUsage_unit:formData.dailyUsageUnit,
storageAmount_value:formData.storageAmountValue,
storageAmount_unit:formData.storageAmountUnit,
corrosive:formData.corrosive,
toxicity:formData.toxicity,
adverseReaction:formData.adverseReaction,
registrationDate:formData.registrationDate,
inspectionCycle:formData.inspectionCycle,
msds:formData.msds?.name??"",
note:formData.note,
notify:formData.notify?"true":"",
notifyWhen:formData.notifyWhen
};

return(
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="bg-white rounded-2xl w-[800px] max-w-full p-8 shadow-2xl max-h-[80vh] overflow-y-auto">
<h2 className="text-2xl font-semibold tracking-wide mb-3">유해/위험물질 등록</h2>
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