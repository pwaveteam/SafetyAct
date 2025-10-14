import React from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

export type SitePhotoViewerProps = {
open: boolean
images: string[]
index: number
onClose: () => void
onPrev: () => void
onNext: () => void
enableKeyboard?: boolean
}

const SitePhotoViewer: React.FC<SitePhotoViewerProps> = ({ open, images, index, onClose, onPrev, onNext, enableKeyboard = true }) => {
const hasPrev = index > 0
const hasNext = index < images.length - 1

React.useEffect(() => {
if (!open || !enableKeyboard) return
const onKey = (e: KeyboardEvent) => {
if (e.key === "Escape") onClose()
if (e.key === "ArrowLeft" && hasPrev) onPrev()
if (e.key === "ArrowRight" && hasNext) onNext()
}
window.addEventListener("keydown", onKey)
return () => window.removeEventListener("keydown", onKey)
}, [open, enableKeyboard, hasPrev, hasNext, onClose, onPrev, onNext])

if (!open) return null

return (
<div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
<div className="absolute inset-0 bg-black/70" onClick={onClose}/>
<div className="absolute inset-0 flex items-center justify-center p-2">
<div className="relative">
<img src={images.length > 0 ? images[index] : ""} alt={images.length > 0 ? `현장사진 ${index + 1}` : "이미지 없음"} className="max-h-[90vh] max-w-[92vw] object-contain rounded-lg shadow-2xl"/>
<button aria-label="닫기" onClick={e => {e.stopPropagation(); onClose()}} className="absolute top-2 right-2 inline-flex items-center justify-center w-8 h-8 rounded-md bg-black/60 text-white hover:bg-black/70"><X size={16}/></button>
<button aria-label="이전" onClick={e => {e.stopPropagation(); if (hasPrev) onPrev()}} className={`absolute left-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-md ${hasPrev ? "bg-black/60 text-white hover:bg-black/70" : "bg-black/30 text-gray-500 cursor-default"}`}><ChevronLeft size={18}/></button>
<button aria-label="다음" onClick={e => {e.stopPropagation(); if (hasNext) onNext()}} className={`absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-md ${hasNext ? "bg-black/60 text-white hover:bg-black/70" : "bg-black/30 text-gray-500 cursor-default"}`}><ChevronRight size={18}/></button>
<div className="absolute bottom-2 right-[10px] text-[11px] text-white/80 bg-black/40 rounded px-2 py-0.5 tracking-tight">{images.length ? `${index + 1}/${images.length}` : "0/0"}</div>
</div>
</div>
</div>
)
}

export default SitePhotoViewer