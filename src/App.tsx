import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Sun, Wind, Activity, AlertTriangle, Leaf, Droplets, 
  BarChart3, Map as MapIcon, FileText, Info, ShieldCheck,
  Zap, CloudRain, Thermometer, Menu, X, ChevronRight, Download,
  Layers, Navigation, History, Calendar, Eye, EyeOff, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';
import { generateEnergyData, generateEnvironmentData, MOCK_ANOMALIES, TECHNICAL_REPORT_MARKDOWN } from './constants';
import { cn } from './lib/utils';

// --- Components ---

const StatCard = ({ title, value, unit, icon: Icon, trend, color }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2 rounded-lg", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <span className={cn("text-xs font-medium px-2 py-1 rounded-full", 
          trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">
        {value} <span className="text-sm font-normal text-slate-400">{unit}</span>
      </h3>
    </div>
  </motion.div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
      active 
        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeLayer, setActiveLayer] = useState('natural');
  const [selectedRegion, setSelectedRegion] = useState('Western Ghats');
  const [timeStep, setTimeStep] = useState(0);
  const [energyData, setEnergyData] = useState(generateEnergyData());
  const [envData, setEnvData] = useState(generateEnvironmentData());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filter States
  const [energyTimeRange, setEnergyTimeRange] = useState('24h');
  const [envTimeRange, setEnvTimeRange] = useState('12h');
  const [energyMetrics, setEnergyMetrics] = useState({ solar: true, wind: true, demand: true });
  const [envMetrics, setEnvMetrics] = useState({ pm25: true, co2: true });

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(val => typeof val === 'string' ? `"${val}"` : val).join(',')
    ).join('\n');
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportEnergy = () => {
    const filtered = energyData.slice(-parseInt(energyTimeRange));
    exportToCSV(filtered, `eco_monitor_energy_${energyTimeRange}h.csv`);
  };

  const handleExportEnv = () => {
    const filtered = envData.slice(-parseInt(envTimeRange));
    exportToCSV(filtered, `eco_monitor_env_${envTimeRange}h.csv`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyData(generateEnergyData());
      setEnvData(generateEnvironmentData());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    const filteredEnergyData = energyData.slice(-parseInt(energyTimeRange));
    const filteredEnvData = envData.slice(-parseInt(envTimeRange));

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Solar Output" value="42.5" unit="MW" icon={Sun} trend={12} color="bg-amber-500" />
              <StatCard title="Wind Output" value="28.1" unit="MW" icon={Wind} trend={-4} color="bg-sky-500" />
              <StatCard title="Air Quality (PM2.5)" value="18" unit="µg/m³" icon={Activity} trend={-2} color="bg-emerald-500" />
              <StatCard title="CO2 Levels" value="412" unit="ppm" icon={Leaf} trend={1} color="bg-teal-600" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Energy Forecast</h3>
                    <p className="text-xs text-slate-500">Predicted output based on weather patterns</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={handleExportEnergy}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Export CSV"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                      <BarChart3 className="w-3 h-3 text-slate-400" />
                      <select 
                        value={energyTimeRange} 
                        onChange={(e) => setEnergyTimeRange(e.target.value)}
                        className="text-xs font-medium bg-transparent outline-none focus:ring-0 border-none p-0 cursor-pointer"
                      >
                        <option value="6">Last 6h</option>
                        <option value="12">Last 12h</option>
                        <option value="24">Last 24h</option>
                      </select>
                    </div>
                    <div className="flex gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
                      <button 
                        onClick={() => setEnergyMetrics(prev => ({ ...prev, solar: !prev.solar }))}
                        className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all", 
                          energyMetrics.solar ? "bg-amber-500 text-white shadow-sm" : "text-slate-400 hover:text-slate-600")}
                      >
                        Solar
                      </button>
                      <button 
                        onClick={() => setEnergyMetrics(prev => ({ ...prev, wind: !prev.wind }))}
                        className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all", 
                          energyMetrics.wind ? "bg-sky-500 text-white shadow-sm" : "text-slate-400 hover:text-slate-600")}
                      >
                        Wind
                      </button>
                      <button 
                        onClick={() => setEnergyMetrics(prev => ({ ...prev, demand: !prev.demand }))}
                        className={cn("px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all", 
                          energyMetrics.demand ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-600")}
                      >
                        Demand
                      </button>
                    </div>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredEnergyData}>
                      <defs>
                        <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#334155" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#334155" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100 min-w-[160px]">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
                                <div className="space-y-2">
                                  {payload.map((entry: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                        <span className="text-sm font-medium text-slate-600 capitalize">{entry.name}</span>
                                      </div>
                                      <span className="text-sm font-bold text-slate-900">
                                        {entry.value.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">MW</span>
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                {payload.some(p => p.dataKey === 'wind') && (
                                  <div className="mt-3 pt-3 border-t border-slate-50 space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
                                      <span>Wind Speed</span>
                                      <span className="font-bold text-slate-700">
                                        {payload.find(p => p.dataKey === 'wind')?.payload.windSpeed.toFixed(1)} m/s
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
                                      <span>Direction</span>
                                      <span className="font-bold text-slate-700">
                                        {payload.find(p => p.dataKey === 'wind')?.payload.windDirection}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-sky-600 uppercase tracking-tight pt-1">
                                      <Wind className="w-3 h-3" />
                                      <span>Wind Efficiency: High</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      {energyMetrics.solar && <Area type="monotone" dataKey="solar" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSolar)" strokeWidth={2} />}
                      {energyMetrics.wind && <Area type="monotone" dataKey="wind" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorWind)" strokeWidth={2} />}
                      {energyMetrics.demand && <Area type="monotone" dataKey="demand" stroke="#334155" fillOpacity={1} fill="url(#colorDemand)" strokeWidth={2} strokeDasharray="5 5" />}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Environmental Trends</h3>
                    <p className="text-xs text-slate-500">Real-time sensor data tracking</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={handleExportEnv}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Export CSV"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <select 
                      value={envTimeRange} 
                      onChange={(e) => setEnvTimeRange(e.target.value)}
                      className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="4">Last 4h</option>
                      <option value="8">Last 8h</option>
                      <option value="12">Last 12h</option>
                    </select>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEnvMetrics(prev => ({ ...prev, pm25: !prev.pm25 }))}
                        className={cn("px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all", 
                          envMetrics.pm25 ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400")}
                      >
                        PM2.5
                      </button>
                      <button 
                        onClick={() => setEnvMetrics(prev => ({ ...prev, co2: !prev.co2 }))}
                        className={cn("px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all", 
                          envMetrics.co2 ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-400")}
                      >
                        CO2
                      </button>
                    </div>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredEnvData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      {envMetrics.pm25 && <Line type="monotone" dataKey="pm25" stroke="#10b981" strokeWidth={3} dot={false} />}
                      {envMetrics.co2 && <Line type="monotone" dataKey="co2" stroke="#0d9488" strokeWidth={3} dot={false} />}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Anomalies & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Active Anomalies</h3>
                <div className="space-y-4">
                  {MOCK_ANOMALIES.map((anomaly) => (
                    <div key={anomaly.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2 rounded-lg",
                          anomaly.severity === 'High' ? "bg-rose-100 text-rose-600" : 
                          anomaly.severity === 'Medium' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                        )}>
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{anomaly.type} Alert</p>
                          <p className="text-sm text-slate-500">{anomaly.message}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium text-slate-400">{anomaly.timestamp}</span>
                        <div className="mt-1">
                          <span className={cn(
                            "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded",
                            anomaly.severity === 'High' ? "bg-rose-500 text-white" : 
                            anomaly.severity === 'Medium' ? "bg-amber-500 text-white" : "bg-blue-500 text-white"
                          )}>
                            {anomaly.severity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">AI Optimization</h3>
                  <p className="text-emerald-100 text-sm mb-6">
                    Based on current weather patterns, we recommend shifting 15% of the industrial load to solar-peak hours (11:00 - 14:00).
                  </p>
                  <button className="bg-white text-emerald-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-emerald-50 transition-colors">
                    Apply Optimization <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <Zap className="absolute -bottom-4 -right-4 w-32 h-32 text-emerald-800 opacity-50" />
              </div>
            </div>
          </div>
        );
      case 'monitoring':
        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Panel: Regions & Layers */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Monitoring Zones
                  </h3>
                  <div className="space-y-2">
                    {['Western Ghats', 'Bangalore Urban', 'Coastal Karnataka', 'Deccan Plateau'].map((region) => (
                      <button
                        key={region}
                        onClick={() => setSelectedRegion(region)}
                        className={cn(
                          "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all",
                          selectedRegion === region 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : "text-slate-600 hover:bg-slate-50 border border-transparent"
                        )}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Analysis Layers
                  </h3>
                  <div className="space-y-2">
                    {[
                      { id: 'natural', label: 'Natural Color', icon: Eye },
                      { id: 'ndvi', label: 'Vegetation (NDVI)', icon: Leaf },
                      { id: 'moisture', label: 'Soil Moisture', icon: Droplets },
                      { id: 'urban', label: 'Urban Expansion', icon: Zap }
                    ].map((layer) => (
                      <button
                        key={layer.id}
                        onClick={() => setActiveLayer(layer.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                          activeLayer === layer.id 
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" 
                            : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <layer.icon className="w-4 h-4" />
                        {layer.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Map Area */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4 px-4 pt-2">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{selectedRegion}</h2>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Last update: {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-tighter">
                        Sentinel-2 L2A
                      </span>
                    </div>
                  </div>

                  <div className="aspect-[16/9] bg-slate-900 rounded-2xl relative overflow-hidden group">
                    <img 
                      src={`https://picsum.photos/seed/satellite-${selectedRegion.replace(' ', '-')}-${activeLayer}/1200/800`} 
                      alt="Satellite View" 
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Map Overlay Controls */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-lg hover:bg-white transition-colors">
                        <Search className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>

                    {/* Dynamic Metrics Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                        <p className="text-[10px] text-white/70 uppercase font-bold tracking-widest mb-1">
                          {activeLayer === 'ndvi' ? 'Vegetation Health' : 'Confidence Score'}
                        </p>
                        <p className="text-xl font-bold text-white">
                          {activeLayer === 'ndvi' ? '0.74 NDVI' : '98.2%'}
                        </p>
                        <div className="mt-2 h-1 w-full bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 w-[74%]"></div>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                        <p className="text-[10px] text-white/70 uppercase font-bold tracking-widest mb-1">Change Detected</p>
                        <p className="text-xl font-bold text-rose-400">-2.4%</p>
                        <div className="mt-2 h-1 w-full bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-400 w-[12%]"></div>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                        <p className="text-[10px] text-white/70 uppercase font-bold tracking-widest mb-1">Cloud Cover</p>
                        <p className="text-xl font-bold text-sky-400">Low</p>
                        <div className="mt-2 h-1 w-full bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-400 w-[15%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Slider */}
                  <div className="mt-6 px-4 pb-2">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <History className="w-3 h-3" />
                        Historical Timeline
                      </h4>
                      <span className="text-xs font-bold text-emerald-600">
                        {timeStep === 0 ? 'Current View' : `${timeStep} months ago`}
                      </span>
                    </div>
                    <div className="relative h-2 bg-slate-100 rounded-full">
                      <input 
                        type="range" 
                        min="0" 
                        max="12" 
                        step="1" 
                        value={timeStep}
                        onChange={(e) => setTimeStep(parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div 
                        className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${(timeStep / 12) * 100}%` }}
                      ></div>
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-emerald-500 rounded-full shadow-sm transition-all duration-300"
                        style={{ left: `calc(${(timeStep / 12) * 100}% - 8px)` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] font-medium text-slate-400">Current</span>
                      <span className="text-[10px] font-medium text-slate-400">6m</span>
                      <span className="text-[10px] font-medium text-slate-400">12m ago</span>
                    </div>
                  </div>
                </div>

                {/* Recent Observations */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Observations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: 'Vegetation Recovery', desc: 'Positive growth detected in Western Ghats buffer zone.', status: 'Positive', date: '2 days ago' },
                      { title: 'Water Level Drop', desc: 'Significant decrease in reservoir levels near Mandya.', status: 'Warning', date: '3 days ago' },
                      { title: 'Urban Encroachment', desc: 'New construction detected near protected forest area.', status: 'Critical', date: '5 days ago' },
                      { title: 'Cloud-Free Window', desc: 'High-quality imagery available for the entire coastal belt.', status: 'Info', date: '1 week ago' }
                    ].map((obs, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2 shrink-0",
                          obs.status === 'Positive' ? 'bg-emerald-500' :
                          obs.status === 'Warning' ? 'bg-amber-500' :
                          obs.status === 'Critical' ? 'bg-rose-500' : 'bg-sky-500'
                        )}></div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-bold text-slate-900">{obs.title}</h4>
                            <span className="text-[10px] text-slate-400 font-medium">{obs.date}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{obs.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'report':
        return (
          <div className="max-w-4xl mx-auto bg-white p-12 rounded-3xl border border-slate-100 shadow-sm animate-in zoom-in-95 duration-500">
            <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-code:bg-slate-100 prose-code:p-1 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100">
              <Markdown>{TECHNICAL_REPORT_MARKDOWN}</Markdown>
            </div>
          </div>
        );
      case 'summary':
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-12 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-5xl font-bold mb-6 tracking-tight">Executive Summary</h1>
                <p className="text-xl text-emerald-50 leading-relaxed mb-8 max-w-2xl">
                  EcoVolt AI Guardian is a comprehensive solution designed to bridge the gap between renewable energy production and environmental stewardship. 
                  By leveraging state-of-the-art AI, we empower stakeholders to make data-driven decisions for a sustainable future.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/20 pt-8">
                  <div>
                    <h4 className="text-emerald-300 font-bold uppercase tracking-widest text-xs mb-2">Efficiency</h4>
                    <p className="text-2xl font-bold">+20% Grid Stability</p>
                  </div>
                  <div>
                    <h4 className="text-emerald-300 font-bold uppercase tracking-widest text-xs mb-2">Monitoring</h4>
                    <p className="text-2xl font-bold">10m Res Satellite</p>
                  </div>
                  <div>
                    <h4 className="text-emerald-300 font-bold uppercase tracking-widest text-xs mb-2">Impact</h4>
                    <p className="text-2xl font-bold">-15% Carbon Footprint</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="text-emerald-600" /> Scalability & Ethics
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Our platform is built on a modular microservices architecture, allowing it to scale from a single farm to an entire state like Karnataka. 
                  We prioritize ethical AI by implementing rigorous bias testing in our pollution models and ensuring strict data privacy for all localized sensor data.
                </p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Info className="text-emerald-600" /> Future Roadmap
                </h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-emerald-500" /> Integration with India's Smart City Mission.</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-emerald-500" /> Blockchain-based carbon credit verification.</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-emerald-500" /> Hyper-local weather forecasting using IoT mesh.</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        !isSidebarOpen && "-translate-x-full lg:hidden"
      )}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-200">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">EcoVolt AI Guardian</h1>
          </div>
          
          <nav className="space-y-2">
            <SidebarItem 
              icon={BarChart3} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <SidebarItem 
              icon={MapIcon} 
              label="Monitoring" 
              active={activeTab === 'monitoring'} 
              onClick={() => setActiveTab('monitoring')} 
            />
            <SidebarItem 
              icon={FileText} 
              label="Technical Report" 
              active={activeTab === 'report'} 
              onClick={() => setActiveTab('report')} 
            />
            <SidebarItem 
              icon={Info} 
              label="Executive Summary" 
              active={activeTab === 'summary'} 
              onClick={() => setActiveTab('summary')} 
            />
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              JD
            </div>
            <div>
              <p className="text-sm font-bold">John Doe</p>
              <p className="text-xs text-slate-500">Utility Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <h2 className="text-lg font-bold capitalize">{activeTab.replace('-', ' ')}</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
              <CloudRain className="w-4 h-4" />
              <span>Bangalore: 24°C, Sunny</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-slate-600 relative">
                <Activity className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-px bg-slate-200"></div>
              <button className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                System Secure
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
