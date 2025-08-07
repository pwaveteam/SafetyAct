// 사업장관리 메뉴
import React, { useEffect, useRef } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"
import { Bars3Icon, HomeIcon } from "@heroicons/react/20/solid"

interface SidebarProps { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; companyName?: string; adminName?: string }

const BusinessSidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, companyName = "LawGuard Safety", adminName = "이동현" }) => {
const navigate = useNavigate()
const sidebarRef = useRef<HTMLDivElement>(null)

const businessSubMenu = [
{ label: "기본사업장관리", path: "/business-management/basic" },
{ label: "경영방침", path: "/business-management/policy-goal" },
{ label: "예산/목표", path: "/business-management/budget" },
{ label: "조직도", path: "/business-management/organization" },
]

useEffect(() => {
const handleClickOutside = (e: MouseEvent) => {
if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
setIsOpen(false)
}
}
document.addEventListener("mousedown", handleClickOutside)
return () => { document.removeEventListener("mousedown", handleClickOutside) }
}, [isOpen, setIsOpen])

return (
<>
{!isOpen && (
<header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-300 flex items-center px-4 md:hidden z-50">
<button type="button" aria-label="메뉴 열기" onClick={() => setIsOpen(true)} className="rounded-md focus:outline-none text-[#333333] hover:text-[#1C56D3] transition-colors duration-300">
<Bars3Icon className="w-6 h-6" />
</button>
<img src={logo} alt={`${companyName} logo`} className="w-[160px] cursor-pointer mx-auto max-w-[calc(100%-48px)]" onClick={() => navigate("/dashboard")} />
</header>
)}
{isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden" />}
<aside ref={sidebarRef} className={`fixed top-0 left-0 h-full bg-white border-r border-[#EEEEEE] flex flex-col w-[180px] min-h-screen z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex md:w-[180px]`}>
<div className="flex items-center px-4 pt-4 pb-3">
<button onClick={() => { navigate("/dashboard"); setIsOpen(false) }} className="w-full border border-gray-300 rounded-lg bg-white text-[#4F5D6F] font-medium text-[14px] cursor-pointer transition-colors duration-300 hover:text-[#333639] flex items-center justify-center gap-1 px-2 h-[36px]">
<HomeIcon className="w-4 h-4" />
메인으로
</button>
</div>
<div className="bg-white flex flex-col flex-grow p-4 overflow-y-auto">
<div className="mb-4 text-left text-[13px] select-none font-semibold text-[#99A1AD]">사업장관리</div>
<ul className="w-full list-none p-0 m-0 box-border text-[14px] font-medium">
{businessSubMenu.map(({ label, path }) => (
<li key={path} className="w-full mb-0.5">
<NavLink to={path} onClick={() => setIsOpen(false)} className={({ isActive }) => `group flex items-center gap-1 py-1.5 px-2 rounded-lg transition-colors duration-300 hover:bg-[#F6F9FE] hover:text-[#1C56D3] ${isActive ? "bg-[#F6F9FE] text-[#1C56D3]" : "text-[#5C5E6D]"}`}>
<span className="truncate">{label}</span>
</NavLink>
</li>
))}
</ul>
</div>
</aside>
</>
)
}

export default BusinessSidebar