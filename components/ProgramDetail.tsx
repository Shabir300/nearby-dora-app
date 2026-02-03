import React, { useState } from "react";
import { Program } from "../types";
import { Icons } from "../constants";
import { neon } from "@neondatabase/serverless";

interface ProgramDetailProps {
  program: Program;
  onClose: () => void;
}

const RegistrationForm = ({ program }: { program: Program }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    read: "",
    want: "",
    name: "",
    mobile: "",
    age: "",
    profession: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Gulzar:wght@400;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    
    .reg-scope {
      --primary: #0F5132;
      --primary-dark: #072e1d;
      --accent: #108c00;
      --bg-light: #F3F4F6;
      --white: #ffffff;
      --text-dark: #1F2937;
      --text-gray: #6B7280;
      --whatsapp: #25D366;
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: var(--text-dark);
      line-height: 1.6;
    }
    
    .reg-scope .urdu { font-family: 'Gulzar', serif; direction: rtl; line-height: 2.2; }
    
    .reg-scope .form-wrapper { padding: 0 1rem; position: relative; z-index: 10; width: 100%; }
    .reg-scope .form-card { background: var(--white); border-radius: 24px; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.1); padding: 2rem; max-width: 500px; margin: 0 auto; border-top: 6px solid var(--accent); }
    
    .reg-scope .progress-indicator { display: flex; justify-content: center; margin-bottom: 1.5rem; gap: 6px; }
    .reg-scope .dot { height: 6px; width: 6px; background: #e5e7eb; border-radius: 50%; transition: all 0.3s ease; }
    .reg-scope .dot.active { background: var(--primary); width: 24px; border-radius: 10px; }
    
    .reg-scope .step-content { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    .reg-scope .question { font-size: 1.2rem; font-weight: 800; color: var(--primary); margin-bottom: 0.5rem; text-align: center; line-height: 1.3; }
    .reg-scope .question-sub { color: var(--text-gray); font-size: 1rem; margin-bottom: 1.5rem; text-align: center; }
    
    .reg-scope .btn-option { width: 100%; padding: 1rem; margin-bottom: 0.8rem; border: 2px solid #e5e7eb; background: var(--white); border-radius: 14px; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s; color: var(--text-dark); }
    .reg-scope .btn-option:hover, .reg-scope .btn-option.selected { border-color: var(--primary); background: #ecfdf5; color: var(--primary-dark); transform: translateY(-2px); }
    
    .reg-scope .btn-primary { width: 100%; padding: 1.2rem; background: var(--primary); color: white; border: none; border-radius: 14px; font-size: 1.1rem; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(6, 78, 59, 0.3); margin-top: 1rem; transition: transform 0.1s; }
    .reg-scope .btn-primary:active { transform: scale(0.98); }
    .reg-scope .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
    
    .reg-scope .btn-back { background: transparent; color: var(--text-gray); border: none; font-weight: 600; margin-top: 12px; cursor: pointer; width: 100%; font-size: 0.9rem; }
    
    .reg-scope .input-group { margin-bottom: 1rem; text-align: left; }
    .reg-scope .input-group label { display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px; color: var(--text-dark); text-transform: uppercase; letter-spacing: 0.5px; }
    .reg-scope .input-group input { width: 100%; padding: 14px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 1rem; transition: 0.2s; color: var(--text-dark); background: white; }
    .reg-scope .input-group input:focus { outline: none; border-color: var(--primary); background: #fff; }
    
    .reg-scope .success-box { text-align: center; padding: 2rem 0; }
    .reg-scope .success-icon { font-size: 3.5rem; color: var(--primary); margin-bottom: 1rem; }
  `;

  const formatPhone = (raw: string) => {
    let num = raw.replace(/[\s\-\(\)]/g, "");
    if (num.startsWith("+92")) num = num.slice(3);
    else if (num.startsWith("92") && num.length === 12) num = num.slice(2);
    else if (num.startsWith("0")) num = num.slice(1);
    return "92" + num;
  };

  const handleOptionSelect = (stepNum: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [stepNum === 1 ? "read" : "want"]: value,
    }));
    setTimeout(() => setStep(stepNum + 1), 250);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.mobile) {
      alert("Please fill in your Name and WhatsApp Number.");
      return;
    }

    setIsSubmitting(true);
    const neon_db_url =
      "postgresql://neondb_owner:npg_j7SFZqzR5the@ep-empty-rice-a18ykd4a-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
    const ADMIN_PHONE = "923005585435";
    const N8N_WEBHOOK_URL =
      "https://n8n.premierchoiceint.online/webhook/registration-trigger";
    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbzXNQV7EreIbUiIMxuJQrDri_2BTehFLlauhpFGcVefP0I2Vnf8PyJYr5VdsXaztXlx/exec";

    try {
      const sql = neon(neon_db_url);
      const timestamp = new Date().toISOString();
      const location = program.venue || "Kashmir Plaza";
      const formattedMobile = formatPhone(formData.mobile);

      // 1. Create Table (Idempotent)
      await sql`CREATE TABLE IF NOT EXISTS "registration-kashmir-plaza" (
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
      await sql`INSERT INTO "registration-kashmir-plaza" (timestamp, location, read, want, name, mobile, age, profession)
        VALUES (${timestamp}, ${location}, ${formData.read}, ${formData.want}, ${formData.name}, ${formattedMobile}, ${formData.age}, ${formData.profession})`;

      // 3. Fire n8n webhook
      fetch(N8N_WEBHOOK_URL, {
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
      fetch(GOOGLE_SCRIPT_URL, {
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
    <div className="reg-scope my-6">
      <style>{styles}</style>
      <div className="form-wrapper" id="registration-form">
        <div className="form-card">
          {!isSuccess && (
            <div className="progress-indicator">
              <div className={`dot ${step === 1 ? "active" : ""}`}></div>
              <div className={`dot ${step === 2 ? "active" : ""}`}></div>
              <div className={`dot ${step === 3 ? "active" : ""}`}></div>
            </div>
          )}

          {step === 1 && (
            <div className="step-content active">
              <div className="question">
                Have you read the entire Quran with translation?
              </div>
              <p className="question-sub urdu">
                کیا آپ نے کبھی پورا قرآن ترجمہ کے ساتھ پڑھا ہے؟
              </p>
              <button
                type="button"
                className={`btn-option ${formData.read === "Yes" ? "selected" : ""}`}
                onClick={() => handleOptionSelect(1, "Yes")}
              >
                <i
                  className="fas fa-check-circle"
                  style={{ color: "var(--primary)" }}
                ></i>{" "}
                Yes (جی ہاں)
              </button>
              <button
                type="button"
                className={`btn-option ${formData.read === "No" ? "selected" : ""}`}
                onClick={() => handleOptionSelect(1, "No")}
              >
                <i
                  className="fas fa-times-circle"
                  style={{ color: "var(--text-gray)" }}
                ></i>{" "}
                No (نہیں)
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="step-content active">
              <div className="question">
                Do you want to understand the Quran this Ramadan?
              </div>
              <p className="question-sub urdu">
                کیا آپ اس رمضان قرآن کو سمجھنا چاہتے ہیں؟
              </p>
              <button
                type="button"
                className={`btn-option ${formData.want === "Yes" ? "selected" : ""}`}
                onClick={() => handleOptionSelect(2, "Yes")}
              >
                Yes, I want to Join
              </button>
              <button
                type="button"
                className={`btn-option ${formData.want === "Maybe" ? "selected" : ""}`}
                onClick={() => handleOptionSelect(2, "Maybe")}
              >
                Maybe later
              </button>
              <button
                type="button"
                className="btn-back"
                onClick={() => setStep(1)}
              >
                Go Back
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="step-content active">
              <div className="question">Final Step</div>
              <p className="question-sub">Registration is Free</p>
              <div className="input-group">
                <label>Full Name (نام)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="input-group">
                <label>WhatsApp Number (موبائل)</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  placeholder="0300-XXXXXXX"
                  required
                />
              </div>
              <div
                className="input-group"
                style={{ display: "flex", gap: "10px" }}
              >
                <div style={{ flex: 1 }}>
                  <label>Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    placeholder="25"
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <label>Profession</label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) =>
                      setFormData({ ...formData, profession: e.target.value })
                    }
                    placeholder="Student, Job..."
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "COMPLETE REGISTRATION"}
              </button>
              <button
                type="button"
                className="btn-back"
                onClick={() => setStep(2)}
              >
                Go Back
              </button>
            </div>
          )}

          {isSuccess && (
            <div className="step-content active">
              <div className="success-box">
                <div className="success-icon">
                  <Icons.CheckCircle className="inline-block w-16 h-16" />
                </div>
                <h2
                  style={{
                    color: "var(--primary)",
                    marginBottom: "10px",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                  }}
                >
                  JazakAllah Khair!
                </h2>
                <p style={{ color: "var(--text-gray)", marginBottom: "20px" }}>
                  Your registration is confirmed.
                </p>
                <div
                  style={{
                    background: "#f0fdf4",
                    padding: "15px",
                    borderRadius: "12px",
                    fontSize: "0.9rem",
                    color: "var(--primary-dark)",
                  }}
                >
                  For updates, save our number: <br />
                  <strong>3005585435</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProgramDetail: React.FC<ProgramDetailProps> = ({
  program,
  onClose,
}) => {
  const displayName =
    program.name
      .replace(/dora\s*quran/gi, "")
      .replace(/^[-\s]+/, "")
      .trim() || program.name;

  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum, I want to inquire about the Dora Quran program at ${displayName}.`,
  );
  const whatsappLink = `https://wa.me/${program.contact?.replace(/\D/g, "")}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in duration-500 ease-out">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-2xl overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:zoom-in-95 z-10">
        {/* Close Button */}
        <div className="absolute top-3 right-3 z-30">
          <button
            onClick={onClose}
            className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all backdrop-blur-md active:scale-90"
          >
            <Icons.Close />
          </button>
        </div>

        {/* Hero / Header Section - Themed Green with Image */}
        <div className="relative h-40 md:h-48 bg-[#004d33] flex-shrink-0">
          <img
            src="https://crm.pcirealestate.site/wp-content/uploads/2026/01/BG-Image-DTQ.png"
            alt="Dora Quran Program"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#004d33] via-transparent to-transparent"></div>

          <div className="absolute bottom-4 left-0 right-0 text-center px-4">
            <h2 className="text-white/80 font-bold tracking-widest text-[10px] md:text-xs uppercase mb-1">
              Ramadan 2026
            </h2>
            <h1 className="text-xl md:text-2xl font-black text-white leading-tight drop-shadow-md uppercase">
              {displayName}
            </h1>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 md:space-y-5 bg-[#fdfcf6]">
          {/* Time & Date Block */}
          <div className="text-center space-y-1">
            <div className="inline-block bg-[#004d33]/10 px-3 py-1 rounded-full mb-1">
              <h3 className="text-[10px] md:text-xs font-bold text-[#004d33] uppercase tracking-wider">
                From 1st Ramadan
              </h3>
            </div>
            <div className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-black text-[#004d33]">
              <Icons.Clock /> 08:00 PM
            </div>
            <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">
              Every Night
            </p>
          </div>

          {/* Facilities Strip */}
          <div className="bg-[#004d33] text-white rounded-xl p-3 md:p-4 text-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="font-bold uppercase tracking-wide text-xs md:text-sm border-b border-white/20 pb-2 w-full">
                Separate Arrangement for Ladies
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-[10px] md:text-xs font-medium text-white/90">
                <span className="flex items-center gap-1">
                  <Icons.Child /> Kids Activities
                </span>
                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                <span className="flex items-center gap-1">
                  <Icons.Coffee /> Refreshments
                </span>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="flex items-start gap-3 md:gap-4 text-left bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100">
            <div className="mt-1 text-[#004d33] min-w-[20px] md:min-w-[24px]">
              <Icons.MapPin />
            </div>
            <div>
              <h4 className="font-bold text-[#004d33] text-base md:text-lg leading-tight mb-1">
                {program.venue}
              </h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                {program.address}
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <RegistrationForm program={program} />

          {/* Action Buttons - Stack on mobile */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 pt-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:flex-1 bg-[#25D366] hover:bg-[#1ebc57] text-white font-bold py-3 md:py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm md:text-base transition-transform active:scale-95"
            >
              <Icons.Phone /> WhatsApp
            </a>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  import("../services/push-service").then(
                    async ({ subscribeToPush }) => {
                      const success = await subscribeToPush();
                      if (success) {
                        alert(
                          `✅ Notifications enabled! You will receive updates.`,
                        );
                      } else {
                        alert(
                          "⚠️ Could not enable notifications. Please check site permissions.",
                        );
                      }
                    },
                  );
                }}
                className="flex-1 bg-[#eab308] hover:bg-[#ca9a04] text-white font-bold py-3 md:py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm md:text-base transition-transform active:scale-95"
              >
                <Icons.Bell /> Alert Me
              </button>
              <a
                href={program.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#004d33] hover:bg-[#003824] text-white font-bold py-3 md:py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm md:text-base transition-transform active:scale-95"
              >
                <Icons.Navigation /> Map
              </a>
            </div>
          </div>

          {/* Spacer for bottom safe area on mobile */}
          <div className="h-6 md:h-0"></div>
        </div>

        {/* Footer Branding */}
        <div className="bg-[#0f172a] p-2 md:p-3 text-center">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
            Organized by Tanzeem-e-Islami
          </p>
        </div>
      </div>
    </div>
  );
};
