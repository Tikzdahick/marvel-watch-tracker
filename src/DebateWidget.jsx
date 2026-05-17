const DEBATES = [
  { id: 'd1',  question: 'Best Phase 1 movie?',                        optA: 'Iron Man',        optB: 'The Avengers' },
  { id: 'd2',  question: 'Thor or Captain America?',                    optA: 'Thor',            optB: 'Captain America' },
  { id: 'd3',  question: 'Better villain: Thanos or Loki?',             optA: 'Thanos',          optB: 'Loki' },
  { id: 'd4',  question: 'Iron Man 1 or 3?',                            optA: 'Iron Man',        optB: 'Iron Man 3' },
  { id: 'd5',  question: 'Doctor Strange or Ant-Man?',                  optA: 'Doctor Strange',  optB: 'Ant-Man' },
  { id: 'd6',  question: 'Infinity War or Endgame?',                    optA: 'Infinity War',    optB: 'Endgame' },
  { id: 'd7',  question: 'Better duo: Rocket+Groot or Scott+Hope?',     optA: 'Rocket & Groot',  optB: 'Scott & Hope' },
  { id: 'd8',  question: 'Wakanda vs Asgard — who wins?',              optA: 'Wakanda',         optB: 'Asgard' },
  { id: 'd9',  question: 'Guardians Vol. 1 or Vol. 2?',                optA: 'Vol. 1',          optB: 'Vol. 2' },
  { id: 'd10', question: 'Better TV show: WandaVision or Loki?',        optA: 'WandaVision',     optB: 'Loki' },
  { id: 'd11', question: 'Spider-Man: Homecoming or No Way Home?',      optA: 'Homecoming',      optB: 'No Way Home' },
  { id: 'd12', question: 'Best female hero: Wanda or Carol?',           optA: 'Scarlet Witch',   optB: 'Captain Marvel' },
  { id: 'd13', question: 'Better mentor: Nick Fury or Tony Stark?',     optA: 'Nick Fury',       optB: 'Tony Stark' },
  { id: 'd14', question: 'Hulk or Thor in a fistfight?',                optA: 'Hulk',            optB: 'Thor' },
]

function getDailyDebate(dateStr) {
  const seed = dateStr.split('-').reduce((a, n) => a * 100 + parseInt(n), 0)
  return DEBATES[seed % DEBATES.length]
}

/**
 * DebateWidget
 * Props:
 *   dateStr:     string YYYY-MM-DD
 *   debateState: { [key]: { vote: 'A'|'B', votesA: number, votesB: number } }
 *   onVote:      (key: string, choice: 'A'|'B', dateStr: string) => void
 */
export default function DebateWidget({ dateStr, debateState = {}, onVote }) {
  const debate  = getDailyDebate(dateStr)
  const key     = `${debate.id}_${dateStr}`
  const myVote  = debateState?.[key]?.vote  ?? null
  const votesA  = debateState?.[key]?.votesA ?? 53
  const votesB  = debateState?.[key]?.votesB ?? 47
  const total   = votesA + votesB
  const pctA    = Math.round((votesA / total) * 100)
  const pctB    = 100 - pctA

  function handleVote(choice) {
    if (myVote) return
    onVote(key, choice, dateStr)
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#0f0f0f', border: '1px solid #1e1e1e' }}>
      {/* Header */}
      <div className="px-4 pt-3 pb-2.5 flex items-center gap-2" style={{ borderBottom: '1px solid #141414' }}>
        <span className="text-sm">⚔️</span>
        <span className="font-bebas text-sm tracking-widest text-[#E81C2E]">DAILY DEBATE</span>
        <span className="ml-auto text-[9px] text-[#444] uppercase tracking-wider">Vote once</span>
      </div>

      <div className="px-4 py-4">
        <p className="text-white text-sm font-semibold text-center mb-4">{debate.question}</p>

        <div className="space-y-2">
          {/* Option A */}
          <button
            onClick={() => handleVote('A')}
            disabled={!!myVote}
            className="w-full rounded-xl overflow-hidden transition-all active:scale-[0.98]"
            style={{
              border: `1px solid ${myVote === 'A' ? '#E81C2E' : '#1e1e1e'}`,
              cursor: myVote ? 'default' : 'pointer',
            }}
          >
            <div className="relative h-10 flex items-center bg-[#0a0a0a]">
              {myVote && (
                <div
                  className="absolute left-0 top-0 h-full transition-all duration-700"
                  style={{ width: `${pctA}%`, background: '#E81C2E18' }}
                />
              )}
              <div className="relative flex items-center justify-between w-full px-3">
                <span className="text-sm font-medium text-white">{debate.optA}</span>
                {myVote && <span className="text-sm font-bold" style={{ color: '#E81C2E' }}>{pctA}%</span>}
              </div>
            </div>
          </button>

          {/* Option B */}
          <button
            onClick={() => handleVote('B')}
            disabled={!!myVote}
            className="w-full rounded-xl overflow-hidden transition-all active:scale-[0.98]"
            style={{
              border: `1px solid ${myVote === 'B' ? '#60a5fa' : '#1e1e1e'}`,
              cursor: myVote ? 'default' : 'pointer',
            }}
          >
            <div className="relative h-10 flex items-center bg-[#0a0a0a]">
              {myVote && (
                <div
                  className="absolute left-0 top-0 h-full transition-all duration-700"
                  style={{ width: `${pctB}%`, background: '#60a5fa18' }}
                />
              )}
              <div className="relative flex items-center justify-between w-full px-3">
                <span className="text-sm font-medium text-white">{debate.optB}</span>
                {myVote && <span className="text-sm font-bold" style={{ color: '#60a5fa' }}>{pctB}%</span>}
              </div>
            </div>
          </button>
        </div>

        {!myVote ? (
          <p className="text-center text-[10px] text-[#444] mt-3">Tap to cast your vote</p>
        ) : (
          <p className="text-center text-[10px] text-[#555] mt-3">
            You voted:{' '}
            <span style={{ color: myVote === 'A' ? '#E81C2E' : '#60a5fa' }}>
              {myVote === 'A' ? debate.optA : debate.optB}
            </span>
          </p>
        )}
      </div>
    </div>
  )
}
