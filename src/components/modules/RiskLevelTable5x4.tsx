import React, { useState } from "react"

const RiskLevelTable5x4: React.FC = () => {
const cellHeight = "h-[39px]"
const baseCellClass = `border border-gray-300 text-left ${cellHeight} font-medium px-2`
const headerBg = "bg-gray-100"
const headerTextColor = "text-gray-600"
const headerFontWeight = "font-normal"
const headerClass = `${headerBg} ${headerTextColor} ${headerFontWeight} text-center`
const textColor = "#161616"
const colors = {매우높음: "#FF3939", 높음: "#FF6C00", 약간높음: "#FFBB35", 보통: "#FFE13E", 낮음: "#C1FF1B", 매우낮음: "#1EED1E"}
const [scores, setScores] = useState({매우낮음: ["1", "2"], 낮음: ["3", "5"], 보통: ["6", "8"], 약간높음: ["9", "10"], 높음: ["11", "15"], 매우높음: ["16", "20"]})
const handleScoreChange = (level: keyof typeof scores, index: 0 | 1, value: string) => {
if (/^([1-9]|10|11|12|13|14|15|16|17|18|19|20)?$/.test(value)) {
setScores(prev => {
const newArr = [...prev[level]]
newArr[index] = value
return { ...prev, [level]: newArr }
})
}}

return (
<>
<table className="w-full border border-gray-300 rounded text-sm table-fixed mt-4" style={{ borderCollapse: "collapse" }}>
<thead>
<tr>
<th className={`border border-gray-300 ${headerClass} h-[50px] px-2`} style={{ width: "40%" }}>위험성 수준</th>
<th className={`border border-gray-300 ${headerClass} h-[50px] px-2`} style={{ width: "60%" }}>관리기준</th>
</tr>
</thead>
<tbody>
{[
{level: "매우낮음" as const, standard: "현재의 안전대책 유지", bgColor: colors["매우낮음"]},
{level: "낮음" as const, standard: "안전정보 및 주기적 안전보건교육의 제공이 필요한 위험", bgColor: colors["낮음"]},
{level: "보통" as const, standard: "정비, 보수기간에 안전보건 대책을 수립하고 개선해야 할 위험", bgColor: colors["보통"]},
{level: "약간높음" as const, standard: "즉시개선", bgColor: colors["약간높음"]},
{level: "높음" as const, standard: "긴급 임시안전보건대책을 세운 후 작업 실시하고 정비, 보수기간 전에 안전보건 대책 수립 및 개선해야 할 위험", bgColor: colors["높음"]},
{level: "매우높음" as const, standard: "즉시 작업중지 (작업 지속 시 즉시 개선 실행 위험)", bgColor: colors["매우높음"]},
].map(({ level, standard, bgColor }, i) => (
<tr key={i}>
<td className="p-0" style={{ width: "40%", border: "none" }}>
<table className="w-full" style={{ borderCollapse: "collapse", borderSpacing: 0 }}>
<tbody>
<tr style={{ backgroundColor: bgColor, color: textColor }}>
<td className="text-left h-[50px] px-2 whitespace-nowrap w-40" style={{ borderRight: "1px solid #D1D5DB", borderBottom: "1px solid #D1D5DB", padding: 0 }}>
<div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
<input type="text" value={scores[level][0]} maxLength={2} onChange={(e) => handleScoreChange(level, 0, e.target.value)} style={{ width: 40, height: 36, borderRadius: 6, border: "1px solid #ccc", fontSize: "15px", textAlign: "center", outline: "none", backgroundColor: "#fff", color: textColor, userSelect: "text" }} inputMode="numeric" />
<span style={{ lineHeight: "36px", fontWeight: "bold" }}>~</span>
<input type="text" value={scores[level][1]} maxLength={2} onChange={(e) => handleScoreChange(level, 1, e.target.value)} style={{ width: 40, height: 36, borderRadius: 6, border: "1px solid #ccc", fontSize: "15px", textAlign: "center", outline: "none", backgroundColor: "#fff", color: textColor, userSelect: "text" }} inputMode="numeric" />
</div>
</td>
<td className="text-left h-[50px] px-2 whitespace-nowrap" style={{ borderBottom: "1px solid #D1D5DB" }}>{level}</td>
</tr>
</tbody>
</table>
</td>
<td className="font-medium text-left h-[50px] px-2" style={{ width: "60%", border: "1px solid #D1D5DB", backgroundColor: bgColor, color: textColor }}>{standard}</td>
</tr>
))}
</tbody>
</table>

<table className="w-full border border-gray-300 rounded text-sm table-fixed mt-6">
<thead>
<tr>
<th className={`${baseCellClass} w-28 ${headerClass}`}>가능성(빈도)</th>
<th className={`${baseCellClass} w-16 ${headerClass}`}>최대(4)</th>
<th className={`${baseCellClass} w-16 ${headerClass}`}>대(3)</th>
<th className={`${baseCellClass} w-16 ${headerClass}`}>중(2)</th>
<th className={`${baseCellClass} w-16 ${headerClass}`}>소(1)</th>
</tr>
</thead>
<tbody>
<tr><td className={`${baseCellClass} text-center`}>최상(5)</td><td className={baseCellClass} style={{ backgroundColor: colors["매우높음"], color: textColor }}>매우높음(20)</td><td className={baseCellClass} style={{ backgroundColor: colors["높음"], color: textColor }}>높음(15)</td><td className={baseCellClass} style={{ backgroundColor: colors["약간높음"], color: textColor }}>약간높음(10)</td><td className={baseCellClass} style={{ backgroundColor: colors["낮음"], color: textColor }}>낮음(5)</td></tr>
<tr><td className={`${baseCellClass} text-center`}>상(4)</td><td className={baseCellClass} style={{ backgroundColor: colors["매우높음"], color: textColor }}>매우높음(16)</td><td className={baseCellClass} style={{ backgroundColor: colors["약간높음"], color: textColor }}>약간높음(12)</td><td className={baseCellClass} style={{ backgroundColor: colors["보통"], color: textColor }}>보통(8)</td><td className={baseCellClass} style={{ backgroundColor: colors["낮음"], color: textColor }}>낮음(4)</td></tr>
<tr><td className={`${baseCellClass} text-center`}>중(3)</td><td className={baseCellClass} style={{ backgroundColor: colors["약간높음"], color: textColor }}>약간높음(12)</td><td className={baseCellClass} style={{ backgroundColor: colors["약간높음"], color: textColor }}>약간높음(9)</td><td className={baseCellClass} style={{ backgroundColor: colors["낮음"], color: textColor }}>낮음(6)</td><td className={baseCellClass} style={{ backgroundColor: colors["매우낮음"], color: textColor }}>매우낮음(3)</td></tr>
<tr><td className={`${baseCellClass} text-center`}>하(2)</td><td className={baseCellClass} style={{ backgroundColor: colors["보통"], color: textColor }}>보통(8)</td><td className={baseCellClass} style={{ backgroundColor: colors["낮음"], color: textColor }}>낮음(6)</td><td className={baseCellClass} style={{ backgroundColor: colors["낮음"], color: textColor }}>낮음(4)</td><td className={baseCellClass} style={{ backgroundColor: colors["매우낮음"], color: textColor }}>매우낮음(2)</td></tr>
<tr><td className={`${baseCellClass} text-center`}>최하(1)</td><td className={baseCellClass} style={{ backgroundColor: colors["낮음"], color: textColor }}>낮음(4)</td><td className={baseCellClass} style={{ backgroundColor: colors["매우낮음"], color: textColor }}>매우낮음(3)</td><td className={baseCellClass} style={{ backgroundColor: colors["매우낮음"], color: textColor }}>매우낮음(2)</td><td className={baseCellClass} style={{ backgroundColor: colors["매우낮음"], color: textColor }}>매우낮음(1)</td></tr>
</tbody>
</table>
</>
)}

export default RiskLevelTable5x4