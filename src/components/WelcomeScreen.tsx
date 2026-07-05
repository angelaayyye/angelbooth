import { useEffect, useRef } from 'react';
import '../welcome-macos.css';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const windowEl = windowRef.current;
    if (!windowEl) return;

    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.bg-[#f6f6f6]')) {
        windowEl.style.opacity = '0.9';
      }
    };
    const onMouseUp = () => {
      windowEl.style.opacity = '1';
    };

    windowEl.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      windowEl.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className="macos-welcome-root light flex flex-col">
      {/* macOS Menu Bar */}
      <header className="macos-glass h-7 w-full flex items-center justify-between px-4 text-[13px] font-medium text-gray-800 z-50">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[18px]">apple</span>
          <span className="font-bold">Messages</span>
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Window</span>
          <span>Help</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[18px]">wifi</span>
          <span className="material-symbols-outlined text-[18px]">battery_full</span>
          <span className="material-symbols-outlined text-[18px]">search</span>
          <span className="material-symbols-outlined text-[18px]">control_point_duplicate</span>
          <span className="text-[13px]">Mon Jun 12 &nbsp; 9:41 AM</span>
        </div>
      </header>

      {/* Desktop Area */}
      <main className="relative flex-grow flex items-center justify-center p-6">
        {/* AirDrop Notification */}
        <div className="absolute top-4 right-4 w-80 macos-glass rounded-2xl p-4 notification-shadow z-40 flex items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-2xl">sensors</span>
          </div>
          <div className="flex-grow overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[13px] font-bold text-gray-900">AirDrop</span>
              <span className="text-[11px] text-gray-500">now</span>
            </div>
            <p className="text-[14px] font-medium text-gray-900 leading-tight">remember to smile</p>
            <p className="text-[12px] text-gray-500 leading-tight">Sent from my iPhone</p>
          </div>
        </div>

        {/* Main iMessage Window */}
        <div
          ref={windowRef}
          className="relative w-full max-w-[800px] aspect-[4/3] bg-white rounded-xl overflow-hidden window-shadow flex flex-col transform hover:scale-[1.002] transition-transform"
        >
          {/* Window Header */}
          <div className="bg-[#f6f6f6] border-b border-outline px-4 py-3 flex items-center relative shrink-0">
            <div className="flex gap-2 relative z-10">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10"></div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[13px] font-semibold text-gray-900">Messages</span>
            </div>
            <div className="ml-auto flex items-center gap-4 relative z-10 text-gray-500">
              <span className="material-symbols-outlined text-[20px] cursor-pointer">videocam</span>
              <span className="material-symbols-outlined text-[20px] cursor-pointer">info</span>
            </div>
          </div>

          {/* Window Content (iMessage View) */}
          <div className="flex-grow flex flex-col bg-white overflow-hidden">
            {/* Conversation Header (Recipient Name) */}
            <div className="py-2 flex flex-col items-center border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-1">
                <span className="material-symbols-outlined text-gray-500">person</span>
              </div>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Digital Diary</span>
            </div>

            {/* Messages Thread */}
            <div className="flex-grow p-6 flex flex-col gap-1 overflow-y-auto">
              <div className="text-center py-4">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Today 9:41 AM</span>
              </div>
              {/* Message 1 */}
              <div className="bubble bubble-gray">
                welcome to ur digital diary xoxo
              </div>
              {/* Message 2 */}
              <div className="bubble bubble-gray mt-2">
                click &quot;enter&quot; to pick ur frame
              </div>
              {/* Message 3 */}
              <div className="bubble bubble-gray mt-2">
                have fun
              </div>
            </div>

            {/* Input Area / ENTER Button Bar */}
            <div className="p-6 pt-0 flex flex-col items-center">
              <div className="w-full flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 mb-4">
                <span className="material-symbols-outlined text-gray-400 text-[20px]">add_circle</span>
                <div className="flex-grow text-gray-400 text-[14px]">iMessage</div>
                <span className="material-symbols-outlined text-gray-400 text-[20px]">mic</span>
              </div>
              <button
                type="button"
                onClick={onStart}
                className="px-12 py-2.5 bg-primary hover:bg-[#0062cc] text-on-primary text-[15px] font-semibold rounded-lg shadow-sm active:transform active:scale-95 transition-all w-full max-w-[200px]"
              >
                ENTER
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* macOS Dock */}
      <footer className="h-20 w-full flex items-end justify-center pb-2 z-50">
        <div className="macos-dark-glass px-4 py-2 rounded-[24px] flex items-center gap-2">
          {/* Finder */}
          <div className="w-12 h-12 dock-icon rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-lg overflow-hidden">
            <span className="material-symbols-outlined text-3xl">grid_view</span>
          </div>
          {/* Photos */}
          <div className="w-12 h-12 dock-icon rounded-xl bg-white flex items-center justify-center shadow-lg p-1">
            <img
              alt="Photos"
              className="w-full h-full object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeBcNsKFqTyT_yveQhCh24ZTMyoHnMQ0yjdOYoyvGWX7KEOzkG8icsbE5SqaztO3c240Wx7xM3dAh84CI_LbSWuoBY-7g4AhTTS_jUnjVbfNOTkzO7jbXgjZ40VBBQO2GjCgcpapkO1lE2TYeFSUIGcQhL5Oy46nSfptg56U9qWtR5k5rjvodeeJ8_AG_hPg7tQrPwU4oqFFJw74-AqetV-dno6vptgD_0yzJgLUZKyZJ2TTZKBkA"
            />
          </div>
          {/* Messages (Active) */}
          <div className="relative group">
            <div className="w-12 h-12 dock-icon rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white shadow-lg">
              <span className="material-symbols-outlined text-3xl">chat</span>
            </div>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
          </div>
          {/* Safari */}
          <div className="w-12 h-12 dock-icon rounded-xl bg-white flex items-center justify-center shadow-lg p-1">
            <img
              alt="Safari"
              className="w-full h-full object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5LyNqxVSiEWrriZlRXyqzDtw93bl9lfb_sxxWoh_SOCu-3BqUd5qSBmFj-Xk2bicyEQbrgTVGT_QI-aCpk7HfSxgqOF8IVnfx70Iv7irU6w_SD4gxXoKEyfryDOwLAi7i1bVtOjjNLgQTyO4yElakrqr79Gm3iRPBon8CI4B6uZJOLBeT9HR0fFWNi9-TwgmZq-PGmIuM7qtyja8_1RkcbB_2HRuTLTr6z7cZNAIW2HPcXihehLc"
            />
          </div>
          {/* Music */}
          <div className="w-12 h-12 dock-icon rounded-xl bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined text-3xl">music_note</span>
          </div>
          <div className="w-px h-8 bg-white/20 mx-1"></div>
          {/* Bin */}
          <div className="w-12 h-12 dock-icon rounded-xl flex items-center justify-center text-white/80">
            <span className="material-symbols-outlined text-3xl">delete</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
