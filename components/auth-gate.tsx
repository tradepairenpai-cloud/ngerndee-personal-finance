"use client";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { CircleDollarSign, LoaderCircle } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

export default function AuthGate({children}:{children:React.ReactNode}) {
  const supabase = getSupabase();
  const [session,setSession] = useState<Session|null>(null);
  const [loading,setLoading] = useState(Boolean(supabase));
  const [mode,setMode] = useState<"signin"|"signup"|"verify">("signin");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [otp,setOtp] = useState("");
  const [message,setMessage] = useState("");

  useEffect(()=>{
    if(!supabase) return;
    supabase.auth.getSession().then(({data})=>{setSession(data.session);setLoading(false)});
    const {data}=supabase.auth.onAuthStateChange((_event,next)=>setSession(next));
    return ()=>data.subscription.unsubscribe();
  },[supabase]);

  if(!supabase) return children;
  if(loading) return <div className="grid min-h-screen place-items-center bg-[#f3f6f5]"><LoaderCircle className="animate-spin text-[#123f36]" size={36}/></div>;
  if(session) return children;

  async function submit(){
    if(!supabase||!email||!password) return setMessage("กรุณากรอกอีเมลและรหัสผ่าน");
    setLoading(true);setMessage("");
    if(mode==="signin"){
      const {error}=await supabase.auth.signInWithPassword({email,password});
      if(error)setMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }else{
      const {error}=await supabase.auth.signUp({email,password});
      if(error)setMessage(error.message);else{setMode("verify");setMessage("ส่งรหัสยืนยันไปยังอีเมลแล้ว")}
    }
    setLoading(false);
  }
  async function verify(){
    if(!supabase) return;
    setLoading(true);
    const {error}=await supabase.auth.verifyOtp({email,token:otp,type:"email"});
    if(error)setMessage("รหัสไม่ถูกต้องหรือหมดอายุ");
    setLoading(false);
  }

  return <main className="grid min-h-screen place-items-center bg-[#eef3f1] p-4"><section className="w-full max-w-md rounded-3xl border border-[#dbe5e1] bg-white p-7 shadow-xl"><div className="mb-7 flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#123f36] text-white"><CircleDollarSign/></span><div><h1 className="text-xl font-bold">เงินดี</h1><p className="text-sm text-[#71807b]">บัญชีส่วนตัวของคุณ</p></div></div>{mode==="verify"?<div><h2 className="text-lg font-bold">ยืนยันอีเมล</h2><p className="mt-1 text-sm text-[#71807b]">กรอกรหัส 6 หลักที่ส่งไปยัง {email}</p><input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} inputMode="numeric" autoComplete="one-time-code" className="mt-5 w-full rounded-xl border border-[#cddad5] px-4 py-3 text-center text-2xl tracking-[.4em]" placeholder="000000"/><button onClick={verify} disabled={loading} className="mt-4 w-full rounded-xl bg-[#123f36] py-3 font-bold text-white">{loading?"กำลังตรวจสอบ...":"ยืนยันรหัส"}</button></div>:<div><h2 className="text-lg font-bold">{mode==="signin"?"เข้าสู่ระบบ":"สร้างบัญชี"}</h2><label className="mt-5 block text-sm font-semibold">อีเมล<input value={email} onChange={e=>setEmail(e.target.value)} type="email" autoComplete="email" className="mt-1.5 w-full rounded-xl border border-[#cddad5] px-4 py-3 font-normal" placeholder="you@example.com"/></label><label className="mt-4 block text-sm font-semibold">รหัสผ่าน<input value={password} onChange={e=>setPassword(e.target.value)} type="password" autoComplete={mode==="signin"?"current-password":"new-password"} minLength={10} className="mt-1.5 w-full rounded-xl border border-[#cddad5] px-4 py-3 font-normal" placeholder="อย่างน้อย 10 ตัวอักษร"/></label><button onClick={submit} disabled={loading} className="mt-5 w-full rounded-xl bg-[#123f36] py-3 font-bold text-white">{loading?"กรุณารอ...":mode==="signin"?"เข้าสู่ระบบ":"สมัครและรับรหัสยืนยัน"}</button><button onClick={()=>{setMode(mode==="signin"?"signup":"signin");setMessage("")}} className="mt-4 w-full text-sm font-semibold text-[#1d6755]">{mode==="signin"?"ยังไม่มีบัญชี? สมัครใช้งาน":"มีบัญชีแล้ว? เข้าสู่ระบบ"}</button></div>}{message&&<p className="mt-4 rounded-xl bg-[#f4f7f5] p-3 text-sm">{message}</p>}<p className="mt-6 text-center text-xs leading-5 text-[#7b8883]">ข้อมูลทางการเงินจะแยกตามบัญชีผู้ใช้และป้องกันด้วยนโยบายฐานข้อมูล</p></section></main>;
}
