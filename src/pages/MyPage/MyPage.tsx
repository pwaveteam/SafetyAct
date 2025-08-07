import React, { useState } from "react"
import FormScreen from "@/components/common/forms/FormScreen"
import Button from "@/components/common/base/Button"
import PageTitle from "@/components/common/base/PageTitle"

export default function MyPage() {
const [values, setValues] = useState<{ [key: string]: string }>({ username: "박관리", phonePrefix: "010", phoneMiddle: "", phoneLast: "", emailId: "", emailDomain: "", emailDomainSelect: "", currentPassword: "******", newPassword: "", confirmPassword: "", signature: "/images/sample-signature.png" })

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setValues(prev => ({ ...prev, [name]: value })) }

const handleDomainSelect = (domain: string) => { setValues(prev => ({ ...prev, emailDomain: domain, emailDomainSelect: domain })) }

const handleSubmit = () => { console.log("폼 제출", values) }

const fields = [ { label: "아이디", name: "username", type: "readonly" }, { label: "현재 비밀번호", name: "currentPassword", type: "password" }, { label: "새 비밀번호", name: "newPassword", type: "password" }, { label: "비밀번호 확인", name: "confirmPassword", type: "password", buttonRender: <Button variant="action">비밀번호 확인</Button> }, { label: "휴대전화번호", name: "phone", type: "phone", buttonRender: <Button variant="action">인증하기</Button> }, { label: "이메일", name: "email", type: "email" }, { label: "서명", name: "signature", type: "signature" } ]

return (<section className="mypage-content w-full"><PageTitle>마이페이지</PageTitle><FormScreen fields={fields} values={values} onChange={handleChange} onEmailDomainSelect={handleDomainSelect} onSubmit={handleSubmit} /><div className="flex justify-end mt-5"><Button variant="primary" onClick={handleSubmit}>저장하기</Button></div></section>)
}