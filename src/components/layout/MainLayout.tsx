import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../Sidebar/Sidebar"
import Breadcrumb from "../common/base/Breadcrumb"

const MainLayout: React.FC = () => {
return (
<div style={{ display: "flex", minHeight: "100vh" }}>
<Sidebar />
<div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "2rem 2rem 0 2rem", background: "#F8F8F8", boxSizing: "border-box", overflow: "auto", position: "relative" }} className="main-layout-content">
<Breadcrumb />
<div style={{ background: "#fff", borderRadius: 12, padding: "2rem", boxSizing: "border-box", flex: 1, maxWidth: "96vw", width: "100%", margin: "0 auto", boxShadow: "0 0 3px rgb(0 0 0 / 0.01)", overflowY: "auto" }} className="content-wrapper">
<Outlet />
</div>
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
</div>
)
}

export default MainLayout