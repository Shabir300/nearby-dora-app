import React, { useState, useEffect } from "react";
import { Program } from "../types";
import { Icons } from "../constants";
import { neon } from "@neondatabase/serverless";

interface ProgramDetailProps {
  program: Program;
  onClose: () => void;
};

  const formatPhone = (raw: string) => {
    let num = raw.replace(/[\s\-\(\)]/g, "");
    if (num.startsWith("+92")) num = num.slice(3);
    else if (num.startsWith("92") && num.length === 12) num = num.slice(2);
    else if (num.startsWith("0")) num = num.slice(1);
    return "92" + num;
  };

const RegistrationForm = ({ program }: { program: Program }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", mobile: "", age: "", profession: "", read: "", want: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Styling
  const styles = `
    .reg-scope { font-family: 'DM Sans', sans-serif; color: #0f172a; }
    .reg-scope .urdu { font-family: 'Gulzar', serif; direction: rtl; line-height: 1.6; }
    .reg-scope .btn-option, .reg-scope .btn-primary { width: 100%; padding: 12px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 0.85rem; text-transform: uppercase; tracking: 0.05em; }
    .reg-scope .btn-option { border: 1px solid #e2e8f0; background: #fff; color: #64748b; }
    .reg-scope .btn-option.selected { border-color: #064e3b; background: #ecfdf5; color: #064e3b; }
    .reg-scope .btn-primary { background: #064e3b; color: white; border: none; margin-top: 8px; box-shadow: 0 4px 12px rgba(6, 78, 59, 0.2); }
    .reg-scope input { width: 100%; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 8px; font-size: 0.95rem; font-weight: 500; transition: all 0.2s; background: white; }
    .reg-scope input:focus { border-color: #064e3b; outline: none; ring: 2px; ring-color: #064e3b/10; }
  `;

  // Handlers
  const handleOptionSelect = (stepNum: number, value: string) => {
    setFormData((prev) => ({ ...prev, [stepNum === 1 ? "read" : "want"]: value }));
    setTimeout(() => setStep(stepNum + 1), 200);
  };

//   const handleSubmit = async () => {
//     if (!formData.name || !formData.mobile) return alert("Name & Mobile required");
//     setIsSubmitting(true);
// // <<<<<<< HEAD
// //     try {
// //       const sql = neon("postgresql://neondb_owner:npg_j7SFZqzR5the@ep-empty-rice-a18ykd4a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
// //       const ts = new Date().toISOString();
// //       const loc = program.venue || "Kashmir Plaza";
// //       const phone = formData.mobile.replace(/\D/g, "").replace(/^0/, "92");

// //       await sql`CREATE TABLE IF NOT EXISTS "registration-kashmir-plaza" (id SERIAL PRIMARY KEY, timestamp TEXT, location TEXT, read TEXT, want TEXT, name TEXT, mobile TEXT, age TEXT, profession TEXT)`;
// //       await sql`INSERT INTO "registration-kashmir-plaza" (timestamp, location, read, want, name, mobile, age, profession) VALUES (${ts}, ${loc}, ${formData.read}, ${formData.want}, ${formData.name}, ${phone}, ${formData.age}, ${formData.profession})`;

// //       fetch("https://n8n.premierchoiceint.online/webhook/registration-trigger", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_name: formData.name, user_phone: phone, venue: loc }) }).catch(() => { });
// // =======
//     const neon_db_url =
//       "postgresql://neondb_owner:npg_j7SFZqzR5the@ep-empty-rice-a18ykd4a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
//     const ADMIN_PHONE = formatPhone(program.contact);
//     const N8N_WEBHOOK_URL =
//       "https://n8n.premierchoiceint.online/webhook/registration-trigger";
//     const GOOGLE_SCRIPT_URL =
//       "https://script.google.com/macros/s/AKfycbzXNQV7EreIbUiIMxuJQrDri_2BTehFLlauhpFGcVefP0I2Vnf8PyJYr5VdsXaztXlx/exec";

//     try {
//       const sql = neon(neon_db_url);
//       const timestamp = new Date().toISOString();
//       const location = program.venue || "";
//       const formattedMobile = formatPhone(formData.mobile);
//       const tableName = `registration-${program.venue.replace(/[^a-z0-9-]/gi, '_')}`;

//       // 1. Create Table ()
//       await sql`CREATE TABLE IF NOT EXISTS ${tableName} (
//         id SERIAL PRIMARY KEY,
//         timestamp TEXT,
//         location TEXT,
//         read TEXT,
//         want TEXT,
//         name TEXT,
//         mobile TEXT,
//         age TEXT,
//         profession TEXT
//       )`;

//       // 2. Insert Data
//       await sql`INSERT INTO ${tableName} (timestamp, location, read, want, name, mobile, age, profession)
//         VALUES (${timestamp}, ${location}, ${formData.read}, ${formData.want}, ${formData.name}, ${formattedMobile}, ${formData.age}, ${formData.profession})`;

//       // 3. Fire n8n webhook
//       await fetch(N8N_WEBHOOK_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_name: formData.name,
//           user_phone: formattedMobile,
//           admin_phone: ADMIN_PHONE,
//           age: formData.age,
//           profession: formData.profession,
//           venue: location,
//           registered_at: timestamp,
//         }),
//       }).catch((err) => console.warn("n8n webhook call failed:", err));

//       // 4. Save to Google Sheet
//       await fetch(GOOGLE_SCRIPT_URL, {
//         method: "POST",
//         headers: { "Content-Type": "text/plain;charset=utf-8" },
//         body: JSON.stringify({
//           timestamp,
//           location,
//           sheetName: location,
//           read: formData.read,
//           want: formData.want,
//           name: formData.name,
//           mobile: formattedMobile,
//           age: formData.age,
//           profession: formData.profession,
//         }),
//       }).catch((err) => console.warn("Google Sheet call failed:", err));

//       setIsSuccess(true);
//       setStep(4);
//     } catch (e) { console.log(e) }
//     finally { setIsSubmitting(false); }
//   };
  

 const handleSubmit = async () => {
    if (!formData.name || !formData.mobile) {
      alert("Please fill in your Name and WhatsApp Number.");
      return;
    }

    setIsSubmitting(true);
    const neon_db_url =
      "postgresql://neondb_owner:npg_j7SFZqzR5the@ep-empty-rice-a18ykd4a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
    const ADMIN_PHONE = formatPhone(program.contact);
    const N8N_WEBHOOK_URL =
      "https://n8n.premierchoiceint.online/webhook/registration-trigger";
    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbzXNQV7EreIbUiIMxuJQrDri_2BTehFLlauhpFGcVefP0I2Vnf8PyJYr5VdsXaztXlx/exec";

    try {
      const sql = neon(neon_db_url);
      const timestamp = new Date().toISOString();
      const location = program.venue || "";
      const formattedMobile = formatPhone(formData.mobile);
      const tableName = `registration-${program.venue.replace(/[^a-z0-9-]/gi, '_')}`;

      // 1. Create Table (Idempotent)
      await sql`CREATE TABLE IF NOT EXISTS registeration (
        id SERIAL PRIMARY KEY,
        timestamp TEXT,
        location TEXT,
        read TEXT,
        want TEXT,
        name TEXT,
        mobile TEXT,
        age TEXT,
        profession TEXT
      )`;

      // 2. Insert Data
      await sql`INSERT INTO registeration (timestamp, location, read, want, name, mobile, age, profession)
        VALUES (${timestamp}, ${location}, ${formData.read}, ${formData.want}, ${formData.name}, ${formattedMobile}, ${formData.age}, ${formData.profession})`;

      // 3. Fire n8n webhook
      await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: formData.name,
          user_phone: formattedMobile,
          admin_phone: ADMIN_PHONE,
          age: formData.age,
          profession: formData.profession,
          venue: location,
          registered_at: timestamp,
        }),
      }).catch((err) => console.warn("n8n webhook call failed:", err));

      // 4. Save to Google Sheet
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          timestamp,
          location,
          sheetName: location,
          read: formData.read,
          want: formData.want,
          name: formData.name,
          mobile: formattedMobile,
          age: formData.age,
          profession: formData.profession,
        }),
      }).catch((err) => console.warn("Google Sheet call failed:", err));

      setIsSuccess(true);
      setStep(4);
    } catch (e) {
      console.error("Submission error:", e);
      alert(
        "Submission failed. Please check your internet connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reg-scope w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
      <style>{styles}</style>

      {!isSuccess && <div className="flex justify-center gap-1.5 mb-4">{[1, 2, 3].map(s => <div key={s} className={`h-1.5 duration-300 rounded-full transition-all ${step === s ? 'w-6 bg-[#064e3b]' : 'w-1.5 bg-slate-200'}`} />)}</div>}

      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-right-4 text-center">
          <h3 className="font-bold text-[#064e3b] mb-1 text-sm">Have you read Quran w/ Translation?</h3>
          <p className="text-xs text-slate-500 mb-4 urdu">کیا آپ نے قرآن ترجمہ سے پڑھا ہے؟</p>
          <div className="flex gap-3">
            <button className={`btn-option flex-1 ${formData.read === 'Yes' ? 'selected' : ''}`} onClick={() => handleOptionSelect(1, 'Yes')}>Yes</button>
            <button className={`btn-option flex-1 ${formData.read === 'No' ? 'selected' : ''}`} onClick={() => handleOptionSelect(1, 'No')}>No</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-4 text-center">
          <h3 className="font-bold text-[#064e3b] mb-1 text-sm">Join for Translation?</h3>
          <p className="text-xs text-slate-500 mb-4 urdu">کیا آپ اس میں شامل ہونا چاہتے ہیں؟</p>
          <div className="flex gap-3 mb-3">
            <button className={`btn-option flex-1 ${formData.want === 'Yes' ? 'selected' : ''}`} onClick={() => handleOptionSelect(2, 'Yes')}>Yes</button>
            <button className={`btn-option flex-1 ${formData.want === 'Maybe' ? 'selected' : ''}`} onClick={() => handleOptionSelect(2, 'Maybe')}>Maybe Later</button>
          </div>
          <button className="text-[10px] w-full text-slate-400 font-bold uppercase tracking-widest" onClick={() => setStep(1)}>Go Back</button>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-right-4 space-y-1">
          <h3 className="text-center font-bold text-[#064e3b] mb-3 text-sm">Finish Sign Up</h3>
          <input placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <input type="tel" placeholder="WhatsApp (e.g. 0300...)" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} />
          <div className="flex gap-3">
            <input type="number" placeholder="Age" className="flex-[0.4]" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
            <input placeholder="Profession" className="flex-1" value={formData.profession} onChange={e => setFormData({ ...formData, profession: e.target.value })} />
          </div>
          <button className="btn-primary py-3.5 mt-2" disabled={isSubmitting} onClick={handleSubmit}>{isSubmitting ? '...' : 'Register Now'}</button>
        </div>
      )}

      {isSuccess && (
        <div className="text-center py-6 animate-in zoom-in">
          <div className="w-14 h-14 bg-emerald-50 text-[#064e3b] rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner"><Icons.CheckCircle className="w-8 h-8" /></div>
          <h2 className="text-xl font-bold text-[#064e3b]">Success!</h2>
          <p className="text-xs text-slate-500 mt-1">Registration complete.</p>
        </div>
      )}
    </div>
  );
};


