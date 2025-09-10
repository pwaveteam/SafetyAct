import React from "react"
import { useNavigate } from "react-router-dom"
import { CirclePlus, QrCode, Printer, Trash2, Save } from "lucide-react"
import QRCode from "qrcode"
import Button from "@/components/common/base/Button"
import FilterBar from "@/components/common/base/FilterBar"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import PageTitle from "@/components/common/base/PageTitle"
import TabMenu from "@/components/common/base/TabMenu"
import { ReportFormat, RFTbmInput } from "@/components/report/ReportFormat"

type ActionButtonsProps = {
  totalCount: number
  selectedIds: (number | string)[]
  onRegister: () => void
  onGenerateQR: () => void
  onPrint: () => void
  onDelete: () => void
  onDownload: () => void
}

function ActionButtons({ totalCount, onRegister, onGenerateQR, onPrint, onDelete, onDownload }: ActionButtonsProps): React.ReactElement {
  return (
    <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-3 gap-1">
      <span className="text-gray-600 text-sm leading-none pt-[3px] mt-2 sm:mt-0">총 {totalCount}건</span>
      <div className="flex flex-nowrap gap-1 w-full justify-end self-end sm:w-auto sm:self-auto">
        <Button variant="action" onClick={onRegister} className="flex items-center gap-1">
          <CirclePlus size={16} />신규등록
        </Button>
        <Button variant="action" onClick={onGenerateQR} className="flex items-center gap-1">
          <QrCode size={16} />QR 생성
        </Button>
        <Button variant="action" onClick={onDownload} className="flex items-center gap-1">
          <Save size={16} />다운로드
        </Button>
        <Button variant="action" onClick={onPrint} className="flex items-center gap-1">
          <Printer size={16} />인쇄
        </Button>
        <Button variant="action" onClick={onDelete} className="flex items-center gap-1">
          <Trash2 size={16} />삭제
        </Button>
      </div>
    </div>
  )
}

const columns: Column[] = [
  { key: "id", label: "번호", minWidth: "50px" },
  { key: "factory", label: "공정", minWidth: "120px" },
  { key: "tbm", label: "TBM명", minWidth: "160px" },
  { key: "date", label: "실시일", minWidth: "108px" },
  { key: "start", label: "시작시간", minWidth: "104px" },
  { key: "end", label: "종료시간", minWidth: "104px" },
  { key: "duration", label: "실시시간", minWidth: "104px" },
  { key: "target", label: "대상", minWidth: "120px" },
  { key: "participants", label: "참여", minWidth: "120px" },
  { key: "leader", label: "실시자", minWidth: "96px" },
  {
    key: "manage",
    label: "관리",
    minWidth: 110,
    renderCell: (): React.ReactElement => (
      <button
        style={{ background: "none", border: "none", padding: 0, color: "#999999", cursor: "pointer", width: 110, textAlign: "center" }}
        onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
        onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
      >
        자세히보기/편집
      </button>
    ),
  },
]

const initialData: DataRow[] = [
  { id: 3, factory: "지게차 공정", tbm: "기계장비 안전사용 교육", date: "2025-06-01", start: "15:30", end: "16:30", duration: "1시간", target: "근로자 3명", participants: "근로자 3명", leader: "이동현" },
  { id: 2, factory: "프레스 공정", tbm: "프레스 안전작동 교육", date: "2025-06-01", start: "10:00", end: "12:00", duration: "2시간", target: "근로자 10명", participants: "근로자 7명", leader: "이동현" },
  { id: 1, factory: "지게차 공정", tbm: "신규직원 안전입문 교육", date: "2025-06-01", start: "13:30", end: "15:00", duration: "1시간 30분", target: "근로자 6명", participants: "근로자 6명", leader: "이동현" },
]

