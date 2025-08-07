import React,{useState,useRef} from "react"
import DataTable,{Column,DataRow} from "@/components/common/tables/DataTable"
import Button from "@/components/common/base/Button"
import PageTitle from "@/components/common/base/PageTitle"
import TabMenu from "@/components/common/base/TabMenu"
import OrganizationTree,{OrgNode} from "@/components/modules/OrganizationTree"
import StaffRegisterModal from "./StaffRegister"
import { CirclePlus, QrCode, Printer, Trash2, Image, Upload, Save } from "lucide-react"

type Staff={id:number,name:string,safetyPosition:string,department:string,position:string,phone:string,entryDate:string,assignDate:string}

const positionOptions=["대표이사","부장","차장","과장","반장"]

const safetyPositionOptions=["경영책임자","안전보건관리책임자","안전관리자","보건관리자","관리감독자","해당없음"]

const columns:Column[]=[
{key:"name",label:"이름",minWidth:100},
{key:"safetyPosition",label:"안전직위",minWidth:150},
{key:"department",label:"부서",minWidth:120},
{key:"position",label:"직급",minWidth:120},
{key:"phone",label:"연락처",minWidth:130},
{key:"entryDate",label:"입사일",minWidth:100},
{key:"assignDate",label:"안전직위 지정일",minWidth:100},
{key:"manage",label:"관리",minWidth:110,renderCell:(row)=>(
<button
style={{background:"none",border:"none",padding:0,color:"#999999",cursor:"pointer",width:110,textAlign:"center"}}
onMouseEnter={e=>(e.currentTarget.style.textDecoration="underline")}
onMouseLeave={e=>(e.currentTarget.style.textDecoration="none")}
>자세히보기/편집</button>
)},
]

const initialStaffs:Staff[]=[
{id:1,name:"박대표",safetyPosition:"경영책임자",department:"경영지원팀",position:"대표이사",phone:"010-1234-5678",entryDate:"-",assignDate:"2022-01-10"},
{id:2,name:"최책임",safetyPosition:"안전보건관리책임자",department:"생산관리팀",position:"부장",phone:"010-3333-7777",entryDate:"2021-05-10",assignDate:"2022-03-10"},
{id:3,name:"김근로",safetyPosition:"-",department:"품질관리팀",position:"반장",phone:"010-6660-8989",entryDate:"2023-10-10",assignDate:"-"},
{id:4,name:"박안전",safetyPosition:"안전관리자",department:"안전관리팀",position:"과장",phone:"010-8888-1234",entryDate:"2020-08-15",assignDate:"2020-09-01"},
{id:5,name:"이보건",safetyPosition:"보건관리자",department:"보건팀",position:"주임",phone:"010-5555-4321",entryDate:"2019-11-20",assignDate:"2019-12-10"},
]

const orgTreeData:OrgNode[]=[
{id:"1",title:"경영책임자",name:"박대표",position:"대표이사",children:[
{id:"2",title:"안전보건관리책임자",name:"최책임",position:"차장",children:[
{id:"3",title:"안전관리자",name:"박안전",position:"과장"},
{id:"4",title:"보건관리자",name:"김보건",position:"주임"},
{id:"5",title:"관리감독자",name:"최반장",position:"반장"},
{id:"6",title:"관리감독자",name:"김반장",position:"반장"},
{id:"7",title:"관리감독자",name:"조반장",position:"반장"},
]}]},
]

const Organization:React.FC=()=>{
const [staffs,setStaffs]=useState<Staff[]>(initialStaffs)
const [selectedIds,setSelectedIds]=useState<(number|string)[]>([])
const [modalOpen,setModalOpen]=useState(false)
const fileInputRef=useRef<HTMLInputElement|null>(null)

const handleAddStaffClick=()=>setModalOpen(true)

const handleSaveStaff=(staff:Omit<Staff,"id">)=>{
setStaffs(prev=>[...prev,{...staff,id:Date.now()}])
setModalOpen(false)
}

const handleDeleteSelected=()=>{
if(selectedIds.length===0){alert("삭제할 항목을 선택하세요");return}
if(window.confirm("정말 삭제하시겠습니까?")){
setStaffs(prev=>prev.filter(s=>!selectedIds.includes(s.id)))
setSelectedIds([])
}
}

const handlePrint=()=>window.print()

const handleImageSave=()=>alert("안전조직도 이미지 저장이 완료되었습니다.")

const handleUploadFileClick=()=>fileInputRef.current?.click()

const handleFileChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
if(e.target.files&&e.target.files.length>0){
alert(`선택된 파일: ${e.target.files[0].name}`)
}
}

const data:DataRow[]=staffs.map(s=>({
id:s.id,name:s.name,safetyPosition:s.safetyPosition,department:s.department,
position:s.position,phone:s.phone,entryDate:s.entryDate,assignDate:s.assignDate,
}))

return(
<section className="mypage-content w-full">
<PageTitle>전체인력관리</PageTitle>
<TabMenu tabs={["전체인력 목록"]} activeIndex={0} onTabClick={()=>{}} className="mb-6"/>
<div className="flex justify-end gap-1 mb-3">
<Button variant="action" onClick={handleAddStaffClick} className="flex items-center gap-1"><CirclePlus size={16}/>인력추가</Button>
<Button variant="action" onClick={() => alert("PDF 다운로드")} className="flex items-center gap-1"><Save size={16} />다운로드</Button>
<Button variant="action" onClick={handlePrint} className="flex items-center gap-1"><Printer size={16}/>인쇄</Button>
<Button variant="action" onClick={handleDeleteSelected} className="flex items-center gap-1"><Trash2 size={16}/>삭제</Button>
</div>
<DataTable columns={columns} data={data} onCheckedChange={setSelectedIds}/>
<div className="flex justify-end mt-3 mb-6">
<Button variant="primary" onClick={()=>alert("저장")}>저장하기</Button>
</div>
<PageTitle>안전조직도</PageTitle>
<div className="flex justify-end gap-1 mb-3">
<Button variant="action" onClick={handleUploadFileClick} className="flex items-center gap-1"><Upload size={16}/>조직도 등록</Button>
<input type="file" accept=".hwp,.doc,.docx,.pdf" ref={fileInputRef} className="hidden" onChange={handleFileChange}/>
<Button variant="action" onClick={()=>alert("QR 생성")} className="flex items-center gap-1"><QrCode size={16}/>QR 생성</Button>
<Button variant="action" onClick={handleImageSave} className="flex items-center gap-1"><Image size={16}/>이미지로 저장</Button>
</div>
<div style={{display:"flex",justifyContent:"center",width:"100%",backgroundColor:"#fff",padding:24,borderRadius:8}}>
<div style={{width:"80%"}}><OrganizationTree data={orgTreeData}/></div>
</div>
<StaffRegisterModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} onSave={handleSaveStaff}/>
</section>
)}

export default Organization