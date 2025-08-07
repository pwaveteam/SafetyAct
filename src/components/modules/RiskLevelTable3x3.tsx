import React, { useState } from "react"

const RiskLevelTable3x3: React.FC = () => {
const cellHeight = "h-[39px]"
const baseCellClass = `border border-gray-300 text-center ${cellHeight} font-medium px-2`
const headerBg = "bg-gray-100"
const headerTextColor = "text-gray-600"
const headerFontWeight = "font-normal"
const headerClass = `${headerBg} ${headerTextColor} ${headerFontWeight}`
const textColor = "#161616"
const colors = {높음: "#FF3939", 보통: "#FFE13E", 낮음: "#1EED1E"}
const [scores, setScores] = useState({낮음: ["1", "2"], 보통: ["3", "4"], 높음: ["5", "9"]})
const handleScoreChange = (level: keyof typeof scores, index: 0 | 1, value: string) => {
if (/^[1-9]?$/.test(value)) {
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
{level: "낮음" as const, standard: "현재 상태 유지", bgColor: colors.낮음},
{level: "보통" as const, standard: "개선 필요", bgColor: colors.보통},
{level: "높음" as const, standard: "즉시개선 필요", bgColor: colors.높음},
].map(({ level, standard, bgColor }, i) => (
<tr key={i}>
<td className="p-0" style={{ width: "30%", border: "none" }}>
<table className="w-full" style={{ borderCollapse: "collapse", borderSpacing: 0 }}>
<tbody>
<tr style={{ backgroundColor: bgColor, color: textColor }}>
<td className="text-left h-[50px] px-2 font-medium whitespace-nowrap w-40" style={{ borderRight: "1px solid #D1D5DB", borderBottom: "1px solid #D1D5DB", padding: 0 }}>
<div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
<input type="text" value={scores[level][0]} maxLength={1} onChange={(e) => handleScoreChange(level, 0, e.target.value)} style={{ width: 40, height: 36, borderRadius: 6, border: "1px solid #ccc", fontSize: 15, textAlign: "center", outline: "none", backgroundColor: "#fff", color: textColor, userSelect: "text" }} inputMode="numeric" />
<span style={{ lineHeight: "36px", fontWeight: "bold" }}>~</span>
<input type="text" value={scores[level][1]} maxLength={1} onChange={(e) => handleScoreChange(level, 1, e.target.value)} style={{ width: 40, height: 36, borderRadius: 6, border: "1px solid #ccc", fontSize: 15, textAlign: "center", outline: "none", backgroundColor: "#fff", color: textColor, userSelect: "text" }} inputMode="numeric" />
</div>
</td>
<td className="text-left h-[50px] px-2 font-medium whitespace-nowrap" style={{ borderBottom: "1px solid #D1D5DB" }}>{level}</td>
</tr>
</tbody>
</table>
</td>
<td className="font-medium text-left h-[50px] px-2" style={{ width: "70%", border: "1px solid #D1D5DB", backgroundColor: bgColor, color: textColor }}>{standard}</td>
</tr>
))}
</tbody>
</table>

<table className="w-full border border-gray-300 rounded text-sm table-fixed mt-6">
<thead>
<tr className={headerClass}>
<th className={`${baseCellClass} w-28 text-center`}>가능성(빈도)</th>
<th className={`${baseCellClass} w-24 text-center`}>상(3)</th>
<th className={`${baseCellClass} w-24 text-center`}>중(2)</th>
<th className={`${baseCellClass} w-24 text-center`}>소(1)</th>
</tr>
</thead>
<tbody>
<tr>
<td className={baseCellClass} style={{ color: textColor }}>상(3)</td>
<td className={baseCellClass} style={{ backgroundColor: colors.높음, color: textColor }}>높음(9)</td>
<td className={baseCellClass} style={{ backgroundColor: colors.높음, color: textColor }}>높음(6)</td>
<td className={baseCellClass} style={{ backgroundColor: colors.보통, color: textColor }}>보통(3)</td>
</tr>
<tr>
<td className={baseCellClass} style={{ color: textColor }}>중(2)</td>
<td className={baseCellClass} style={{ backgroundColor: colors.높음, color: textColor }}>높음(6)</td>
<td className={baseCellClass} style={{ backgroundColor: colors.보통, color: textColor }}>보통(4)</td>
<td className={baseCellClass} style={{ backgroundColor: colors.낮음, color: textColor }}>낮음(2)</td>
</tr>
<tr>
<td className={baseCellClass} style={{ color: textColor }}>하(1)</td>
<td className={baseCellClass} style={{ backgroundColor: colors.보통, color: textColor }}>보통(3)</td>
<td className={baseCellClass} style={{ backgroundColor: colors.낮음, color: textColor }}>낮음(2)</td>
<td className={baseCellClass} style={{ backgroundColor: colors.낮음, color: textColor }}>낮음(1)</td>
</tr>
</tbody>
</table>
</>
)}

export default RiskLevelTable3x3