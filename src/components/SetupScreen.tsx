import type { LayoutId, LayoutOption, SessionMode } from '../types';
import { LAYOUTS } from '../constants';
import '../setup-gallery.css';

interface SetupScreenProps {
  selectedLayout: LayoutOption;
  sessionMode: SessionMode | null;
  onLayoutSelect: (layout: LayoutOption) => void;
  onSessionModeChange: (mode: SessionMode) => void;
  onEnter: () => void;
}

function FramePreview({ layoutId }: { layoutId: LayoutId }) {
  switch (layoutId) {
    case 'strip-4':
      return (
        <div className="w-16 h-16 bg-pink-100 rounded-lg flex flex-col gap-1 p-2">
          <div className="w-full h-2 bg-pink-400 rounded-sm"></div>
          <div className="w-full h-2 bg-pink-400 rounded-sm"></div>
          <div className="w-full h-2 bg-pink-400 rounded-sm"></div>
          <div className="w-full h-2 bg-pink-400 rounded-sm"></div>
        </div>
      );
    case 'strip-3':
      return (
        <div className="w-16 h-16 bg-pink-100 rounded-lg flex flex-col gap-1 p-2 justify-center">
          <div className="w-full h-3 bg-pink-400 rounded-sm"></div>
          <div className="w-full h-3 bg-pink-400 rounded-sm"></div>
          <div className="w-full h-3 bg-pink-400 rounded-sm"></div>
        </div>
      );
    case 'strip-2':
      return (
        <div className="w-16 h-16 bg-pink-100 rounded-lg flex flex-col gap-1 p-2 justify-center">
          <div className="w-full h-5 bg-pink-400 rounded-sm"></div>
          <div className="w-full h-5 bg-pink-400 rounded-sm"></div>
        </div>
      );
    case 'grid-4':
      return (
        <div className="w-16 h-16 bg-pink-100 rounded-lg grid grid-cols-2 gap-1 p-2">
          <div className="bg-pink-400 rounded-sm"></div>
          <div className="bg-pink-400 rounded-sm"></div>
          <div className="bg-pink-400 rounded-sm"></div>
          <div className="bg-pink-400 rounded-sm"></div>
        </div>
      );
    case 'grid-2':
      return (
        <div className="w-16 h-16 bg-pink-100 rounded-lg grid grid-cols-2 gap-1 p-2">
          <div className="h-full bg-pink-400 rounded-sm"></div>
          <div className="h-full bg-pink-400 rounded-sm"></div>
        </div>
      );
    case 'single':
      return (
        <div className="w-16 h-16 bg-pink-100 rounded-lg p-2">
          <div className="w-full h-full bg-pink-400 rounded-sm"></div>
        </div>
      );
  }
}

