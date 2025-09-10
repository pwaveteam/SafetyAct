import React,{useState,useCallback}from"react"
import{NavLink,useNavigate}from"react-router-dom"
import logo from"../../assets/logo.png"
import { PanelRightClose, PanelRightOpen } from "lucide-react"
import {
ArrowRightOnRectangleIcon,
ArrowTopRightOnSquareIcon,
Cog6ToothIcon,
Bars3Icon,
XMarkIcon
} from "@heroicons/react/20/solid"
import {
DocumentTextIcon,
ClipboardDocumentListIcon,
QrCodeIcon,
BellAlertIcon,
ClipboardDocumentCheckIcon,
ArchiveBoxIcon,
BookOpenIcon,
UserGroupIcon,
ShieldCheckIcon,
ExclamationTriangleIcon
} from "@heroicons/react/24/outline"

interface MenuItem{label:string;path:string;Icon?:React.ComponentType<React.SVGProps<SVGSVGElement>>}
interface SidebarProps{companyName?:string;adminName?:string}

const businessSubMenu:MenuItem[]=[{label:"기본사업장관리",path:"/business-management/basic"},{label:"경영방침",path:"/business-management/policy-goal"},{label:"예산/목표",path:"/business-management/budget"},{label:"조직도",path:"/business-management/organization"}]
const safetySubMenu:MenuItem[]=[{label:"위험성평가",path:"/risk-assessment"},{label:"TBM",path:"/tbm",Icon:DocumentTextIcon},{label:"아차사고",path:"/nearmiss",Icon:ClipboardDocumentListIcon},{label:"안전교육",path:"/safety-education",Icon:BookOpenIcon},{label:"자산관리",path:"/asset-management",Icon:ArchiveBoxIcon},{label:"안전작업허가서",path:"/safety-work-permit",Icon:ClipboardDocumentCheckIcon},{label:"도급협의체관리",path:"/supply-chain-management",Icon:UserGroupIcon}]
const infoSubMenu:MenuItem[]=[{label:"대응매뉴얼",path:"/response-manual",Icon:ShieldCheckIcon},{label:"공지/게시판",path:"/notice-board",Icon:ExclamationTriangleIcon},{label:"결재함",path:"/approval-box",Icon:BellAlertIcon},{label:"QR관리",path:"/qr-management",Icon:QrCodeIcon}]
const supportMenu:MenuItem[]=[{label:"마이페이지",path:"/mypage"},{label:"1:1 지원",path:"/support"},{label:"사용가이드",path:"https://www.notion.so/"}]

