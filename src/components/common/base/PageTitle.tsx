import React from "react"

interface PageTitleProps {
children: React.ReactNode
className?: string
}

const PageTitle: React.FC<PageTitleProps> = ({ children, className = "" }) => (
<h2 className={`text-[1rem] sm:text-[1.3rem] font-bold text-[#333639] mb-2 sm:mb-3 ${className}`}>{children}</h2>
)

export default PageTitle