export function SetupScreen({
  selectedLayout,
  sessionMode,
  onLayoutSelect,
  onSessionModeChange,
  onEnter,
}: SetupScreenProps) {
  return (
    <div className="setup-gallery-root light bg-surface text-on-surface min-h-screen font-body-md overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="macos-glass h-7 w-full flex items-center justify-between px-4 text-[13px] font-medium text-gray-800 z-50 fixed top-0 left-0">
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

      <div className="flex h-screen pt-20">
        {/* Main Content Area */}
        <main className="flex-1 p-inner-padding lg:p-window-gap overflow-y-auto relative">
          <div className="absolute top-4 right-4 w-80 bg-white rounded-xl p-4 shadow-lg border border-gray-100 z-40 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-2xl">mail</span>
            </div>
            <div className="flex-grow overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-[13px] font-bold text-gray-900">Gmail</span>
                <span className="text-[11px] text-gray-500">now</span>
              </div>
              <p className="text-[14px] font-medium text-gray-900 leading-tight">invite a friend!</p>
            </div>
          </div>

          {/* Main Window Container */}
          <div className="relative w-full max-w-[800px] aspect-[4/3] bg-white rounded-xl overflow-hidden window-shadow flex flex-col mx-auto mt-10">
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
                <span className="material-symbols-outlined text-[20px]">videocam</span>
                <span className="material-symbols-outlined text-[20px]">info</span>
              </div>
            </div>

            <div className="flex-grow flex flex-col bg-white overflow-hidden">
              <div className="py-2 flex flex-col items-center border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-1">
                  <span className="material-symbols-outlined text-gray-500">person</span>
                </div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Digital Diary</span>
              </div>

              <div className="flex-grow p-6 flex flex-col gap-1 overflow-y-auto">
                <div className="text-center py-4">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Today 9:41 AM</span>
                </div>

                <div className="relative z-30 flex flex-col gap-2">
                  <div className="bubble bubble-gray">
                    are u taking photos{' '}
                    <button
                      type="button"
                      onClick={() => onSessionModeChange('solo')}
                      className={`px-3 py-1 rounded-full text-[13px] font-bold transition-colors mx-1 ${
                        sessionMode === 'solo'
                          ? 'bg-green-600 text-white ring-2 ring-green-300'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      by yourself
                    </button>{' '}
                    or{' '}
                    <button
                      type="button"
                      onClick={() => onSessionModeChange('remote')}
                      className={`px-3 py-1 rounded-full text-[13px] font-bold transition-colors mx-1 ${
                        sessionMode === 'remote'
                          ? 'bg-green-600 text-white ring-2 ring-green-300'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      with a friend
                    </button>
                    ?
                  </div>
                  {sessionMode === 'remote' && (
                    <div className="bubble bubble-gray text-[13px]">
                      nice — tap ENTER and create a room to share with your friend
                    </div>
                  )}
                  {sessionMode === 'solo' && (
                    <div className="bubble bubble-gray text-[13px]">
                      solo vibes — tap ENTER when ur frame is picked
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-2 relative z-10">
                  <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Pick ur vibe:</p>
                  <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[240px] p-1">
                    {LAYOUTS.map((layout) => {
                      const isSelected = selectedLayout.id === layout.id;
                      return (
                        <button
                          key={layout.id}
                          type="button"
                          onClick={() => onLayoutSelect(layout)}
                          className={`frame-card relative flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-200 ${
                            isSelected ? 'ring-4 ring-secondary' : 'hover:border-primary transition-all'
                          }`}
                          style={{ zIndex: isSelected ? 10 : 1 }}
                        >
                          <FramePreview layoutId={layout.id} />
                          <div className="text-center">
                            <p className="font-bold text-gray-900 text-[14px]">{layout.name}</p>
                            <p className="text-gray-500 text-[11px]">{layout.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex flex-col items-center">
                <div className="w-full flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 mb-4">
                  <span className="material-symbols-outlined text-gray-400 text-[20px]">add_circle</span>
                  <div className="flex-grow text-gray-400 text-[14px]">iMessage</div>
                  <span className="material-symbols-outlined text-gray-400 text-[20px]">mic</span>
                </div>
                <button
                  type="button"
                  onClick={onEnter}
                  disabled={!sessionMode}
                  className="px-12 py-2.5 bg-primary hover:bg-[#0062cc] text-on-primary text-[15px] font-semibold rounded-lg shadow-sm active:transform active:scale-95 transition-all w-full max-w-[200px] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  ENTER
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Global Footer */}
      <footer className="h-20 w-full flex items-end justify-center pb-2 z-50 fixed bottom-0">
        <div className="macos-dark-glass px-4 py-2 rounded-[24px] flex items-center gap-2">
          <div className="w-12 h-12 dock-icon rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-lg overflow-hidden">
            <span className="material-symbols-outlined text-3xl">grid_view</span>
          </div>
          <div className="w-12 h-12 dock-icon rounded-xl bg-white flex items-center justify-center shadow-lg p-1">
            <img
              alt="Photos"
              className="w-full h-full object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeBcNsKFqTyT_yveQhCh24ZTMyoHnMQ0yjdOYoyvGWX7KEOzkG8icsbE5SqaztO3c240Wx7xM3dAh84CI_LbSWuoBY-7g4AhTTS_jUnjVbfNOTkzO7jbXgjZ40VBBQO2GjCgcpapkO1lE2TYeFSUIGcQhL5Oy46nSfptg56U9qWtR5k5rjvodeeJ8_AG_hPg7tQrPwU4oqFFJw74-AqetV-dno6vptgD_0yzJgLUZKyZJ2TTZKBkA"
            />
          </div>
          <div className="relative group">
            <div className="w-12 h-12 dock-icon rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white shadow-lg">
              <span className="material-symbols-outlined text-3xl">chat</span>
            </div>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
          </div>
          <div className="w-12 h-12 dock-icon rounded-xl bg-white flex items-center justify-center shadow-lg p-1">
            <img
              alt="Safari"
              className="w-full h-full object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5LyNqxVSiEWrriZlRXyqzDtw93bl9lfb_sxxWoh_SOCu-3BqUd5qSBmFj-Xk2bicyEQbrgTVGT_QI-aCpk7HfSxgqOF8IVnfx70Iv7irU6w_SD4gxXoKEyfryDOwLAi7i1bVtOjjNLgQTyO4yElakrqr79Gm3iRPBon8CI4B6uZJOLBeT9HR0fFWNi9-TwgmZq-PGmIuM7qtyja8_1RkcbB_2HRuTLTr6z7cZNAIW2HPcXihehLc"
            />
          </div>
          <div className="w-12 h-12 dock-icon rounded-xl bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined text-3xl">music_note</span>
          </div>
          <div className="w-px h-8 bg-white/20 mx-1"></div>
          <div className="w-12 h-12 dock-icon rounded-xl flex items-center justify-center text-white/80">
            <span className="material-symbols-outlined text-3xl">delete</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
