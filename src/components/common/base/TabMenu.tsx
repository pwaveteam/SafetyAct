import React from "react"

export interface TabMenuProps {
tabs: string[]
activeIndex: number
onTabClick: (idx: number) => void
className?: string
}

const TabMenu: React.FC<TabMenuProps> = ({ tabs, activeIndex, onTabClick, className = "" }) => {
return (
<nav className={`flex overflow-x-auto sm:overflow-visible border-b border-gray-200 ${className}`} aria-label="탭 메뉴">
<div className="flex space-x-1 min-w-max">
{tabs.map((tab, idx) => {
const isActive = idx === activeIndex
return (
<button key={tab} type="button" aria-current={isActive ? "page" : undefined} onClick={() => onTabClick(idx)} className={`whitespace-nowrap py-3 px-3 text-sm font-medium ${isActive ? "border-b-2 border-blue-600 text-blue-600" : "border-b-2 border-transparent text-gray-500 hover:text-gray-900"} focus:outline-none`}>
{tab}
</button>
)
})}
</div>
</nav>
)
}

export default TabMenu