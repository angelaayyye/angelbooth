import { useState } from 'react';
import type { RoomState } from '../types';
import '../setup-gallery.css';

interface RoomLobbyProps {
  room: RoomState | null;
  isHost: boolean;
  playerId: string | null;
  connected: boolean;
  error: string | null;
  onCreateRoom: (name: string) => void;
  onJoinRoom: (code: string, name: string) => void;
  onStartSession: () => void;
  onBack: () => void;
}

function Dock() {
  return (
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
  );
}

export function RoomLobby({
  room,
  isHost,
  playerId,
  connected,
  error,
  onCreateRoom,
  onJoinRoom,
  onStartSession,
}: RoomLobbyProps) {
  const [name, setName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [showJoin, setShowJoin] = useState(false);

  const partnerJoined = room ? room.players.length >= 2 : false;
  const inRoom = !!room;

  return (
    <div className="setup-gallery-root light bg-surface text-on-surface min-h-screen font-body-md overflow-x-hidden">
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
              <p className="text-[14px] font-medium text-gray-900 leading-tight">make sure to share ur code</p>
            </div>
          </div>

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

                <div className="flex flex-col gap-2">
                  <div className="bubble bubble-gray">duo sesh!</div>
                  <div className="bubble bubble-gray">
                    connect with a friend on another device. you will share one photo strip and take turns with a synchronized countdown
                  </div>

                  {!inRoom ? (
                    <div className="mt-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant flex flex-col gap-4">
                      {!connected && (
                        <p className="text-[12px] text-center text-gray-500">Connecting to sync server…</p>
                      )}
                      {error && (
                        <p className="text-[12px] text-center text-red-600">{error}</p>
                      )}

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-primary uppercase tracking-wider">Your Name</label>
                        <input
                          className="w-full px-4 py-2 rounded-full border border-outline bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="Enter your name..."
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          maxLength={20}
                        />
                      </div>

                      {showJoin && (
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-primary uppercase tracking-wider">Room Code</label>
                          <input
                            className="w-full px-4 py-2 rounded-full border border-outline bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase tracking-widest"
                            placeholder="ABC123"
                            type="text"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            maxLength={6}
                          />
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="flex-1 bg-primary text-white py-2 rounded-full font-semibold text-[14px] shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                          disabled={!connected || !name.trim()}
                          onClick={() => onCreateRoom(name.trim())}
                        >
                          Create Room
                        </button>
                        <button
                          type="button"
                          className="flex-1 bg-secondary text-white py-2 rounded-full font-semibold text-[14px] shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                          disabled={!connected || !name.trim()}
                          onClick={() => {
                            if (showJoin && joinCode.length >= 6) {
                              onJoinRoom(joinCode.trim(), name.trim());
                            } else {
                              setShowJoin(true);
                            }
                          }}
                        >
                          Join Room
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant flex flex-col gap-4">
                      <div className="text-center">
                        <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">Room Code</p>
                        <p className="text-2xl font-bold tracking-[0.2em] text-primary">{room.id}</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        {room.players.map((player) => (
                          <div
                            key={player.id}
                            className="flex items-center justify-between px-4 py-2 bg-white rounded-full border border-outline text-[14px]"
                          >
                            <span>{player.name}</span>
                            <span className="text-[11px] text-gray-500">
                              {player.id === playerId ? 'You' : ''}
                              {player.id === room.hostId ? ' · Host' : ''}
                            </span>
                          </div>
                        ))}
                        {room.players.length < 2 && (
                          <p className="text-[12px] text-center text-gray-500 italic">Waiting for friend…</p>
                        )}
                      </div>

                      {error && (
                        <p className="text-[12px] text-center text-red-600">{error}</p>
                      )}

                      {isHost && (
                        <button
                          type="button"
                          className="w-full bg-primary text-white py-2 rounded-full font-semibold text-[14px] shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                          disabled={!partnerJoined}
                          onClick={onStartSession}
                        >
                          {partnerJoined ? 'Start Photo Session' : 'Waiting for friend to join…'}
                        </button>
                      )}

                      {!isHost && partnerJoined && (
                        <p className="text-[12px] text-center text-gray-500">Waiting for host to start the session…</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 flex flex-col items-center">
                <div className="w-full flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 mb-4">
                  <span className="material-symbols-outlined text-gray-400 text-[20px]">add_circle</span>
                  <div className="flex-grow text-gray-400 text-[14px]">iMessage</div>
                  <span className="material-symbols-outlined text-gray-400 text-[20px]">mic</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Dock />
    </div>
  );
}
