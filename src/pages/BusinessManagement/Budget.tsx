import React, { useState } from "react"
import PageTitle from "@/components/common/base/PageTitle"
import TabMenu from "@/components/common/base/TabMenu"
import FilterBar from "@/components/common/base/FilterBar"
import BudgetTable, { BudgetItem } from "@/components/modules/BudgetTable"
import InspectionTable, { InspectionItem } from "@/components/modules/InspectionTable"
import Button from "@/components/common/base/Button"
import { Printer, Trash2, Save } from "lucide-react"

const TAB_LABELS = ["안전보건 목표 및 추진계획","안전보건예산"] as const

export default function Budget() {
const [activeTab,setActiveTab] = useState<number>(0)
const [startDate,setStartDate] = useState<string>("2025-01-01")
const [endDate,setEndDate] = useState<string>("2025-12-31")
const [goalFilter,setGoalFilter] = useState<string>("")

const [inspItems,setInspItems] = useState<InspectionItem[]>([
{ id: 1, corporateGoal:"", detailPlan:"정기 위험성평가", scheduleFirstHalf:true, scheduleSecondHalf:false, KPI:"1회/년 이상", department:"전부서", achievementRate:"", resultRemark:"", entryDate:"" },
{ id: 2, corporateGoal:"", detailPlan:"수시 위험성평가", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"수시", department:"전부서", achievementRate:"", resultRemark:"", entryDate:"" },
{ id: 3, corporateGoal:"", detailPlan:"고위험 개선", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"개선이행 100%", department:"전부서", achievementRate:"", resultRemark:"", entryDate:"" },
{ id: 4, corporateGoal:"", detailPlan:"아차사고수집", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"1건/월/인당", department:"안전", achievementRate:"", resultRemark:"", entryDate:"" },
{ id: 5, corporateGoal:"", detailPlan:"안전보건교육(정기)", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"12시간/반기", department:"전부서", achievementRate:"", resultRemark:"", entryDate:"" },
{ id: 6, corporateGoal:"", detailPlan:"안전보건교육(관리감독자)", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"16시간/반기", department:"안전", achievementRate:"", resultRemark:"", entryDate:"" },
{ id: 7, corporateGoal:"", detailPlan:"안전보건교육(특별안전교육)", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"16시간/반기(크레인,유해물질취급자)", department:"안전", achievementRate:"", resultRemark:"", entryDate:"" },
{ id: 8, corporateGoal:"", detailPlan:"안전보건교육(신규채용시)", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"8시간/년간(채용시)", department:"전부서", achievementRate:"", resultRemark:"", entryDate:"" },
{ id: 9, corporateGoal:"", detailPlan:"안전보건교육(MSDS)", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"2시간/년간(유해물질취급자)", department:"전부서", achievementRate:"", resultRemark:"", entryDate:"" },
{ id:10, corporateGoal:"", detailPlan:"산업안전보건위원회", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"1회/분기", department:"안전", achievementRate:"", resultRemark:"", entryDate:"" },
{ id:11, corporateGoal:"", detailPlan:"소방시설 정기점검", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"1회/월", department:"안전", achievementRate:"", resultRemark:"", entryDate:"" },
{ id:12, corporateGoal:"", detailPlan:"합동안전점검", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"1회/월", department:"안전", achievementRate:"", resultRemark:"", entryDate:"" },
{ id:13, corporateGoal:"", detailPlan:"일반 건강검진", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"관리직1회/2년, 현장직1회/1년", department:"안전", achievementRate:"", resultRemark:"", entryDate:"" },
{ id:14, corporateGoal:"", detailPlan:"특수 건강검진", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"1회/년(현장직1회/년)", department:"안전", achievementRate:"", resultRemark:"", entryDate:"" },
{ id:15, corporateGoal:"", detailPlan:"배치전 건강검진", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"해당시", department:"안전", achievementRate:"", resultRemark:"", entryDate:"" },
{ id:16, corporateGoal:"", detailPlan:"비상조치훈련", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"1회/분기(화재, 누출, 대피, 구조)", department:"전부서", achievementRate:"", resultRemark:"", entryDate:"" },
{ id:17, corporateGoal:"", detailPlan:"작업허가서 발부", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"단위 작업별", department:"전부서", achievementRate:"", resultRemark:"", entryDate:"" },
{ id:18, corporateGoal:"", detailPlan:"TBM 실시", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"단위 작업별", department:"전부서", achievementRate:"", resultRemark:"", entryDate:"" },
{ id:19, corporateGoal:"", detailPlan:"안전관리제도 운영", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"1건/월/인당", department:"전부서", achievementRate:"", resultRemark:"", entryDate:"" },
{ id:20, corporateGoal:"", detailPlan:"안전보건 예산 집행", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"수립예산 이행", department:"전부서", achievementRate:"", resultRemark:"", entryDate:"" },
{ id:21, corporateGoal:"", detailPlan:"성과측정 및 모니터링", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"1회/반기", department:"전부서", achievementRate:"", resultRemark:"", entryDate:"" },
{ id:22, corporateGoal:"", detailPlan:"시정조치 이행", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"수시", department:"전부서", achievementRate:"", resultRemark:"", entryDate:"" }
])

const handleInspChange = (id:number, field:keyof Omit<InspectionItem,"id">, value:string|boolean) => {
setInspItems(items => items.map(item => item.id === id ? { ...item, [field]: value } : item))
}
const handleInspAdd = () => {
const nextId = Math.max(...inspItems.map(i=>i.id),0) + 1
setInspItems(prev => [...prev, { id: nextId, corporateGoal:"", detailPlan:"", scheduleFirstHalf:false, scheduleSecondHalf:false, KPI:"", department:"", achievementRate:"", resultRemark:"", entryDate:new Date().toISOString().slice(0,10) }])
}
const handleInspSave = () => alert("목표 및 추진계획이 저장되었습니다")
const handleInspPrint = () => window.print()
const handleInspDelete = () => setInspItems(prev => prev.slice(0,-1))

const [budgetItems,setBudgetItems] = useState<BudgetItem[]>([
{ id: 1, year:"2025", itemName:"밀폐공간 진입 안전교육", category:"작업 전 밀폐공간 위험요인 교육", budget:"50000000", spent:"20000000", remaining:"30000000", carryOver:false, attachment:null, author:"김안전", entryDate:"2025-01-10" },
{ id: 2, year:"2025", itemName:"고소작업 장비 점검", category:"안전대 및 보호장비 정기점검 실시", budget:"30000000", spent:"15000000", remaining:"15000000", carryOver:false, attachment:null, author:"이설비", entryDate:"2025-02-20" },
{ id: 3, year:"2025", itemName:"비상대응 시나리오 훈련", category:"전사 비상대응 매뉴얼 체계적 훈련", budget:"25000000", spent:"10000000", remaining:"15000000", carryOver:false, attachment:null, author:"박교육", entryDate:"2025-03-15" },
{ id: 4, year:"2025", itemName:"화학물질 취급 교육", category:"유해물질 안전취급 절차 심화교육", budget:"20000000", spent:"8000000", remaining:"12000000", carryOver:false, attachment:null, author:"최장비", entryDate:"2025-04-05" },
{ id: 5, year:"2025", itemName:"현장 순찰 보안 강화", category:"주간 및 야간 순찰 보안 점검 강화", budget:"15000000", spent:"5000000", remaining:"10000000", carryOver:false, attachment:null, author:"정안전", entryDate:"2025-05-22" }
])
const handleBudgetChange = (id:number, field:keyof Omit<BudgetItem,"id"|"year">, value:string|boolean) => {
setBudgetItems(items => items.map(item => {
if(item.id!==id) return item
const next = { ...item, [field]: value }
if(field==="budget"||field==="spent"){
const b = parseInt(next.budget.replace(/[^0-9]/g,""),10)||0
const s = parseInt(next.spent.replace(/[^0-9]/g,""),10)||0
next.remaining = Math.max(0,b-s).toString()
if(next.remaining==="0") next.carryOver = false
}
return next
}))
}
const handleBudgetAdd = () => {
const nextId = Math.max(...budgetItems.map(i=>i.id),0)+1
setBudgetItems(prev=>[...prev,{
id: nextId, year: startDate.slice(0,4), itemName:"", category:"", budget:"0", spent:"0", remaining:"0", carryOver:false, attachment:null, author:"", entryDate:new Date().toISOString().slice(0,10)
}])
}
const handleBudgetDelete = () => setBudgetItems(prev => prev.slice(0,-1))
const handleBudgetSave = () => alert("안전보건예산이 저장되었습니다")
const handleBudgetPrint = () => window.print()

return (
<section className="mypage-content w-full bg-white">
<PageTitle>{TAB_LABELS[activeTab]}</PageTitle>
<TabMenu tabs={TAB_LABELS} activeIndex={activeTab} onTabClick={setActiveTab} className="mb-6" />
<FilterBar startDate={startDate} endDate={endDate} onStartDate={setStartDate} onEndDate={setEndDate} onSearch={()=>{}} />
<div className="flex justify-end mb-3 gap-1">
<Button variant="action" onClick={() => alert("PDF 다운로드")} className="flex items-center gap-1"><Save size={16} />다운로드</Button>
<Button variant="action" onClick={activeTab === 0 ? handleInspPrint : handleBudgetPrint} className="flex items-center gap-1"><Printer size={16} />인쇄</Button>
<Button variant="action" onClick={activeTab === 0 ? handleInspDelete : handleBudgetDelete} className="flex items-center gap-1"><Trash2 size={16} />삭제</Button>
</div>
{activeTab===0
? <InspectionTable items={inspItems} onChangeField={handleInspChange} onAdd={handleInspAdd} onSave={handleInspSave} onPrint={handleInspPrint} />
: <BudgetTable items={budgetItems} onChangeField={handleBudgetChange} onAdd={handleBudgetAdd} onDelete={handleBudgetDelete} onSave={handleBudgetSave} onPrint={handleBudgetPrint} />
}
</section>
)
}