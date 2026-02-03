import React, { useState, useEffect } from "react";
import { Program } from "../types";
import { Icons } from "../constants";
import { neon } from "@neondatabase/serverless";

interface ProgramDetailProps {
  program: Program;
  onClose: () => void;
}

const RegistrationForm = ({ program }: { program: Program }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", mobile: "", age: "", profession: "", read: "", want: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Styling
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Gulzar:wght@400;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    .reg-scope { font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; }
    .reg-scope .urdu { font-family: 'Gulzar', serif; direction: rtl; line-height: 1.6; }
    .reg-scope .btn-option, .reg-scope .btn-primary { width: 100%; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 0.9rem; }
    .reg-scope .btn-option { border: 1px solid #e2e8f0; background: #fff; color: #1e293b; }
    .reg-scope .btn-option.selected { border-color: #0F5132; background: #f0fdf4; color: #072e1d; }
    .reg-scope .btn-primary { background: #0F5132; color: white; border: none; margin-top: 8px; }
    .reg-scope input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 6px; font-size: 0.9rem; }
  `;

  // Handlers
  const handleOptionSelect = (stepNum: number, value: string) => {
    setFormData((prev) => ({ ...prev, [stepNum === 1 ? "read" : "want"]: value }));
    setTimeout(() => setStep(stepNum + 1), 200);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.mobile) return alert("Name & Mobile required");
    setIsSubmitting(true);
    try {
      const sql = neon("postgresql://neondb_owner:npg_j7SFZqzR5the@ep-empty-rice-a18ykd4a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
      const ts = new Date().toISOString();
      const loc = program.venue || "Kashmir Plaza";
      const phone = formData.mobile.replace(/\D/g, "").replace(/^0/, "92");

      await sql`CREATE TABLE IF NOT EXISTS "registration-kashmir-plaza" (id SERIAL PRIMARY KEY, timestamp TEXT, location TEXT, read TEXT, want TEXT, name TEXT, mobile TEXT, age TEXT, profession TEXT)`;
      await sql`INSERT INTO "registration-kashmir-plaza" (timestamp, location, read, want, name, mobile, age, profession) VALUES (${ts}, ${loc}, ${formData.read}, ${formData.want}, ${formData.name}, ${phone}, ${formData.age}, ${formData.profession})`;

      fetch("https://n8n.premierchoiceint.online/webhook/registration-trigger", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_name: formData.name, user_phone: phone, venue: loc }) }).catch(() => { });

      setIsSuccess(true);
      setStep(4);
    } catch (e) { console.error(e); alert("Failed"); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="reg-scope w-full bg-slate-50 p-3 rounded-xl border border-slate-100">
      <style>{styles}</style>

      {!isSuccess && <div className="flex justify-center gap-1 mb-3">{[1, 2, 3].map(s => <div key={s} className={`h-1 duration-300 rounded-full transition-all ${step === s ? 'w-5 bg-[#0F5132]' : 'w-1 bg-slate-300'}`} />)}</div>}

      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-right-4 text-center">
          <h3 className="font-bold text-[#0F5132] mb-0.5 text-sm">Have you read Quran w/ Translation?</h3>
          <p className="text-xs text-slate-500 mb-3 urdu">کیا آپ نے قرآن ترجمہ سے پڑھا ہے؟</p>
          <div className="flex gap-2">
            <button className={`btn-option flex-1 ${formData.read === 'Yes' ? 'selected' : ''}`} onClick={() => handleOptionSelect(1, 'Yes')}>Yes</button>
            <button className={`btn-option flex-1 ${formData.read === 'No' ? 'selected' : ''}`} onClick={() => handleOptionSelect(1, 'No')}>No</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-4 text-center">
          <h3 className="font-bold text-[#0F5132] mb-1 text-sm">Join for Translation?</h3>
          <p className="text-xs text-slate-500 mb-3 urdu">کیا آپ اس میں شامل ہونا چاہتے ہیں؟</p>
          <div className="flex gap-2 mb-2">
            <button className={`btn-option flex-1 ${formData.want === 'Yes' ? 'selected' : ''}`} onClick={() => handleOptionSelect(2, 'Yes')}>Yes</button>
            <button className={`btn-option flex-1 ${formData.want === 'Maybe' ? 'selected' : ''}`} onClick={() => handleOptionSelect(2, 'Maybe')}>Maybe Later</button>
          </div>
          <button className="text-[10px] w-full text-slate-400" onClick={() => setStep(1)}>Go Back</button>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-right-4 space-y-1">
          <h3 className="text-center font-bold text-[#0F5132] mb-2 text-sm">Finish Sign Up</h3>
          <input placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <input type="tel" placeholder="WhatsApp (e.g. 0300...)" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} />
          <div className="flex gap-2">
            <input type="number" placeholder="Age" className="w-16" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
            <input placeholder="Profession" className="flex-1" value={formData.profession} onChange={e => setFormData({ ...formData, profession: e.target.value })} />
          </div>
          <button className="btn-primary py-3" disabled={isSubmitting} onClick={handleSubmit}>{isSubmitting ? '...' : 'Register Now'}</button>
        </div>
      )}

      {isSuccess && (
        <div className="text-center py-4 animate-in zoom-in">
          <div className="w-12 h-12 bg-green-100 text-[#0F5132] rounded-full flex items-center justify-center mx-auto mb-2"><Icons.CheckCircle className="w-6 h-6" /></div>
          <h2 className="text-lg font-bold text-[#0F5132]">Registered!</h2>
          <p className="text-xs text-slate-500">Check your WhatsApp.</p>
        </div>
      )}
    </div>
  );
};

export const ProgramDetail: React.FC<ProgramDetailProps> = ({ program, onClose }) => {
  // FIX: Added pre-filled message text back
  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum, I want to inquire about the Dora Quran program at ${program.name}.`
  );
  const whatsappLink = `https://wa.me/${program.contact?.replace(/\D/g, "")}?text=${whatsappMessage}`;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  return (
    <div className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center p-4 sm:p-0">

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 max-h-[85vh]">

        <div className="relative shrink-0 h-48 bg-[#022c22] overflow-hidden">
          <img src="https://crm.pcirealestate.site/wp-content/uploads/2026/01/BG-Image-DTQ.png" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-transparent to-[#022c22]/50" />

          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-black/20 text-white rounded-full flex items-center justify-center backdrop-blur z-20 active:scale-95 transition-all hover:bg-white/20">
            <Icons.Close className="w-4 h-4" />
          </button>

          {/* FIX: Expanded Height for Header content and styling updates */}
          <div className="absolute top-0 left-0 right-0 bottom-0 p-6 flex flex-col justify-end text-white z-10">
            <span className="text-[10px] font-bold tracking-[0.2em] opacity-70 uppercase mb-2">Ramadan 2026</span>
            <h1 className="text-xl font-black uppercase leading-tight tracking-wide mb-3 drop-shadow-md text-white/95">{program.name.replace(/dora\s*quran/gi, "").trim()}</h1>

            {/* FIX: Full Location Details with explicit styling */}
            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-1">
                <Icons.MapPin className="w-4 h-4 text-[#2ecc71]" />
                <span className="text-sm font-bold border-b-2 border-[#2ecc71] pb-0.5 leading-none">{program.venue}</span>
              </div>
              <p className="text-xs opacity-90 leading-snug pl-6">{program.address}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white relative w-full px-5 pt-4 pb-2">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f1f5f9] rounded-full">
              <Icons.Clock className="w-3.5 h-3.5 text-[#0F5132]" />
              <span className="text-xs font-bold text-[#334155]">08:00 PM Daily</span>
            </div>
          </div>

          <RegistrationForm program={program} />
        </div>

        <div className="shrink-0 bg-white p-4 pt-2 pb-6 sm:pb-4 z-20">
          <hr className="border-slate-100 mb-4" />
          <div className="grid grid-cols-3 gap-6 px-2">
            <a href={whatsappLink} target="_blank" className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-green-50 text-[#25D366] flex items-center justify-center group-active:scale-90 transition-transform shadow-sm border border-green-100">
                <Icons.Phone className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-green-600 transition-colors">WhatsApp</span>
            </a>

            <button onClick={() => alert("Subscribed!")} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-[#f97316] flex items-center justify-center group-active:scale-90 transition-transform shadow-sm border border-orange-100">
                <Icons.Bell className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-orange-500 transition-colors">Alerts</span>
            </button>

            <a href={program.googleMapsLink} target="_blank" className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-slate-50 text-[#475569] flex items-center justify-center group-active:scale-90 transition-transform shadow-sm border border-slate-100">
                <Icons.Navigation className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 transition-colors">Map</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
