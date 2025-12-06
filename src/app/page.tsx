"use client";
import { useState } from "react";

// --- CONFIG ---
// Gunakan URL Hugging Face direct endpoint, bukan URL browser
const API_URL = "https://hanrsyidin-churn-api-farhan.hf.space/predict";

type HistoryItem = {
  id: number;
  time: string;
  result: string;
  prob: number;
  tenure: number;
  charges: number;
  contract: string;
};

export default function Home() {
  // --- STATE ---
  const [formData, setFormData] = useState({
    tenure: 1,
    MonthlyCharges: 50.0,
    gender: "Male",
    SeniorCitizen: "No",
    Partner: "No",
    Dependents: "No",
    PhoneService: "Yes",
    MultipleLines: "No",
    InternetService: "Fiber optic",
    OnlineSecurity: "No",
    OnlineBackup: "No",
    DeviceProtection: "No",
    TechSupport: "No",
    StreamingTV: "No",
    StreamingMovies: "No",
    Contract: "Month-to-month",
    PaperlessBilling: "Yes",
    PaymentMethod: "Electronic check",
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // --- HANDLERS ---
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Mapping Logic (Sesuai Backend)
    const features: any = {
      tenure: Number(formData.tenure),
      MonthlyCharges: Number(formData.MonthlyCharges),
      gender: formData.gender === "Male" ? 1 : 0,
      SeniorCitizen: formData.SeniorCitizen === "Yes" ? 1 : 0,
      Partner: formData.Partner === "Yes" ? 1 : 0,
      Dependents: formData.Dependents === "Yes" ? 1 : 0,
      PhoneService: formData.PhoneService === "Yes" ? 1 : 0,
      PaperlessBilling: formData.PaperlessBilling === "Yes" ? 1 : 0,
      "MultipleLines_No phone service": formData.MultipleLines === "No phone service" ? 1 : 0,
      "MultipleLines_Yes": formData.MultipleLines === "Yes" ? 1 : 0,
      "InternetService_Fiber optic": formData.InternetService === "Fiber optic" ? 1 : 0,
      "InternetService_No": formData.InternetService === "No" ? 1 : 0,
      "OnlineSecurity_No internet service": formData.OnlineSecurity === "No internet service" ? 1 : 0,
      "OnlineSecurity_Yes": formData.OnlineSecurity === "Yes" ? 1 : 0,
      "OnlineBackup_No internet service": formData.OnlineBackup === "No internet service" ? 1 : 0,
      "OnlineBackup_Yes": formData.OnlineBackup === "Yes" ? 1 : 0,
      "DeviceProtection_No internet service": formData.DeviceProtection === "No internet service" ? 1 : 0,
      "DeviceProtection_Yes": formData.DeviceProtection === "Yes" ? 1 : 0,
      "TechSupport_No internet service": formData.TechSupport === "No internet service" ? 1 : 0,
      "TechSupport_Yes": formData.TechSupport === "Yes" ? 1 : 0,
      "StreamingTV_No internet service": formData.StreamingTV === "No internet service" ? 1 : 0,
      "StreamingTV_Yes": formData.StreamingTV === "Yes" ? 1 : 0,
      "StreamingMovies_No internet service": formData.StreamingMovies === "No internet service" ? 1 : 0,
      "StreamingMovies_Yes": formData.StreamingMovies === "Yes" ? 1 : 0,
      "Contract_One year": formData.Contract === "One year" ? 1 : 0,
      "Contract_Two year": formData.Contract === "Two year" ? 1 : 0,
      "PaymentMethod_Credit card (automatic)": formData.PaymentMethod === "Credit card (automatic)" ? 1 : 0,
      "PaymentMethod_Electronic check": formData.PaymentMethod === "Electronic check" ? 1 : 0,
      "PaymentMethod_Mailed check": formData.PaymentMethod === "Mailed check" ? 1 : 0,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      });

      if (!res.ok) throw new Error(`Backend Error: ${res.statusText}`);
      const data = await res.json();
      setResult(data);

      const newHistoryItem: HistoryItem = {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        result: data.prediction_label,
        prob: data.churn_probability,
        tenure: Number(formData.tenure),
        charges: Number(formData.MonthlyCharges),
        contract: formData.Contract,
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  const SelectField = ({ label, name, options, value }: any) => (
    <div className="group">
      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider group-hover:text-cyan-400 transition-colors">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={handleChange}
          className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-sm text-slate-200 appearance-none transition-all hover:bg-slate-800"
        >
          {options.map((opt: string) => (
            <option key={opt} value={opt} className="bg-slate-900 text-slate-300">
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-3 pointer-events-none text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B1121] font-sans text-slate-300 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-900/10 blur-[100px]" />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-50 border-b border-white/5 bg-[#0B1121]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="text-xl font-bold tracking-tight text-white">
              CHURN<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">VISION</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <span className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-900/50 px-3 py-1.5 rounded-full border border-white/5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Model v1.0 Active
             </span>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        
        {/* HEADER SECTION */}
        <header className="mb-10 text-center md:text-left max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Prediksi Retensi <br className="md:hidden"/> Pelanggan dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">AI Presisi</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Analisis pola perilaku pelanggan secara real-time untuk mencegah churn sebelum terjadi. Masukkan parameter di bawah ini.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* KOLOM KIRI: FORM (Card Glass) */}
          <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                
                {/* SECTION 1 */}
                <div className="bg-slate-800/20 p-6 rounded-xl border border-white/5">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-bold ring-1 ring-cyan-500/30">1</span> 
                    Profil & Keuangan
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Tenure (Bulan)</label>
                        <input type="number" name="tenure" value={formData.tenure} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white placeholder-slate-500 transition-all hover:bg-slate-800" min="0"/>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Monthly Charges ($)</label>
                        <input type="number" name="MonthlyCharges" value={formData.MonthlyCharges} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-white placeholder-slate-500 transition-all hover:bg-slate-800" />
                    </div>
                    <SelectField label="Contract Type" name="Contract" value={formData.Contract} options={["Month-to-month", "One year", "Two year"]} />
                    <SelectField label="Payment Method" name="PaymentMethod" value={formData.PaymentMethod} options={["Electronic check", "Mailed check", "Bank transfer (automatic)", "Credit card (automatic)"]} />
                  </div>
                </div>

                {/* SECTION 2 */}
                <div className="bg-slate-800/20 p-6 rounded-xl border border-white/5">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs font-bold ring-1 ring-purple-500/30">2</span> 
                    Layanan Digital
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <SelectField label="Internet" name="InternetService" value={formData.InternetService} options={["DSL", "Fiber optic", "No"]} />
                    <SelectField label="Online Security" name="OnlineSecurity" value={formData.OnlineSecurity} options={["No", "Yes", "No internet service"]} />
                    <SelectField label="Tech Support" name="TechSupport" value={formData.TechSupport} options={["No", "Yes", "No internet service"]} />
                    <SelectField label="Streaming TV" name="StreamingTV" value={formData.StreamingTV} options={["No", "Yes", "No internet service"]} />
                    <SelectField label="Streaming Movies" name="StreamingMovies" value={formData.StreamingMovies} options={["No", "Yes", "No internet service"]} />
                    <SelectField label="Device Prot." name="DeviceProtection" value={formData.DeviceProtection} options={["No", "Yes", "No internet service"]} />
                  </div>
                </div>

                {/* SECTION 3 */}
                 <div className="bg-slate-800/20 p-6 rounded-xl border border-white/5">
                  <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-pink-500/10 text-pink-400 flex items-center justify-center text-xs font-bold ring-1 ring-pink-500/30">3</span> 
                    Data Demografi
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <SelectField label="Gender" name="gender" value={formData.gender} options={["Male", "Female"]} />
                    <SelectField label="Senior Citizen" name="SeniorCitizen" value={formData.SeniorCitizen} options={["No", "Yes"]} />
                    <SelectField label="Partner" name="Partner" value={formData.Partner} options={["No", "Yes"]} />
                    <SelectField label="Dependents" name="Dependents" value={formData.Dependents} options={["No", "Yes"]} />
                  </div>
                </div>

              </div>

              {/* ACTION BUTTON */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 disabled:opacity-50"
                >
                    <div className="relative bg-slate-900/50 group-hover:bg-transparent transition-colors rounded-xl px-6 py-4 flex items-center justify-center gap-3 backdrop-blur-sm">
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span className="font-bold text-white tracking-wide">PROCESSING...</span>
                            </>
                        ) : (
                            <>
                                <span className="font-bold text-white tracking-wide text-lg">ANALISA PREDIKSI</span>
                                <svg className="w-5 h-5 text-cyan-200 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </>
                        )}
                    </div>
                </button>
              </div>
            </form>
          </div>

          {/* KOLOM KANAN: RESULT & HISTORY */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm flex items-start gap-3 backdrop-blur-sm">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                    <strong className="block font-bold mb-1">Error Occurred</strong>
                    {error}
                </div>
              </div>
            )}

            {/* HASIL PREDIKSI */}
            <div className={`relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 border ${result ? 'border-white/20' : 'border-dashed border-slate-700 bg-slate-900/30'}`}>
                {result ? (
                    <>
                        <div className={`absolute inset-0 opacity-20 ${result.prediction_label === "CHURN" ? "bg-red-600" : "bg-emerald-600"}`}></div>
                        <div className={`relative p-8 text-center bg-gradient-to-br ${result.prediction_label === "CHURN" ? "from-red-900/90 to-slate-900" : "from-emerald-900/90 to-slate-900"} backdrop-blur-md`}>
                            <div className="text-xs uppercase tracking-[0.2em] text-white/60 mb-3 font-semibold">Risk Analysis Result</div>
                            <div className={`text-6xl font-black mb-2 tracking-tighter ${result.prediction_label === "CHURN" ? "text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" : "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]"}`}>
                                {result.prediction_label}
                            </div>
                            
                            <div className="mt-6 flex justify-center">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10 text-sm font-medium text-white backdrop-blur-xl">
                                    <span>Probabilitas:</span>
                                    <span className={result.prediction_label === "CHURN" ? "text-red-400" : "text-emerald-400"}>
                                        {(result.churn_probability * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900/90 p-6 border-t border-white/10 backdrop-blur-xl">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">AI Recommendation</h4>
                            <p className="text-slate-300 leading-relaxed text-sm">
                                "{result.business_recommendation}"
                            </p>
                        </div>
                    </>
                ) : (
                     <div className="p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 ring-1 ring-white/10">
                            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">Menunggu Input</h3>
                        <p className="text-slate-500 text-sm max-w-[200px]">Silakan lengkapi formulir di samping untuk memulai analisis.</p>
                     </div>
                )}
            </div>

            {/* HISTORY LOG */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col max-h-[400px]">
              <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Recent Sessions
                </h3>
                <span className="text-[10px] text-cyan-400 bg-cyan-950/50 border border-cyan-900 px-2 py-0.5 rounded-full">{history.length}</span>
              </div>
              
              <div className="overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {history.length === 0 && (
                  <div className="text-center py-8 text-slate-600 text-xs italic">
                    Belum ada riwayat prediksi.
                  </div>
                )}

                {history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${item.result === "CHURN" ? "bg-red-500 text-red-500" : "bg-emerald-500 text-emerald-500"}`}></div>
                      <div>
                        <div className={`text-sm font-bold ${item.result === "CHURN" ? "text-red-400" : "text-emerald-400"}`}>
                          {item.result} <span className="text-slate-500 font-normal ml-1 text-xs">{(item.prob * 100).toFixed(0)}%</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {item.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-slate-500">
                      <div className="font-medium text-slate-400">${item.charges}</div>
                      <div>{item.tenure} mo • {item.contract.replace("Month-to-month", "MtM").replace("One year", "1Y").replace("Two year", "2Y")}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
      
      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 bg-[#0B1121] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-sm">
            © 2025 ChurnVision AI. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://hanrsyidin.info" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
            >
              <span>Designed by</span>
              <span className="text-slate-200 group-hover:text-cyan-300 font-semibold tracking-wide">@hanrsyidin</span>
              <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-0.5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}