const Sidebar:React.FC<SidebarProps>=({companyName="펄스웨이브",adminName="이동현"})=>{
const[isOpen,setIsOpen]=useState<boolean>(false)
const[isDesktopOpen,setIsDesktopOpen]=useState<boolean>(true)
const navigate=useNavigate()
const categoryTextColor="#6B7280"
const DESKTOP_W=230

const handleLogout=useCallback(()=>{try{localStorage.removeItem("accessToken");sessionStorage.removeItem("accessToken")}catch(_){}setIsOpen(false);alert("로그아웃되었습니다. 로그인 페이지로 이동합니다.");navigate("/login")},[navigate])

return(<>
{!isOpen&&(<header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur border-b border-[#E6EAF0] flex items-center px-4 md:hidden z-50"><button type="button" aria-label="메뉴 열기" onClick={()=>setIsOpen(true)} className="rounded-md text-[#334155] hover:text-[#1C56D3] transition-colors duration-300"><Bars3Icon className="w-6 h-6"/></button><img src={logo} alt={`${companyName} logo`} className="w-[160px] cursor-pointer mx-auto max-w-[calc(100%-48px)]" onClick={()=>navigate("/dashboard")}/></header>)}
{isOpen&&(<div onClick={()=>setIsOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden"/>)}
<aside className={`fixed inset-y-0 left-0 bg-[#ffffff] text-[#232B3A] border-r border-[#E6EAF0] z-50 transition-transform duration-500 ease-out ${isOpen?"translate-x-0":"-translate-x-full"} ${isDesktopOpen?"md:translate-x-0":"md:-translate-x-full"}`} style={{width:DESKTOP_W}}>
<div className="h-screen flex flex-col overflow-hidden">
<div className="md:hidden relative flex flex-col p-5 border-b border-[#E6EAF0]">
<div className="text-left font-semibold text-[#0B1220] text-sm pl-1.5 cursor-pointer" onClick={()=>{navigate("/dashboard");setIsOpen(false)}}>{companyName}</div>
<div className="text-left font-normal text-gray-600 text-sm pl-1.5 leading-4">
{adminName}님 안녕하세요!
</div>
<button type="button" aria-label="닫기" onClick={()=>setIsOpen(false)} className="absolute top-4 right-4 rounded-md"><XMarkIcon className="w-6 h-6 text-[#3C4657] hover:text-[#1C56D3] transition-colors duration-300"/></button>
</div>
<div className="hidden md:flex flex-col items-center p-6 border-b border-[#E6EAF0]">
<img src={logo} alt={`${companyName} logo`} className="w-[180px] mb-6 cursor-pointer" onClick={()=>navigate("/dashboard")}/>
<div className="w-full text-left font-semibold text-[#0B1220] text-base mb-0.5 pl-1.5">{companyName}</div>
<div className="w-full text-left font-medium text-gray-600 text-base mb-0 pl-1.5 leading-4">
{adminName}님 안녕하세요!
</div>
</div>
<div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-[#ffffff] to-white">
<section className="mb-6">
<div className="w-full mb-2 text-left text-[12px] tracking-wide select-none font-semibold uppercase" style={{color:categoryTextColor}}>안전보건관리</div>
<ul className="w-full list-none p-0 m-0">
{safetySubMenu.map(item=>item.label==="위험성평가"?(
<li key={item.path} className="w-full mb-1.5">
<button type="button" onClick={()=>{navigate(item.path);setIsOpen(false)}} className="w-full bg-gradient-to-r from-[#FF3300] to-[#FF3C0B] text-white rounded-lg font-medium text-base text-center transition hover:opacity-95 focus:outline-none" style={{height:46}}>{item.label}</button>
</li>
):(
<li key={item.path} className="w-full mb-0.5">
<NavLink to={item.path} onClick={()=>setIsOpen(false)} className={({isActive})=>`group flex items-center gap-2 py-2 px-3 rounded-lg transition-colors duration-300 ${isActive?"bg-[#EAF2FF] text-[#1C56D3]":"text-[#4C5A6B] hover:bg-[#F1F5FF] hover:text-[#1C56D3]"}`}>
{item.Icon&&(<item.Icon className="w-[18px] h-[18px] text-[#7C8A9B] group-hover:text-[#1C56D3] transition-colors duration-300"/>)}
<span className="flex-1 text-[15px] font-medium">{item.label}</span>
</NavLink>
</li>
))}
</ul>
</section>
<div className="w-full mb-6 border-t border-b border-[#E6EAF0]">
<NavLink to="/business-management" onClick={()=>setIsOpen(false)} className={({isActive})=>`flex items-center gap-2 font-medium text-base h-[50px] w-full cursor-pointer px-3 transition-colors duration-300 ${isActive?"text-[#1C56D3]":"text-[#617085] hover:text-[#1C56D3]"}`} end><Cog6ToothIcon className="w-5 h-5"/><span>사업장관리</span></NavLink>
</div>
<section className="mb-4">
<div className="w-full mb-2 text-left text-[12px] tracking-wide select-none font-semibold uppercase" style={{color:categoryTextColor}}>정보센터</div>
<ul className="w-full list-none p-0 m-0">
{infoSubMenu.map(item=>(
<li key={item.path} className="w-full mb-0.5">
<NavLink to={item.path} onClick={()=>setIsOpen(false)} className={({isActive})=>`group flex items-center gap-2 py-2 px-3 rounded-lg transition-colors duration-300 ${isActive?"bg-[#EAF2FF] text-[#1C56D3]":"text-[#4A586A] hover:bg-[#F1F5FF] hover:text-[#1C56D3]"}`}>
{item.Icon&&(<item.Icon className="w-[18px] h-[18px] text-[#7C8A9B] group-hover:text-[#1C56D3] transition-colors duration-300"/>)}
<span className="flex-1 text-[15px] font-medium">{item.label}</span>
</NavLink>
</li>
))}
</ul>
</section>
<ul className="w-full list-none p-0 m-0">
{supportMenu.map(item=>(
<li key={item.path} className="mb-3 flex items-center gap-1">
{item.label==="사용가이드"?(
<a href={item.path} target="_blank" rel="noopener noreferrer" className="flex items-center text-left text-[15px] font-normal text-[#7C8899] hover:text-[#1C56D3] transition-colors">{item.label}<ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1"/></a>
):(
<NavLink to={item.path} onClick={()=>setIsOpen(false)} className={({isActive})=>`block text-left text-[15px] font-normal transition-colors ${isActive?"text-[#1C56D3]":"text-[#7C8899] hover:text-[#1C56D3]"}`}>{item.label}</NavLink>
)}
</li>
))}
</ul>
<div className="mt-5">
<button onClick={handleLogout} className="w-full border border-[#D7DEE8] rounded-lg bg-white text-[#405066] font-medium text-base hover:bg-[#F6F9FE] hover:text-[#1C56D3] transition-colors flex items-center justify-center gap-2 px-3" style={{height:40}} aria-label="로그아웃"><ArrowRightOnRectangleIcon className="w-5 h-5"/><span>로그아웃</span></button>
</div>
</div>
</div>
</aside>
<div className="hidden md:block fixed z-50 top-[80px]" style={{left:isDesktopOpen?DESKTOP_W-33:0}}>
<button aria-label={isDesktopOpen?"사이드바 접기":"사이드바 열기"} className="w-8 h-8 bg-[#1E293B] border border-[#334155] rounded-lg shadow-sm flex items-center justify-center hover:bg-[#273349] active:bg-[#1C2535] transition" onClick={()=>setIsDesktopOpen(v=>!v)}>
{isDesktopOpen?(<PanelRightOpen className="w-4 h-4 text-[#DEE6F0]" strokeWidth={2.2}/>):(<PanelRightClose className="w-4 h-4 text-[#DEE6F0]" strokeWidth={2.2}/>)}
</button>
</div>
<div aria-hidden className="hidden md:block shrink-0 transition-[width] duration-300" style={{width:isDesktopOpen?DESKTOP_W:0}}/>
</>)}
export default Sidebar