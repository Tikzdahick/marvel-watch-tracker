/**
 * PredictionWidget — pre/post watch excitement tracker
 * Props:
 *   isWatched:  boolean
 *   prediction: { pre: 1-5|null, post: 1-5|null } | null
 *   onSave:     ({ pre, post }) => void
 */
export default function PredictionWidget({ isWatched, prediction, onSave }) {
  const pre  = prediction?.pre  ?? null
  const post = prediction?.post ?? null

  const accuracy = pre !== null && post !== null ? Math.max(0, 100 - Math.abs(pre - post) * 20) : null
  const diff     = pre !== null && post !== null ? post - pre : null

  function handlePre(val) {
    if (pre !== null) return
    onSave({ pre: val, post: null })
  }

  function handlePost(val) {
    if (!isWatched || post !== null) return
    onSave({ pre, post: val })
  }

  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="rounded-2xl p-4" style={{ background: '#0f0f0f', border: '1px solid #1e1e1e' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base">🎯</span>
        <span className="font-bebas text-sm tracking-widest text-[#E81C2E]">PREDICTION GAME</span>
      </div>

      {/* Pre-watch excitement */}
      <div className="mb-3">
        <div className="text-[10px] text-[#555] uppercase tracking-widest mb-2">
          {pre === null ? 'How excited are you?' : 'Your pre-watch excitement'}
        </div>
        <div className="flex gap-2">
          {stars.map(s => (
            <button
              key={s}
              onClick={() => handlePre(s)}
              disabled={pre !== null}
              className="flex-1 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: pre !== null && s <= pre ? '#E81C2E22' : '#1a1a1a',
                border: `1px solid ${pre !== null && s <= pre ? '#E81C2E66' : '#2a2a2a'}`,
                cursor: pre !== null ? 'default' : 'pointer',
              }}
            >
              <span>{pre !== null && s <= pre ? '❤️' : '🖤'}</span>
            </button>
          ))}
        </div>
        {pre === null && (
          <p className="text-[9px] text-[#444] mt-1.5">Set before watching to track prediction accuracy</p>
        )}
      </div>

      {/* Post-watch rating */}
      {pre !== null && (
        <div className="mb-3">
          <div className="text-[10px] text-[#555] uppercase tracking-widest mb-2">
            {post !== null ? 'Your actual enjoyment' : isWatched ? 'How was it?' : 'Watch first to rate'}
          </div>
          <div className="flex gap-2">
            {stars.map(s => (
              <button
                key={s}
                onClick={() => handlePost(s)}
                disabled={!isWatched || post !== null}
                className="flex-1 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: post !== null && s <= post ? '#F5C51822' : '#1a1a1a',
                  border: `1px solid ${post !== null && s <= post ? '#F5C51866' : '#2a2a2a'}`,
                  cursor: (!isWatched || post !== null) ? 'default' : 'pointer',
                  opacity: !isWatched ? 0.4 : 1,
                }}
              >
                <span>{post !== null && s <= post ? '⭐' : '☆'}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Accuracy result */}
      {accuracy !== null && (
        <div
          className="rounded-xl p-3 text-center mt-2"
          style={{
            background: accuracy >= 80 ? '#4ade8011' : accuracy >= 50 ? '#F5C51811' : '#E81C2E11',
            border: `1px solid ${accuracy >= 80 ? '#4ade8033' : accuracy >= 50 ? '#F5C51833' : '#E81C2E33'}`,
          }}
        >
          <div
            className="font-bebas text-xl tracking-widest"
            style={{ color: accuracy >= 80 ? '#4ade80' : accuracy >= 50 ? '#F5C518' : '#E81C2E' }}
          >
            {accuracy}% ACCURATE
          </div>
          <div className="text-[10px] text-[#555] mt-0.5">
            {diff === 0 ? '🎯 Spot on!' : diff > 0 ? `😄 Better than expected (+${diff})` : `😔 Below expectations (${diff})`}
          </div>
        </div>
      )}
    </div>
  )
}
