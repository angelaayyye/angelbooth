import { useState } from 'react';
import type { RoomState } from '../types';
import '../kstyle.css';
import { KstyleNav } from './KstyleNav';

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

export function RoomLobby({
  room,
  isHost,
  playerId,
  connected,
  error,
  onCreateRoom,
  onJoinRoom,
  onStartSession,
  onBack,
}: RoomLobbyProps) {
  const [name, setName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [showJoin, setShowJoin] = useState(false);

  const partnerJoined = room ? room.players.length >= 2 : false;
  const inRoom = !!room;

  return (
    <div className="kstyle-page">
      <KstyleNav onBack={onBack} step="duo" />
      <main className="kstyle-main">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
          duo session
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>
          connect with a friend — you&apos;ll share one strip and snap together
        </p>

        <div className="kstyle-card kstyle-lobby-card">
          {!inRoom ? (
            <>
              {!connected && (
                <p style={{ textAlign: 'center', color: '#999', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  connecting…
                </p>
              )}
              {error && (
                <p style={{ textAlign: 'center', color: '#e11', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {error}
                </p>
              )}

              <label className="kstyle-section-label">your name</label>
              <input
                className="kstyle-input mb-4"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
              />

              {showJoin && (
                <>
                  <label className="kstyle-section-label">room code</label>
                  <input
                    className="kstyle-input mb-4 uppercase tracking-widest text-center"
                    placeholder="ABC123"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                  />
                </>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  className="kstyle-btn-primary flex-1 justify-center"
                  disabled={!connected || !name.trim()}
                  onClick={() => onCreateRoom(name.trim())}
                >
                  create room
                </button>
                <button
                  type="button"
                  className="kstyle-btn-secondary flex-1"
                  disabled={!connected || !name.trim()}
                  onClick={() => {
                    if (showJoin && joinCode.length >= 6) {
                      onJoinRoom(joinCode.trim(), name.trim());
                    } else {
                      setShowJoin(true);
                    }
                  }}
                >
                  {showJoin && joinCode.length >= 6 ? 'join' : 'join room'}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="kstyle-section-label text-center">room code</p>
              <p className="kstyle-room-code mb-6">{room.id}</p>

              <div className="flex flex-col gap-2 mb-6">
                {room.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex justify-between items-center px-4 py-2 rounded-full bg-[#faf7f2] text-sm"
                  >
                    <span>{player.name}</span>
                    <span style={{ color: '#999', fontSize: '0.75rem' }}>
                      {player.id === playerId ? 'you' : ''}
                      {player.id === room.hostId ? ' · host' : ''}
                    </span>
                  </div>
                ))}
                {room.players.length < 2 && (
                  <p style={{ textAlign: 'center', color: '#999', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    waiting for friend…
                  </p>
                )}
              </div>

              {error && (
                <p style={{ textAlign: 'center', color: '#e11', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {error}
                </p>
              )}

              {isHost && (
                <button
                  type="button"
                  className="kstyle-btn-primary w-full justify-center"
                  disabled={!partnerJoined}
                  onClick={onStartSession}
                >
                  {partnerJoined ? 'start photo session →' : 'waiting for friend…'}
                </button>
              )}

              {!isHost && partnerJoined && (
                <p style={{ textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>
                  waiting for host to start…
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
