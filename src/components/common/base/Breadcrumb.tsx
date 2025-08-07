import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ChevronRight } from "lucide-react"

const pathNameMap: Record<string, string> = {
"/dashboard": "대시보드",
"/business-management": "사업장관리",
"/business-management/basic": "기본사업장관리",
"/business-management/policy-goal": "경영방침",
"/business-management/budget": "예산/목표",
"/business-management/organization": "조직도",
"/risk-assessment": "위험성평가",
"/risk-assessment/chemical": "화학물질평가",
"/risk-assessment/risk": "위험평가",
"/risk-assessment/list": "평가목록",
"/tbm": "TBM",
"/nearmiss": "아차사고",
"/nearmiss/safevoice": "안전보이스",
"/safety-education": "안전교육",
"/safety-education/regular": "정기교육",
"/safety-education/special": "특별교육",
"/asset-management": "자산관리",
"/asset-management/machine": "위험기계/기구/설비",
"/asset-management/hazard": "유해/위험물질",
"/safety-work-permit": "안전작업허가서",
"/supply-chain-management": "도급협의체관리",
"/supply-chain-management/partner-list": "수급업체 관리",
"/supply-chain-management/partner-evaluation": "안전보건수준 평가",
"/supply-chain-management/contract-document": "도급안전보건 협의체",
"/supply-chain-management/site-management": "안전보건 점검",
"/supply-chain-management/partner-training": "안전보건 교육/훈련",
"/response-manual": "대응매뉴얼",
"/notice-board": "공지/게시판",
"/notice-board/notice": "공지사항",
"/notice-board/resources": "자료실",
"/notice-board/law": "중대재해처벌법",
"/approval-box": "결재함",
"/approval-box/received": "받은결재함",
"/approval-box/sent": "보낸결재함",
"/qr-management": "QR관리",
"/mypage": "마이페이지",
"/support": "1:1 지원",
"/user-guide": "사용가이드"
}

const Breadcrumb: React.FC = () => {
const location = useLocation()
const navigate = useNavigate()
const pathnames = location.pathname.split("/").filter(Boolean)

const findName = (url: string): string => {
if (pathNameMap[url]) return pathNameMap[url]
const segments = url.split("/")
while (segments.length > 1) {
segments.pop()
const parentUrl = segments.join("/") || "/"
if (pathNameMap[parentUrl]) return pathNameMap[parentUrl]
}
return ""
}

let crumbs = pathnames.map((_, idx) => {
const url = "/" + pathnames.slice(0, idx + 1).join("/")
return { url, name: findName(url) }
})

if (pathnames.length === 1 && pathnames[0] === "safety-education") {
crumbs.push({ url: "/safety-education/regular", name: pathNameMap["/safety-education/regular"] })
}

if (pathnames.length === 1 && pathnames[0] === "specialeducation") {
crumbs.length = 0
crumbs.push({ url: "/safety-education", name: pathNameMap["/safety-education"] })
crumbs.push({ url: "/safety-education/special", name: pathNameMap["/safety-education/special"] })
}

if (pathnames.length === 1 && pathnames[0] === "nearmiss") {
crumbs.push({ url: "/nearmiss", name: pathNameMap["/nearmiss"] })
}

return (
<nav aria-label="breadcrumb" className="flex items-center gap-1 mb-3 whitespace-nowrap text-[13px] leading-tight">
<button onClick={() => navigate("/")} className="font-semibold hover:underline focus:outline-none" type="button" aria-label="홈으로 이동" style={{ color: "#333639", fontSize: 13 }}>
홈
</button>
{crumbs.map((crumb, idx) => (
<React.Fragment key={`${crumb.url}-${idx}`}>
<ChevronRight size={13} strokeWidth={2} color="#999999" className="select-none" />
<span className="font-normal" style={{ color: "#999999", userSelect: "none", fontSize: 13 }}>
{crumb.name}
</span>
</React.Fragment>
))}
</nav>
)
}

export default Breadcrumb