import React, { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import {
ArrowRightOnRectangleIcon,
ArrowTopRightOnSquareIcon,
Cog6ToothIcon,
Bars3Icon,
XMarkIcon,
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
ExclamationTriangleIcon,
ChevronDoubleLeftIcon,
ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline"

interface MenuItem {
label: string
path: string
Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}
interface SidebarProps {
companyName?: string
adminName?: string
}

const businessSubMenu: MenuItem[] = [
{ label: "기본사업장관리", path: "/business-management/basic" },
{ label: "경영방침", path: "/business-management/policy-goal" },
{ label: "예산/목표", path: "/business-management/budget" },
{ label: "조직도", path: "/business-management/organization" },
]

const safetySubMenu: MenuItem[] = [
{ label: "위험성평가", path: "/risk-assessment" },
{ label: "TBM", path: "/tbm", Icon: DocumentTextIcon },
{ label: "아차사고", path: "/nearmiss", Icon: ClipboardDocumentListIcon },
{ label: "안전교육", path: "/safety-education", Icon: BookOpenIcon },
{ label: "자산관리", path: "/asset-management", Icon: ArchiveBoxIcon },
{ label: "안전작업허가서", path: "/safety-work-permit", Icon: ClipboardDocumentCheckIcon },
{ label: "도급협의체관리", path: "/supply-chain-management", Icon: UserGroupIcon },
]

const infoSubMenu: MenuItem[] = [
{ label: "대응매뉴얼", path: "/response-manual", Icon: ShieldCheckIcon },
{ label: "공지/게시판", path: "/notice-board", Icon: ExclamationTriangleIcon },
{ label: "결재함", path: "/approval-box", Icon: BellAlertIcon },
{ label: "QR관리", path: "/qr-management", Icon: QrCodeIcon },
]

const supportMenu: MenuItem[] = [
{ label: "마이페이지", path: "/mypage" },
{ label: "1:1 지원", path: "/support" },
{ label: "사용가이드", path: "https://www.notion.so/" },
]

const Sidebar: React.FC<SidebarProps> = ({ companyName = "펄스웨이브", adminName = "이동현" }) => {
const [isOpen, setIsOpen] = useState(false)
const [isDesktopOpen, setIsDesktopOpen] = useState(true)
const navigate = useNavigate()
const categoryTextColor = "#99A1AD"

return (
<>
{!isOpen && (
<header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-300 flex items-center px-4 md:hidden z-50">
<button
type="button"
aria-label="메뉴 열기"
onClick={() => setIsOpen(true)}
className="rounded-md focus:outline-none text-[#333333] hover:text-[#1C56D3] transition-colors duration-300"
>
<Bars3Icon className="w-6 h-6" />
</button>
<img
src={logo}
alt={`${companyName} logo`}
className="w-[160px] cursor-pointer mx-auto max-w-[calc(100%-48px)]"
onClick={() => navigate("/dashboard")}
/>
</header>
)}
{isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" />}
<aside
className={`fixed top-0 left-0 h-full bg-white border-r border-[#EEEEEE] flex flex-col min-h-screen z-50 transform transition-all duration-300 ease-in-out ${
isOpen ? "translate-x-0" : "-translate-x-full"
} md:translate-x-0 md:static md:flex ${isDesktopOpen ? "md:w-[230px]" : "md:w-0 md:overflow-hidden"}`}
style={{ width: isOpen ? 230 : undefined }}
>
<div className="relative flex flex-col p-5 border-b border-gray-300 md:hidden">
<div
className="text-left font-semibold text-[#161616] text-sm mb-0 pl-1.5 cursor-pointer"
onClick={() => {
navigate("/dashboard")
setIsOpen(false)
}}
>
{companyName}
</div>
<div className="text-left font-normal text-[#333639] text-sm pl-1.5 leading-4">{adminName}님 안녕하세요!</div>
<button
type="button"
aria-label="닫기"
onClick={() => setIsOpen(false)}
className="absolute top-4 right-4 rounded-md transition-colors duration-300"
>
<XMarkIcon className="w-6 h-6 text-[#333333] hover:text-[#1C56D3]" />
</button>
</div>
<div className="hidden md:flex flex-col items-center p-6 border-b border-gray-300">
<img
src={logo}
alt={`${companyName} logo`}
className="w-[180px] mb-6 cursor-pointer"
onClick={() => navigate("/dashboard")}
/>
<div className="w-full text-left font-semibold text-[#161616] text-base mb-0.5 pl-1.5">{companyName}</div>
<div className="w-full text-left font-light text-[#333639] text-base mb-0 pl-1.5 leading-4">
{adminName}님 안녕하세요!
</div>
</div>
<div className="bg-white flex flex-col flex-grow p-6 overflow-y-auto">
<section className="mb-6">
<div className="w-full mb-1.5 text-left text-[13px] select-none font-semibold" style={{ color: categoryTextColor }}>
안전보건관리
</div>
<ul className="w-full list-none p-0 m-0 box-border">
{safetySubMenu.map((item) =>
item.label === "위험성평가" ? (
<li key={item.path} className="w-full mb-0.5">
<button
type="button"
onClick={() => {
navigate(item.path)
setIsOpen(false)
}}
className="w-full bg-[#FF3300] text-white rounded-lg font-medium text-base text-center border-none cursor-pointer transition duration-300 ease-in-out hover:bg-[#FF0000] hover:opacity-100"
style={{ height: 46 }}
>
{item.label}
</button>
</li>
) : (
<li key={item.path} className="w-full mb-0.5">
<NavLink
to={item.path}
onClick={() => setIsOpen(false)}
className={({ isActive }) =>
`group flex items-center gap-2 py-1.5 px-2 rounded-lg transition-colors duration-300 ease-in-out hover:bg-[#F6F9FE] hover:text-[#1C56D3] ${
isActive ? "bg-[#F6F9FE] text-[#1C56D3]" : "text-[#5C5E6D]"
}`
}
>
{item.Icon && (
<item.Icon className="w-[18px] h-[18px] text-[#6B8EA6] group-hover:text-[#1C56D3] transition-colors duration-300 ease-in-out" />
)}
<span className="flex-1 text-[15px] font-medium">{item.label}</span>
</NavLink>
</li>
)
)}
</ul>
</section>
<div className="w-full mb-6 border-t border-b border-gray-300">
<NavLink
to="/business-management"
onClick={() => setIsOpen(false)}
className={({ isActive }) =>
`flex items-center gap-2 font-medium text-base h-[50px] w-full cursor-pointer px-3 transition-colors duration-300 ${
isActive ? "text-[#1C56D3]" : "text-gray-500"
}`
}
end
>
<Cog6ToothIcon className="w-5 h-5" />
사업장관리
</NavLink>
</div>
<section className="mb-6">
<div className="w-full mb-1.5 text-left text-[13px] select-none font-semibold" style={{ color: categoryTextColor }}>
정보센터
</div>
<ul className="w-full list-none p-0 m-0 box-border">
{infoSubMenu.map((item) => (
<li key={item.path} className="w-full mb-0.5">
<NavLink
to={item.path}
onClick={() => setIsOpen(false)}
className={({ isActive }) =>
`group flex items-center gap-2 py-1.5 px-2 rounded-lg transition-colors duration-300 ease-in-out hover:bg-[#F6F9FE] hover:text-[#1C56D3] ${
isActive ? "bg-[#F6F9FE] text-[#1C56D3]" : "text-[#535F69]"
}`
}
>
{item.Icon && (
<item.Icon className="w-[18px] h-[18px] text-[#6B8EA6] group-hover:text-[#1C56D3] transition-colors duration-300 ease-in-out" />
)}
<span className="flex-1 text-[15px] font-medium">{item.label}</span>
</NavLink>
</li>
))}
</ul>
</section>
<ul className="w-full list-none p-0 m-0 box-border mt-4">
{supportMenu.map((item) => (
<li key={item.path} className="mb-3 flex items-center gap-1">
{item.label === "사용가이드" ? (
<a
href={item.path}
target="_blank"
rel="noopener noreferrer"
className="flex items-center text-left text-[15px] font-normal text-[#888888] transition-colors duration-300 ease-in-out no-underline hover:text-[#1C56D3]"
style={{ fontWeight: 400 }}
>
{item.label}
<ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1 text-[#888888]" />
</a>
) : (
<NavLink
to={item.path}
onClick={() => setIsOpen(false)}
className={({ isActive }) =>
`block text-left text-[15px] font-normal transition-colors duration-300 ease-in-out hover:text-[#1C56D3] ${
isActive ? "text-[#1C56D3]" : "text-[#888888]"
}`
}
style={{ fontWeight: 400 }}
>
{item.label}
</NavLink>
)}
</li>
))}
</ul>
<div className="flex-grow" />
<div className="w-full box-border">
<button
onClick={() => {
navigate("/logout")
setIsOpen(false)
}}
className="w-full border border-gray-300 rounded-lg bg-white text-[#4F5D6F] font-medium text-base cursor-pointer transition-colors duration-300 ease-in-out hover:text-[#333639] flex items-center justify-center gap-2 px-3"
style={{ height: 39 }}
>
<ArrowRightOnRectangleIcon className="w-5 h-5" />
로그아웃
</button>
</div>
</div>
</aside>
<div className={`hidden md:block fixed z-50 transition-all duration-300 ease-in-out top-[90px] ${isDesktopOpen ? "left-[215px]" : "left-0"}`}>
<button
className="w-8 h-8 bg-[#ffffff] rounded-md shadow flex items-center justify-center hover:bg-[#f9f9f9] transition"
onClick={() => setIsDesktopOpen((prev) => !prev)}
>
{isDesktopOpen ? (
<ChevronDoubleLeftIcon className="w-3.5 h-3.5 text-[#1E3C6B]" strokeWidth={2.3} />
) : (
<ChevronDoubleRightIcon className="w-3.5 h-3.5 text-[#1E3C6B]" strokeWidth={2.3} />
)}
</button>
</div>
</>
)
}

export default Sidebar