export const ProgramDetail: React.FC<ProgramDetailProps> = ({
  program,
  onClose,
}) => {
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isSubmittingWhatsApp, setIsSubmittingWhatsApp] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const displayName =
    program.name
      .replace(/dora\s*quran/gi, "")
      .replace(/^[-\s]+/, "")
      .trim() || program.name;

  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum, I want to inquire about the Dora Quran program at ${program.name}.`
  );
  const whatsappLink = `https://wa.me/${program.contact?.replace(/\D/g, "")}?text=${whatsappMessage}`;
  
    useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = "unset"; };
    }, []);

// <<<<<<< HEAD

//   return (
//     <div className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center p-4 sm:p-0">
// =======

  async function handleNotifications() {
    setIsWhatsAppModalOpen(true);
  }

  async function submitWhatsApp() {
    if (!whatsappNumber) return;
    setIsSubmittingWhatsApp(true);
    try {
      const formattedMobile = whatsappNumber.replace(/\D/g, "");
      const finalMobile = formattedMobile.startsWith("92")
        ? formattedMobile
        : "92" + formattedMobile.replace(/^0/, "");

      await fetch(
        "https://n8n.premierchoiceint.online/webhook/daily-reminders-v1",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: finalMobile,
            venue: program.venue,
            name: program.name,
          }),
        },
      );
      setIsWhatsAppModalOpen(false);
      setWhatsappNumber("");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("WhatsApp sub failed", err);
      alert("Failed to enable WhatsApp reminders. Please try again.");
    } finally {
      setIsSubmittingWhatsApp(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-500 ease-out">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[4000] w-[90%] max-w-sm animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#004d33] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20">
            <div className="bg-white/20 p-1 rounded-full">
              <Icons.CheckCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-bold">WhatsApp reminders enabled!</p>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="absolute inset-0 animate-in fade-in duration-300" onClick={onClose} />

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
              <div className="w-12 h-12 rounded-full bg-green-50 text-[#25D366] flex items-center justify-center group-active:scale-90 transition-transform shadow-sm border border-green-200">
                <Icons.Phone className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-green-600 transition-colors">Contact</span>
            </a>

            <button onClick={handleNotifications} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-[#f97316] flex items-center justify-center group-active:scale-90 transition-transform shadow-sm border border-orange-200">
                <Icons.Bell className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-orange-500 transition-colors">Get Alerts</span>
            </button>

            <a href={program.googleMapsLink} target="_blank" className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-slate-50 text-[#475569] flex items-center justify-center group-active:scale-90 transition-transform shadow-sm border border-slate-200">
                <Icons.MapPin className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 group-hover:text-slate-600 transition-colors">Location</span>
            </a>


          </div>
        </div>

      </div>

      {/* WhatsApp Reminder Modal */}
      {isWhatsAppModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsWhatsAppModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Icons.Close />
            </button>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto">
                <Icons.Phone className="w-8 h-8 text-[#25D366]" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800">WhatsApp Reminders</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Enter your whatsapp number to recieve daily reminders for Dora Tarjuma-e-Quran (03XXXXXXXXX)
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="tel"
                  autoFocus
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="03XXXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-[#25D366] focus:outline-none text-center text-lg font-semibold transition-all"
                  onKeyDown={(e) => e.key === "Enter" && submitWhatsApp()}
                />
                
                <button
                  onClick={submitWhatsApp}
                  disabled={isSubmittingWhatsApp || !whatsappNumber}
                  className="w-full bg-[#25D366] hover:bg-[#1ebc57] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isSubmittingWhatsApp ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Enable Reminders"
                  )}
                </button>
                
                <button
                  onClick={() => setIsWhatsAppModalOpen(false)}
                  className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
