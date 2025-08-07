import React, { useState } from "react"
import Button from "@/components/common/base/Button"
import DataTable, { Column, DataRow } from "@/components/common/tables/DataTable"
import { X, ChevronDown } from "lucide-react"
import LoadListDialogTBM from "./LoadListDialogTBM"
import LoadListDialogGroup from "./LoadListDialogGroup"
import { Field } from "@/components/common/forms/FormScreen"

interface Attendee { name: string; phone: string }
interface Item { id: string | number; registrationDate: string; siteName: string; tbmName: string; attendeeCount: number; attendeeList: string }
interface DeptGroupItem { id: string | number; departmentName: string; groupLeader: string; memberCount: number; memberList: string }
interface Props { attendees: Attendee[]; onAdd: (att: Attendee) => void; onRemove: (idx: number) => void }

export default function AttendeePanel({ attendees, onAdd, onRemove }: Props) {
  const [values, setValues] = useState<{ [key: string]: string }>({
    name: "",
    phonePrefix: "010",
    phoneMiddle: "",
    phoneLast: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAdd = () => {
    const fullPhone = `${values.phonePrefix}-${values.phoneMiddle}-${values.phoneLast}`
    if (!values.name.trim()) return alert("이름을 입력해주세요")
    if (!values.phoneMiddle.trim() || !values.phoneLast.trim()) return alert("전화번호를 정확히 입력해주세요")
    onAdd({ name: values.name, phone: fullPhone })
    setValues({ name: "", phonePrefix: "010", phoneMiddle: "", phoneLast: "" })
  }

  const renderInput = (field: Field) => {
    const BORDER_COLOR = "#AAAAAA"
    const COMMON_BORDER = `border border-[${BORDER_COLOR}] rounded-[8px]`
    const COMMON_PLACEHOLDER = "placeholder:font-normal placeholder:text-[#86939A] placeholder:text-sm md:placeholder:text-[15px]"
    const COMMON_TEXT = "text-sm md:text-[15px] font-medium"
    const BG_EDITABLE = "bg-white text-[#333639]"
    const BASE_INPUT = `${COMMON_BORDER} px-2 h-[39px] w-full appearance-none ${COMMON_PLACEHOLDER} ${COMMON_TEXT}`
    const isRequired = field.required !== false
    const requiredAttrs = isRequired ? { required: true } : {}

    if (field.type === "text") {
      return (
        <input
          type="text"
          name={field.name}
          value={values[field.name] || ""}
          onChange={handleChange}
          placeholder={field.placeholder}
          maxLength={20}
          onKeyDown={e => {
            if (!/[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]/.test(e.key) && !["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(e.key)) {
              e.preventDefault()
            }
          }}
          onPaste={e => e.preventDefault()}
          className={`${BASE_INPUT} ${BG_EDITABLE}`}
          {...requiredAttrs}
        />
      )
    }

    if (field.type === "phone") {
      return (
        <div className="flex items-center gap-2 w-full">
          <div className="relative basis-1/3">
            <select
              name="phonePrefix"
              value={values.phonePrefix || "010"}
              onChange={handleChange}
              className={`${BASE_INPUT} ${BG_EDITABLE} pr-8 w-full text-sm md:text-[15px]`}
              {...requiredAttrs}
            >
              <option value="010">010</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
          </div>

          <span className="text-sm md:text-[15px] text-[#333639]">-</span>

          <input
            type="text"
            name="phoneMiddle"
            value={values.phoneMiddle || ""}
            onChange={handleChange}
            maxLength={4}
            inputMode="numeric"
            pattern="[0-9]*"
            className={`${BASE_INPUT} ${BG_EDITABLE} basis-1/3`}
            onKeyDown={e => {
              if (!/[0-9]/.test(e.key) && !["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(e.key)) {
                e.preventDefault()
              }
            }}
            {...requiredAttrs}
          />

          <span className="text-sm md:text-[15px] text-[#333639]">-</span>

          <input
            type="text"
            name="phoneLast"
            value={values.phoneLast || ""}
            onChange={handleChange}
            maxLength={4}
            inputMode="numeric"
            pattern="[0-9]*"
            className={`${BASE_INPUT} ${BG_EDITABLE} basis-1/3`}
            onKeyDown={e => {
              if (!/[0-9]/.test(e.key) && !["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(e.key)) {
                e.preventDefault()
              }
            }}
            {...requiredAttrs}
          />
        </div>
      )
    }

    return null
  }

  const fields: Field[] = [
    { label: "이름", name: "name", type: "text", placeholder: "이름을 입력해주세요", required: true },
    { label: "전화번호", name: "phone", type: "phone", required: true }
  ]

  const columns: Column[] = [
    { key: "name", label: "이름", minWidth: 80 },
    { key: "phone", label: "휴대폰", minWidth: 60 },
    { key: "signature", label: "서명", minWidth: 50 },
  ]

  const data: DataRow[] = attendees.map((att, idx) => ({ id: idx, name: att.name, phone: att.phone }))

  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false)
  const [loadItems, setLoadItems] = useState<Item[]>([])
  const [isDeptGroupDialogOpen, setIsDeptGroupDialogOpen] = useState(false)

  const [deptGroupItems, setDeptGroupItems] = useState<DeptGroupItem[]>([
    { id: 1, departmentName: "안전관리팀", groupLeader: "최영희", memberCount: 4, memberList: "김철수, 박철수, 이영희, 정민수" },
    { id: 2, departmentName: "품질관리팀", groupLeader: "박철수", memberCount: 5, memberList: "최영희, 김민수, 이정희, 강철수, 송민호" },
    { id: 3, departmentName: "공정관리팀", groupLeader: "이민호", memberCount: 3, memberList: "박철수, 김영희, 최민수" },
    { id: 4, departmentName: "설비관리팀", groupLeader: "김영희", memberCount: 5, memberList: "이민호, 정철수, 박민호, 김영희, 최영희" }
  ])

  const exampleLoadItems: Item[] = [
    { id: 1, registrationDate: "2025-07-20", siteName: "서울시 3호선 현장", tbmName: "TBM-A3", attendeeCount: 6, attendeeList: "홍길동, 김영수, 이재훈, 박민호, 최안전, 정태호" },
    { id: 2, registrationDate: "2025-07-19", siteName: "부산 신항만 공사", tbmName: "TBM-B1", attendeeCount: 5, attendeeList: "홍길동, 이수정, 박안전, 김근로, 최안전" },
    { id: 3, registrationDate: "2025-07-17", siteName: "광주 도시철도 2호선", tbmName: "TBM-C2", attendeeCount: 7, attendeeList: "김영희, 이철수, 정민수, 송민호, 박강현, 홍길동, 최지우" },
    { id: 4, registrationDate: "2025-07-15", siteName: "대전 외곽순환도로", tbmName: "TBM-D4", attendeeCount: 6, attendeeList: "이안전, 김근로, 최근로, 박안전, 최안전, 홍길동" },
    { id: 5, registrationDate: "2025-07-14", siteName: "인천공항 제5활주로", tbmName: "TBM-E5", attendeeCount: 8, attendeeList: "이강수, 홍지민, 박민재, 김서준, 윤지현, 정예은, 한지훈, 고성민" }
  ]

  return (
    <div className="flex flex-col h-full">
      <section className="flex-grow overflow-y-auto mb-8 border border-[#F3F3F3] rounded-[16px] p-3 min-h-[300px]">
        <DataTable columns={columns} data={data} selectable={false} />
        {data.length === 0 && (
          <div className="w-full text-center text-gray-500 mt-10 whitespace-pre-line text-sm leading-relaxed select-none">
            참석자 등록을 하지 않아도 됩니다.{"\n"}저장 시 생성된 QR코드로 근로자가 모바일 서명을 하면 자동 등록됩니다.
          </div>
        )}
      </section>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[#333639] font-semibold text-lg">참석자 등록하기</h3>
          <div className="flex space-x-1">
            <Button
              variant="action"
              onClick={() => {
                setLoadItems(exampleLoadItems)
                setIsLoadDialogOpen(true)
              }}
            >
              이전 내역 불러오기
            </Button>
            <Button variant="action" onClick={() => setIsDeptGroupDialogOpen(true)}>부서별 불러오기</Button>
          </div>
        </div>

        <section className="border border-[#F3F3F3] rounded-[16px] p-4 min-h-[180px]">
          <div className="flex mb-4 gap-3">
            <div className="flex flex-col flex-1 gap-2">
              {fields.map(f => <div key={f.name}>{renderInput(f)}</div>)}
            </div>
            <div className="flex flex-col justify-center">
              <Button variant="primary" className="h-full min-h-[88px] px-6" onClick={handleAdd}>등록</Button>
            </div>
          </div>
        </section>
      </div>

      <LoadListDialogTBM
        isOpen={isLoadDialogOpen}
        items={loadItems}
        onChangeSelected={id => alert(`선택된 TBM 내역 ID: ${id}`)}
        onClose={() => setIsLoadDialogOpen(false)}
      />

      <LoadListDialogGroup
        isOpen={isDeptGroupDialogOpen}
        items={deptGroupItems}
        onChangeSelected={id => alert(`선택된 부서 그룹 ID: ${id}`)}
        onClose={() => setIsDeptGroupDialogOpen(false)}
      />
    </div>
  )
}