export default function TBMContent(): React.ReactElement {
  const navigate = useNavigate()
  const [startDate, setStartDate] = React.useState<string>("2025-06-16")
  const [endDate, setEndDate] = React.useState<string>("2025-12-16")
  const [searchText, setSearchText] = React.useState<string>("")
  const [data, setData] = React.useState<DataRow[]>(initialData)
  const [selectedIds, setSelectedIds] = React.useState<(number | string)[]>([])

  const handleRegister = (): void => navigate("/tbm/register")

  const handleGenerateQR = async (): Promise<void> => {
    if (selectedIds.length === 0) { alert("QR 생성할 항목을 선택하세요"); return }
    for (const id of selectedIds) {
      const row = data.find(d => String(d.id) === String(id))
      if (!row) continue
      const qrText = `TBM명: ${row.tbm}\n실시일: ${row.date}\n실시자: ${row.leader}`
      try {
        const dataUrl = await QRCode.toDataURL(qrText, { width: 300 })
        const link = document.createElement("a")
        link.href = dataUrl
        link.download = `QR_${row.id}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch {
        alert("QR 생성 실패")
      }
    }
  }

  const buildTbmInput = async (row: DataRow): Promise<RFTbmInput> => {
    let qrDataUrl: string | undefined
    try {
      const qrText = `TBM명: ${row.tbm}\n실시일: ${row.date}\n실시자: ${row.leader}`
      qrDataUrl = await QRCode.toDataURL(qrText, { width: 300 })
    } catch { qrDataUrl = undefined }
    return {
      id: row.id as number | string,
      factory: String(row.factory),
      tbmName: String(row.tbm),
      location: "교육장 A",
      date: String(row.date),
      startTime: String(row.start),
      endTime: String(row.end),
      durationText: String(row.duration),
      targetText: String(row.target),
      participantsText: String(row.participants),
      leader: String(row.leader),
      content: "1. 작업내용 및 절차 전달\n2. 위험성평가 내용 공유\n3. 비상시 행동요령 안내",
      remark: "개인보호구 착용 확인 및 장비 점검 완료",
      riskProcessTitle: String(row.factory),
      riskItems: [{ hazard: "전도/충돌 위험", countermeasure: "작업 전 TBM 실시, 안전모·안전화 착용" }],
      attendees: [
        { name: "홍길동", phone: "010-1111-2222" },
        { name: "김철수", phone: "010-3333-4444" }
      ],
      qrDataUrl,
      attachments: [{ name: "현장점검사진_2025-06-01.jpg" }]
    }
  }

  const handleDownload = async (): Promise<void> => {
    if (selectedIds.length === 0) { alert("다운로드할 항목을 선택하세요"); return }
    const id = selectedIds[0]
    const row = data.find(d => String(d.id) === String(id))
    if (!row) { alert("선택한 항목을 찾을 수 없습니다"); return }
    try {
      const input = await buildTbmInput(row)
      await ReportFormat.generate<RFTbmInput>("tbm", input)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      alert("리포트 생성 실패")
    }
  }

  const handlePrint = (): void => window.print()

  const handleDelete = (): void => {
    if (selectedIds.length === 0) { alert("삭제할 항목을 선택하세요"); return }
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setData(prev => prev.filter(row => !selectedIds.includes(row.id)))
      setSelectedIds([])
    }
  }

  return (
    <section className="tbm-content w-full bg-white">
      <PageTitle>TBM</PageTitle>
      <TabMenu tabs={["TBM 목록"]} activeIndex={0} onTabClick={() => {}} className="mb-6" />
      <FilterBar
        startDate={startDate}
        endDate={endDate}
        onStartDate={setStartDate}
        onEndDate={setEndDate}
        searchText={searchText}
        onSearchText={setSearchText}
        onSearch={() => {}}
      />
      <ActionButtons
        totalCount={data.length}
        selectedIds={selectedIds}
        onRegister={handleRegister}
        onGenerateQR={handleGenerateQR}
        onPrint={handlePrint}
        onDelete={handleDelete}
        onDownload={handleDownload}
      />
      <div className="overflow-x-auto bg-white">
        <DataTable columns={columns} data={data} onCheckedChange={setSelectedIds} />
      </div>
    </section>
  )
}
