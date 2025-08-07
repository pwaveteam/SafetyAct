import React from "react"

type ToggleSwitchProps = {
checked: boolean
onChange: (checked: boolean) => void
}

export default function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
return (
<button type="button" role="switch" aria-checked={checked} onClick={e => { e.stopPropagation(); onChange(!checked) }} className={`ml-0.5 relative inline-flex items-center h-7 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none ${checked ? "bg-[#031E36]" : "bg-gray-300"}`} style={{ opacity: 0.9 }}>
<span className={`flex items-center justify-center self-center w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out ${checked ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
</button>
)
}