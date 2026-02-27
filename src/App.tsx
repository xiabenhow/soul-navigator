import React, { useEffect, useMemo, useState } from "react";
import { Image as ImageIcon, LayoutDashboard, Monitor, PencilLine, PlusCircle, Settings, Save, Loader2, Check } from "lucide-react";

// Firebase Imports
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0glWkM8VJgLQJpBDY5DhIl8qCM8bym4k",
  authDomain: "travel-4b894.firebaseapp.com",
  projectId: "travel-4b894",
  storageBucket: "travel-4b894.firebasestorage.app",
  messagingSenderId: "720636986328",
  appId: "1:720636986328:web:93f1caf9a4e204b56ee8ad",
  measurementId: "G-60FSVH9ZEY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const defaultPageData = {
  brandName: "靈魂導航 Soul Navigator",
  brandLabel: "Mind · Body · Spirit",
  navItems: ["首頁", "品牌理念", "服務方案", "適合你的路徑", "企業合作", "內容專區", "常見問題", "預約諮詢"],
  heroBadge: "命理 × 家族系統 × 人生決策引導",
  heroTitle: "不是算一次，而是陪你走過人生的關鍵階段",
  heroText: "有些問題，不是你不夠努力，而是你正走在一條反覆承接的路上。我們協助你看清人生主線、鬆動重複模式，回到更清晰、更穩定的位置。",
  heroPrimary: "找到適合我的方案",
  heroSecondary: "預約初次諮詢",
  heroImage: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
  heroCardTitle: "品牌定位",
  heroCardText: "人生階段陪跑型顧問品牌，從理解自己到長期陪伴與高階決策支持。",
  philosophyTitle: "從一次性服務，升級為一段人生旅程方案",
  philosophyText: "單項服務只是工具，真正有價值的是協助個人、家庭與組織看見結構、調整方向，並在關鍵轉折期被穩定地陪伴。",
  services: [
    { title: "人生主線初探", desc: "第一次接觸、想理解自己的人。", cta: "查看詳情", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80" },
    { title: "人生卡關修復計畫", desc: "短期聚焦關係、工作與決策壓力。", cta: "查看詳情", image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80" },
    { title: "年度生命導航", desc: "以年度節奏做長期陪伴與校準。", cta: "查看詳情", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80" },
  ],
  aboutTitle: "你不需要先懂術語，只要先知道自己現在卡在哪裡",
  aboutText: "用情境式入口與清楚的文字說明，讓沒有命理背景的訪客也能輕鬆理解並找到適合的方案。",
  aboutImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
  ctaTitle: "簡單、安心、有引導的預約流程",
  ctaText: "先填寫需求，再由顧問協助判斷適合方案，降低使用者選擇壓力。",
  footerText: "以命理、家族系統與整合式引導為基礎，打造一個溫柔但專業、可長期陪伴的人生支持品牌。",
};

function TextField({ label, value, onChange, multiline = false }: any) {
  const baseClass = "w-full rounded-2xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500";
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-stone-700">{label}</span>
      {multiline ? (
        <textarea rows={4} className={baseClass} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={baseClass} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function ImageField({ label, value, onChange, onUpload }: any) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <input className="w-full rounded-2xl border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500" value={value} onChange={(e) => onChange(e.target.value)} placeholder="貼上圖片網址" />
      <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-700 transition hover:bg-stone-100">
        <ImageIcon className="h-4 w-4" /> 上傳圖片
        <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) onUpload(URL.createObjectURL(file)); }} />
      </label>
      {value && <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100"><img src={value} alt={label} className="h-28 w-full object-cover" /></div>}
    </div>
  );
}

function SectionCard({ title, children }: any) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2"><PencilLine className="h-4 w-4 text-stone-500" /><h3 className="text-sm font-semibold text-stone-800">{title}</h3></div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function SitePreview({ data }: any) {
  return (
    <div className="min-h-full bg-stone-50 text-stone-800">
      <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <div><div className="text-xs uppercase tracking-[0.35em] text-stone-500">{data.brandLabel}</div><div className="mt-1 text-lg font-semibold">{data.brandName}</div></div>
          <nav className="hidden gap-6 lg:flex">{data.navItems.map((item: any) => <a key={item} href="#" className="text-sm text-stone-600 transition hover:text-stone-900">{item}</a>)}</nav>
          <button className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium transition hover:bg-stone-900 hover:text-white">立即預約</button>
        </div>
      </header>
      <main>
        <section className="border-b border-stone-200">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-2 lg:px-10 lg:py-20">
            <div className="flex flex-col justify-center">
              <div className="mb-4 inline-flex w-fit rounded-full bg-white px-4 py-2 text-xs font-medium tracking-[0.25em] text-stone-500 shadow-sm">{data.heroBadge}</div>
              <h1 className="max-w-xl text-4xl font-semibold leading-tight md:text-5xl">{data.heroTitle}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-stone-600 md:text-lg">{data.heroText}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button className="rounded-full bg-stone-900 px-6 py-3 text-center text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5">{data.heroPrimary}</button>
                <button className="rounded-full border border-stone-300 bg-white px-6 py-3 text-center text-sm font-medium transition hover:bg-stone-100">{data.heroSecondary}</button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
              <img src={data.heroImage} alt="Hero" className="h-full min-h-[360px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-stone-900/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/20 bg-white/90 p-5 shadow-sm backdrop-blur">
                <div className="text-sm text-stone-500">{data.heroCardTitle}</div>
                <div className="mt-2 text-xl font-semibold">{data.brandName}</div>
                <p className="mt-2 text-sm leading-7 text-stone-600">{data.heroCardText}</p>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
          <div className="max-w-3xl"><div className="text-sm font-medium tracking-[0.25em] text-stone-500">BRAND PHILOSOPHY</div><h2 className="mt-3 text-3xl font-semibold">{data.philosophyTitle}</h2><p className="mt-5 leading-8 text-stone-600">{data.philosophyText}</p></div>
        </section>
        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
            <h2 className="text-3xl font-semibold">服務區塊</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {data.services.map((service: any, idx: number) => (
                <div key={idx} className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-50 shadow-sm">
                  <img src={service.image} alt={service.title} className="h-44 w-full object-cover" />
                  <div className="p-6"><h3 className="text-xl font-semibold">{service.title}</h3><p className="mt-3 text-sm leading-7 text-stone-600">{service.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-stone-900 text-stone-300 p-10"><div className="mx-auto max-w-7xl text-center"><div className="text-lg font-semibold text-white">{data.brandName}</div><p className="mt-4 text-sm">{data.footerText}</p></div></footer>
    </div>
  );
}

export default function SoulNavigatorBuilder() {
  const [pageData, setPageData] = useState(defaultPageData);
  const [activeTab, setActiveTab] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 實時讀取雲端資料
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "website", "content"), (snap) => {
      if (snap.exists()) setPageData(snap.data() as any);
    });
    return () => unsub();
  }, []);

  const saveToCloud = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "website", "content"), pageData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error("Save Error:", e);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: any) => setPageData((prev) => ({ ...prev, [key]: value }));
  const updateService = (index: number, field: string, value: any) => {
    setPageData((prev) => ({
      ...prev,
      services: prev.services.map((service, idx) => (idx === index ? { ...service, [field]: value } : service)),
    }));
  };

  const tabs = [
    { key: "hero", label: "首頁首屏", icon: LayoutDashboard },
    { key: "philosophy", label: "品牌理念", icon: PencilLine },
    { key: "services", label: "服務區塊", icon: PlusCircle },
    { key: "settings", label: "基本設定", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100 text-stone-800 font-sans">
      <div className="grid min-h-screen lg:grid-cols-[380px_1fr]">
        <aside className="border-r border-stone-200 bg-white flex flex-col">
          <div className="border-b border-stone-200 px-5 py-5">
            <h1 className="text-xl font-bold">Soul Navigator 後台</h1>
            <p className="text-xs text-stone-500 mt-1 uppercase tracking-widest">Cloud Sync Active</p>
          </div>
          <div className="p-3 grid gap-1">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${activeTab === tab.key ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-50"}`}>
                <tab.icon className="h-4 w-4" />{tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === "hero" && (
              <SectionCard title="首頁首屏設定">
                <TextField label="品牌名稱" value={pageData.brandName} onChange={(v: any) => updateField("brandName", v)} />
                <TextField label="主標題" value={pageData.heroTitle} onChange={(v: any) => updateField("heroTitle", v)} multiline />
                <TextField label="說明文字" value={pageData.heroText} onChange={(v: any) => updateField("heroText", v)} multiline />
                <ImageField label="首頁主圖" value={pageData.heroImage} onChange={(v: any) => updateField("heroImage", v)} onUpload={(v: any) => updateField("heroImage", v)} />
              </SectionCard>
            )}
            {activeTab === "services" && pageData.services.map((s, i) => (
              <SectionCard key={i} title={`服務區塊 ${i + 1}`}>
                <TextField label="標題" value={s.title} onChange={(v: any) => updateService(i, "title", v)} />
                <TextField label="說明" value={s.desc} onChange={(v: any) => updateService(i, "desc", v)} multiline />
              </SectionCard>
            ))}
            {activeTab === "settings" && (
              <SectionCard title="基本設定">
                <TextField label="品牌標籤" value={pageData.brandLabel} onChange={(v: any) => updateField("brandLabel", v)} />
                <TextField label="頁腳說明" value={pageData.footerText} onChange={(v: any) => updateField("footerText", v)} multiline />
              </SectionCard>
            )}
          </div>
        </aside>
        <section className="h-screen overflow-y-auto relative">
          <div className="sticky top-0 z-30 flex items-center justify-between border-b border-stone-200 bg-white/80 backdrop-blur px-6 py-3">
            <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-xs font-medium text-stone-500">正在預覽雲端同步版本</span></div>
            <Button onClick={saveToCloud} disabled={saving} className={`rounded-full px-6 transition-all ${saved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-stone-900"}`}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : saved ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {saving ? "正在儲存..." : saved ? "已儲存到雲端" : "儲存並發布"}
            </Button>
          </div>
          <SitePreview data={pageData} />
        </section>
      </div>
    </div>
  );
}
