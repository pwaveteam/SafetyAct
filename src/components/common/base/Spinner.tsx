// src/components/common/base/Spinner.tsx

import React from "react"

const Spinner = ({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => {
const sizes = {
sm: "w-4 h-4",
md: "w-6 h-6",
lg: "w-8 h-8",
}

return (
<div className={`border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin ${sizes[size]}`} />
)
}

export default Spinner