import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import BusinessSidebar from "../Sidebar/BusinessSidebar"
import Breadcrumb from "../common/base/Breadcrumb"

const BusinessManagementLayout: React.FC = () => {
const [isOpen, setIsOpen] = useState(false)
return (
<div className="flex min-h-screen">
<BusinessSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
<main className="flex-1 flex flex-col bg-[#F8F8F8] box-border overflow-auto main-layout-content" style={{ position: "relative", padding: "2rem 2rem 0 2rem" }}>
<Breadcrumb />
<div className="bg-white rounded-[12px] content-wrapper box-border flex-1 max-w-[96vw] w-full mx-auto shadow-[0_0_3px_rgba(0,0,0,0.01)] overflow-y-auto" style={{ padding: "2rem", marginTop: 0 }}>
<Outlet />
</div>
<style>{`
@media (max-width: 767px) {
.main-layout-content {
padding-top: calc(2rem + 48px) !important;
padding-left: 1rem !important;
padding-right: 1rem !important;
}
.content-wrapper {
padding-left: 1rem !important;
padding-right: 1rem !important;
}
}`}</style>
</main>
</div>
)
}

export default BusinessManagementLayout