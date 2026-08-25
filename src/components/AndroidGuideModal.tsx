import React, { useState } from 'react';
import { X, Smartphone, CheckCircle, Package, Layers, Terminal, Play, ArrowRight, Share2, Download, ExternalLink } from 'lucide-react';

interface AndroidGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidGuideModal: React.FC<AndroidGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'mobile' | 'prereq' | 'deploy' | 'convert'>('mobile');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg leading-tight">
                Android Development & Deployment Guide
              </h3>
              <p className="text-blue-100 text-xs font-medium">Building and running apps on your Android phone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-3 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('mobile')}
            className={`px-3.5 py-2.5 text-xs font-black border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'mobile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📱 Phone Development
          </button>
          <button
            onClick={() => setActiveTab('convert')}
            className={`px-3.5 py-2.5 text-xs font-black border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'convert'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ⚡ Test On Phone (PWA / APK)
          </button>
          <button
            onClick={() => setActiveTab('prereq')}
            className={`px-3.5 py-2.5 text-xs font-black border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'prereq'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📋 Prerequisites
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-3.5 py-2.5 text-xs font-black border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'deploy'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🚀 Play Store Deployment
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-700 text-sm leading-relaxed">
          {activeTab === 'mobile' && (
            <div className="space-y-3.5">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <h4 className="font-black text-blue-900 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  Can you develop directly on your Android phone?
                </h4>
                <p className="text-xs text-blue-800 mt-1">
                  <strong>Yes!</strong> By using cloud IDEs (like this AI Studio Build environment, GitHub Codespaces, or Replit), your phone's browser acts as a full workstation without needing heavy local Android Studio hardware.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                    <span>☁️</span> Cloud Workspaces (Best)
                  </div>
                  <p className="text-xs text-slate-600">
                    Google AI Studio, Codespaces, Replit. Runs Node.js and TypeScript in cloud containers. You code and preview live on your phone.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                    <span>📲</span> Android Coding Apps
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Termux</strong> (Linux terminal on Android) or <strong>Acode / Spck Editor</strong> for on-device local HTML/JS/React editing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'convert' && (
            <div className="space-y-3.5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <h4 className="font-black text-emerald-900 text-sm flex items-center gap-2">
                  <span>⚡</span> Method 1: Instant Install as PWA (0-Setup)
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  You can install this interactive kids learning app right now onto your Android home screen:
                </p>
                <ol className="list-decimal list-inside text-xs text-emerald-900 mt-2 space-y-1 font-semibold">
                  <li>Open this app link in Google Chrome on your Android phone.</li>
                  <li>Tap the <strong>three dots (⋮)</strong> menu in Chrome.</li>
                  <li>Tap <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>It now opens in fullscreen just like a native Android app!</li>
                </ol>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <span>📦</span> Method 2: Convert to Native Android APK (.apk / .aab)
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  To turn this React app into an installable Android APK package using <strong>Capacitor</strong>:
                </p>
                <div className="mt-2 p-2.5 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
                  npm install @capacitor/core @capacitor/android<br/>
                  npx cap init KiddoLearn com.example.kiddolearn<br/>
                  npx cap add android<br/>
                  npx cap open android
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prereq' && (
            <div className="space-y-3">
              <h4 className="font-black text-slate-900 text-sm">Prerequisites for Native Android Builds:</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">1</div>
                  <div>
                    <strong className="text-xs text-slate-900">Node.js (v18+) & Package Manager</strong>
                    <p className="text-xs text-slate-600 mt-0.5">Runs build scripts (Vite, React, TypeScript, or Expo).</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">2</div>
                  <div>
                    <strong className="text-xs text-slate-900">Java Development Kit (JDK 17)</strong>
                    <p className="text-xs text-slate-600 mt-0.5">Required by Android Gradle build tools to compile Java/Kotlin code.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">3</div>
                  <div>
                    <strong className="text-xs text-slate-900">Android Studio & Android SDK</strong>
                    <p className="text-xs text-slate-600 mt-0.5">Includes Android SDK Platform Tools (`adb`), Build-tools, and Emulators.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">4</div>
                  <div>
                    <strong className="text-xs text-slate-900">On-Device Developer Mode</strong>
                    <p className="text-xs text-slate-600 mt-0.5">On your phone, tap Settings &gt; About Phone &gt; Build number 7 times to enable USB Debugging.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-3">
              <h4 className="font-black text-slate-900 text-sm">Google Play Store Deployment Steps:</h4>

              <div className="grid grid-cols-1 gap-2.5">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="font-bold text-xs text-slate-900 mb-0.5">1. Google Play Console Account</div>
                  <p className="text-xs text-slate-600">Register at play.google.com/console (one-time $25 registration fee).</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="font-bold text-xs text-slate-900 mb-0.5">2. Generate Signed Android App Bundle (.aab)</div>
                  <p className="text-xs text-slate-600">Create a secure release keystore with Gradle to produce a signed release `.aab` file.</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="font-bold text-xs text-slate-900 mb-0.5">3. Store Assets & Privacy Compliance</div>
                  <p className="text-xs text-slate-600">Upload 512x512 app icon, feature graphic (1024x500), screenshots, description, and Target Audience questionnaire (Family & Kids policy for kids apps).</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="font-bold text-xs text-slate-900 mb-0.5">4. Review & Release</div>
                  <p className="text-xs text-slate-600">Submit for Google Play automated + human review (typically approved in 1–3 business days).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-all"
          >
            Got it! Let's Test App
          </button>
        </div>
      </div>
    </div>
  );
};
