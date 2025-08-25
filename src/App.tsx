// src/App.tsx
import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import MainLayout from "./components/layout/MainLayout"
import RiskAssessmentLayout from "./components/layout/RiskAssessmentLayout"
import BusinessManagementLayout from "./components/layout/BusinessManagementLayout"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard/Dashboard"

import TBM from "./pages/TBM/TBM"
import TBMRegister from "./pages/TBM/TBMRegister"

import BasicManagement from "./pages/BusinessManagement/BasicManagement"
import PolicyGoal from "./pages/BusinessManagement/PolicyGoal"
import Budget from "./pages/BusinessManagement/Budget"
import Organization from "./pages/BusinessManagement/Organization"

import EvaluationList from "./pages/RiskAssessment/EvaluationList"

// Frequency
import FrequencyStep1 from "./pages/RiskAssessment/methods/Frequency/FrequencyStep1"
import FrequencyStep2 from "./pages/RiskAssessment/methods/Frequency/FrequencyStep2"
import FrequencyStep3 from "./pages/RiskAssessment/methods/Frequency/FrequencyStep3"

// Checklist
import ChecklistStep1 from "./pages/RiskAssessment/methods/Checklist/ChecklistStep1"
import ChecklistStep2 from "./pages/RiskAssessment/methods/Checklist/ChecklistStep2"
import ChecklistStep3 from "./pages/RiskAssessment/methods/Checklist/ChecklistStep3"

// ThreeStep
import ThreeStep1 from "./pages/RiskAssessment/methods/ThreeStep/ThreeStep1"
import ThreeStep2 from "./pages/RiskAssessment/methods/ThreeStep/ThreeStep2"
import ThreeStep3 from "./pages/RiskAssessment/methods/ThreeStep/ThreeStep3"

// Chemical
import ChemicalStep1 from "./pages/RiskAssessment/methods/Chemical/ChemicalStep1"
import ChemicalStep2 from "./pages/RiskAssessment/methods/Chemical/ChemicalStep2"
import ChemicalStep3 from "./pages/RiskAssessment/methods/Chemical/ChemicalStep3"


import NearMiss from "./pages/NearMiss/NearMiss"
import SafeVoice from "./pages/NearMiss/SafeVoice"

import RegularEducation from "./pages/SafetyEducation/OSHEducation"

import AssetMachine from "./pages/AssetManagement/AssetMachine"
import AssetHazard from "./pages/AssetManagement/AssetHazard"

import Partners from "./pages/SupplyChainManagement/Partners"
import Evaluation from "./pages/SupplyChainManagement/Evaluation"
import Committee from "./pages/SupplyChainManagement/Committee"
import SiteAudit from "./pages/SupplyChainManagement/SiteAudit"
import Training from "./pages/SupplyChainManagement/Training"

import SafetyWorkPermit from "./pages/SafetyWorkPermit/SafetyWorkPermit"
import ResponseManual from "./pages/ResponseManual/ResponseManual"
import NoticeList from "./pages/NoticeBoard/NoticeList"
import ResourcesList from "./pages/NoticeBoard/ResourcesList"
import LawBoard from "./pages/NoticeBoard/LawBoard"

import ReceivedApproval from "./pages/ApprovalBox/ReceivedApproval"
import SentApproval from "./pages/ApprovalBox/SentApproval"

import QRManagement from "./pages/QRManagement/QR"
import MyPage from "./pages/MyPage/MyPage"
import Support from "./pages/Support/Support"
import UserGuide from "./pages/UserGuide/UserGuide"

const App: React.FC = () => (
<BrowserRouter>
<Routes>

<Route path="/login" element={<Login />} />

<Route element={<MainLayout />}>
<Route path="/" element={<Navigate to="/dashboard" replace />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/tbm" element={<TBM />} />
<Route path="/tbm/register" element={<TBMRegister />} />

<Route path="/nearmiss" element={<NearMiss />} />
<Route path="/nearmiss/*" element={<Navigate to="/nearmiss" replace />} />
<Route path="/nearmiss/safevoice" element={<SafeVoice />} />
<Route path="/nearmiss/safevoice/*" element={<Navigate to="/nearmiss/safevoice" replace />} />

<Route path="/safety-education" element={<RegularEducation />} />

<Route path="/asset-management" element={<Navigate to="/asset-management/machine" replace />} />
<Route path="/asset-management/machine" element={<AssetMachine />} />
<Route path="/asset-management/hazard" element={<AssetHazard />} />

<Route path="/supply-chain-management" element={<Navigate to="/supply-chain-management/partners" replace />} />
<Route path="/supply-chain-management/partners" element={<Partners />} />
<Route path="/supply-chain-management/evaluation" element={<Evaluation />} />
<Route path="/supply-chain-management/committee" element={<Committee />} />
<Route path="/supply-chain-management/siteaudit" element={<SiteAudit />} />
<Route path="/supply-chain-management/training" element={<Training />} />

<Route path="/notice-board" element={<Navigate to="/notice-board/notice" replace />} />
<Route path="/notice-board/notice" element={<NoticeList />} />
<Route path="/notice-board/resources" element={<ResourcesList />} />
<Route path="/notice-board/law" element={<LawBoard />} />

<Route path="/safety-work-permit" element={<SafetyWorkPermit />} />
<Route path="/response-manual" element={<ResponseManual />} />

<Route path="/approval-box" element={<Navigate to="/approval-box/received" replace />} />
<Route path="/approval-box/received" element={<ReceivedApproval />} />
<Route path="/approval-box/sent" element={<SentApproval />} />

<Route path="/qr-management" element={<QRManagement />} />
<Route path="/mypage" element={<MyPage />} />
<Route path="/support" element={<Support />} />
<Route path="/user-guide" element={<UserGuide />} />
</Route>

<Route element={<BusinessManagementLayout />}>
<Route path="/business-management" element={<Navigate to="/business-management/basic" replace />} />
<Route path="/business-management/basic" element={<BasicManagement />} />
<Route path="/business-management/policy-goal" element={<PolicyGoal />} />
<Route path="/business-management/budget" element={<Budget />} />
<Route path="/business-management/organization" element={<Organization />} />
</Route>

<Route element={<RiskAssessmentLayout />}>
<Route path="/risk-assessment" element={<Navigate to="/risk-assessment/list" replace />} />
<Route path="/risk-assessment/list" element={<EvaluationList />} />

<Route path="/risk-assessment/methods/frequency/step1" element={<FrequencyStep1 />} />
<Route path="/risk-assessment/methods/frequency/step2" element={<FrequencyStep2 />} />
<Route path="/risk-assessment/methods/frequency/step3" element={<FrequencyStep3 />} />

<Route path="/risk-assessment/methods/checklist/step1" element={<ChecklistStep1 />} />
<Route path="/risk-assessment/methods/checklist/step2" element={<ChecklistStep2 />} />
<Route path="/risk-assessment/methods/checklist/step3" element={<ChecklistStep3 />} />

<Route path="/risk-assessment/methods/threestep/step1" element={<ThreeStep1 />} />
<Route path="/risk-assessment/methods/threestep/step2" element={<ThreeStep2 />} />
<Route path="/risk-assessment/methods/threestep/step3" element={<ThreeStep3 />} />

<Route path="/risk-assessment/methods/chemical/step1" element={<ChemicalStep1 />} />
<Route path="/risk-assessment/methods/chemical/step2" element={<ChemicalStep2 />} />
<Route path="/risk-assessment/methods/chemical/step3" element={<ChemicalStep3 />} />

</Route>

</Routes>
</BrowserRouter>
)

export default App