"use client";
import { useState } from "react";

// Tipe data untuk History agar TypeScript tidak marah
type HistoryItem = {
  id: number;
  time: string;
  result: string; // "CHURN" | "STAY"
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
    PaymentMethod: "Electronic check"
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // STATE BARU: HISTORY (Array kosong, hilang saat refresh)
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // --- HANDLERS ---
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Jangan reset result dulu biar transisi lebih enak
    
    // Mapping Logic (Sama seperti sebelumnya)
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
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      });

      if (!res.ok) throw new Error("Gagal koneksi ke Backend.");
      const data = await res.json();
      setResult(data);

      // --- UPDATE HISTORY ---
      // Kita buat item baru
      const newHistoryItem: HistoryItem = {
        id: Date.now(), // Unique ID pakai timestamp
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second:'2-digit' }),
        result: data.prediction_label,
        prob: data.churn_probability,
        tenure: Number(formData.tenure),
        charges: Number(formData.MonthlyCharges),
        contract: formData.Contract
      };

      // Tambahkan ke paling atas array (Spread Operator)
      setHistory((prev) => [newHistoryItem, ...prev]);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const SelectField = ({ label, name, options, value }: any) => (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-colors hover:bg-white"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* NAVBAR SEDERHANA */}
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter text-blue-400">
            CHURN<span className="text-white">GUARD</span>
          </div>
          <div className="text-xs text-slate-400 font-mono hidden md:block">
            System Ready • Threshold: 0.37
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-800">Analisa Risiko Pelanggan</h1>
          <p className="text-slate-500">Gunakan form di bawah untuk memprediksi potensi Churn secara Real-time.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* KOLOM KIRI: FORM (Lebar 8 kolom) */}
          <div className="lg:col-span-8 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <form onSubmit={handleSubmit}>
              
              {/* GRID FORM */}
              <div className="space-y-8">
                
                {/* 1. DATA KEUANGAN */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm mr-3">1</span> 
                    Keuangan & Kontrak
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tenure (Bulan)</label>
                      <input type="number" name="tenure" value={formData.tenure} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" min="0"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monthly Charges ($)</label>
                      <input type="number" name="MonthlyCharges" value={formData.MonthlyCharges} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <SelectField label="Contract Type" name="Contract" value={formData.Contract} options={["Month-to-month", "One year", "Two year"]} />
                    <SelectField label="Payment Method" name="PaymentMethod" value={formData.PaymentMethod} options={["Electronic check", "Mailed check", "Bank transfer (automatic)", "Credit card (automatic)"]} />
                  </div>
                </div>

                {/* 2. LAYANAN INTERNET */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm mr-3">2</span> 
                    Layanan Internet
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <SelectField label="Internet Service" name="InternetService" value={formData.InternetService} options={["DSL", "Fiber optic", "No"]} />
                    <SelectField label="Online Security" name="OnlineSecurity" value={formData.OnlineSecurity} options={["No", "Yes", "No internet service"]} />
                    <SelectField label="Tech Support" name="TechSupport" value={formData.TechSupport} options={["No", "Yes", "No internet service"]} />
                    <SelectField label="Streaming TV" name="StreamingTV" value={formData.StreamingTV} options={["No", "Yes", "No internet service"]} />
                    <SelectField label="Streaming Movies" name="StreamingMovies" value={formData.StreamingMovies} options={["No", "Yes", "No internet service"]} />
                    <SelectField label="Device Protection" name="DeviceProtection" value={formData.DeviceProtection} options={["No", "Yes", "No internet service"]} />
                  </div>
                </div>

                {/* 3. DEMOGRAFI */}
                 <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm mr-3">3</span> 
                    Demografi & Lainnya
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <SelectField label="Gender" name="gender" value={formData.gender} options={["Male", "Female"]} />
                    <SelectField label="Senior Citizen" name="SeniorCitizen" value={formData.SeniorCitizen} options={["No", "Yes"]} />
                    <SelectField label="Partner" name="Partner" value={formData.Partner} options={["No", "Yes"]} />
                    <SelectField label="Dependents" name="Dependents" value={formData.Dependents} options={["No", "Yes"]} />
                  </div>
                </div>

              </div>

              {/* ACTION BUTTON */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-70 flex justify-center items-center gap-2">
                   {loading ? (
                     <>Memproses Data...</>
                   ) : (
                     <>🚀 JALANKAN PREDIKSI AI</>
                   )}
                </button>
              </div>
            </form>
          </div>

          {/* KOLOM KANAN: HASIL & HISTORY (Lebar 4 kolom) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. ALERT ERROR */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-sm animate-pulse">
                ⚠️ Error: {error}
              </div>
            )}

            {/* 2. CARD HASIL UTAMA */}
            {result ? (
              <div className={`rounded-xl shadow-xl overflow-hidden text-white transition-all duration-500 animate-fade-in-up transform ${result.prediction_label === "CHURN" ? "bg-gradient-to-br from-red-600 to-red-700" : "bg-gradient-to-br from-emerald-600 to-emerald-700"}`}>
                <div className="p-8 text-center">
                  <div className="text-xs uppercase tracking-widest opacity-80 mb-2 font-semibold">Hasil Analisa</div>
                  <div className="text-6xl font-black mb-2 tracking-tight">{result.prediction_label}</div>
                  <div className="inline-block px-4 py-1 rounded-full bg-black/20 text-sm font-medium backdrop-blur-sm">
                    Probabilitas: {(result.churn_probability * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-6 border-t border-white/10">
                   <p className="text-white font-medium leading-snug text-center">
                    "{result.business_recommendation}"
                  </p>
                </div>
              </div>
            ) : (
              // PLACEHOLDER STATE
              <div className="bg-white p-10 rounded-xl shadow-sm border border-slate-200 text-center text-slate-400 border-dashed">
                <div className="text-5xl mb-4 grayscale opacity-50">🤖</div>
                <h3 className="text-slate-900 font-bold text-lg">Menunggu Data</h3>
                <p className="text-sm">Silakan isi formulir di samping untuk mendapatkan prediksi.</p>
              </div>
            )}

            {/* 3. CARD HISTORY (NEW FEATURE) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col max-h-[500px]">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-700 text-sm uppercase">Riwayat Sesi Ini</h3>
                <span className="text-xs text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">{history.length}</span>
              </div>
              
              <div className="overflow-y-auto p-2 space-y-2">
                {history.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs italic">
                    Belum ada riwayat prediksi.
                  </div>
                )}

                {history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                    
                    {/* Kiri: Status & Waktu */}
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.result === "CHURN" ? "bg-red-500" : "bg-emerald-500"}`}></div>
                      <div>
                        <div className={`text-sm font-bold ${item.result === "CHURN" ? "text-red-600" : "text-emerald-600"}`}>
                          {item.result} <span className="text-slate-400 font-normal ml-1 text-xs">{(item.prob * 100).toFixed(0)}%</span>
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">
                          {item.time}
                        </div>
                      </div>
                    </div>

                    {/* Kanan: Info Singkat */}
                    <div className="text-right text-xs text-slate-500">
                      <div className="font-medium text-slate-700">${item.charges}</div>
                      <div>{item.tenure} bln • {item.contract === "Month-to-month" ? "Bulanan" : "Kontrak"}</div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}