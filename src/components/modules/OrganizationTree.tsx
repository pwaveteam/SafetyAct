import React from "react"
import OrgChart from "react-orgchart"

export type OrgNode = {
id: number | string
title: string
name: string
position: string
children?: OrgNode[]
}

interface OrganizationTreeProps {
data: OrgNode | OrgNode[]
}

const NodeComponent: React.FC<{ node: OrgNode }> = ({ node }) => (
<div
className="border border-gray-300 bg-white text-center shadow-sm box-border w-[190px] sm:w-[190px] m-[6px]
max-w-full md:w-[190px] md:h-auto md:text-base w-[80px] h-[80px] text-[10px] leading-tight"
>
<div
className="border-b border-gray-300 select-none bg-[#EFEFF3] text-[#666666] font-bold
md:py-3 py-1 md:text-[1rem] text-xs leading-snug"
>
{node.title}
</div>
<div className="md:mt-2 mt-1 font-bold text-[#333639] md:text-[1rem] text-xs">
{node.name}
</div>
<div className="md:mt-1 md:mb-3 mt-0.5 mb-1 font-normal text-[#333639] md:text-[1rem] text-xs">
{node.position}
</div>
</div>
)

const OrganizationTree: React.FC<OrganizationTreeProps> = ({ data }) => {
const root = Array.isArray(data) ? data[0] : data
if (!root) return null

return (
<>
<style>{`
.orgchart .nodes {
display: flex !important;
justify-content: center !important;
}
.orgchart .node {
margin: 6px auto !important;
}
@media (max-width: 480px) {
.orgchart .node {
width: 80px !important;
height: 80px !important;
font-size: 10px !important;
}
}
`}</style>
<div className="flex justify-center">
<OrgChart tree={root} NodeComponent={NodeComponent} />
</div>
</>
)
}

export default OrganizationTree