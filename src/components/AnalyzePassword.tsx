import { useEffect, useMemo, useState } from 'react'
import { analyzePassword, strengthLabelFromEntropy, StrengthBucket, estimateBruteForceTime } from '../lib/analysis'
import { checkCommonPassword } from '../lib/commonDb'
import { hibpCheckPassword } from '../lib/hibp'

export function AnalyzePassword() {
  const [password, setPassword] = useState('')
  const [hibpCount, setHibpCount] = useState<number | null>(null)
  const [hibpStatus, setHibpStatus] = useState<'idle' | 'checking' | 'error'>('idle')

  const analysis = useMemo(() => analyzePassword(password), [password])

  const common = useMemo(() => (password ? checkCommonPassword(password) : null), [password])

  const onCheckHIBP = async () => {
    if (!password) return
    try {
      setHibpStatus('checking')
      const count = await hibpCheckPassword(password)
      setHibpCount(count)
      setHibpStatus('idle')
    } catch (e) {
      setHibpStatus('error')
    }
  }

  const bucket: StrengthBucket = strengthLabelFromEntropy(analysis.entropyBits)

  useEffect(() => {
    setHibpCount(null)
  }, [password])

  const crackTime = estimateBruteForceTime(analysis.entropyBits)

  return (
    <div>
      {/* Password Input Section */}
      <div className='password-input-group'>
        <label className='field-label'>Enter Password to Analyze</label>
        <div className='password-input'>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Type or paste a password to analyze…'
            aria-label='Password input'
          />
          <button 
            onClick={() => navigator.clipboard?.writeText(password || '')}
            disabled={!password}
            title='Copy password to clipboard'
            className='ghost'
          >
            📋 Copy
          </button>
          <button 
            onClick={() => setPassword('')}
            disabled={!password}
            title='Clear password'
            className='ghost'
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Strength Meter */}
      {password && (
        <div className='strength-meter'>
          <div className='strength-bar-container'>
            <div 
              className={`strength-bar ${bucket.className}`}
              style={{ width: `${Math.min(100, (analysis.entropyBits / 120) * 100)}%` }}
            />
          </div>
          <div className='strength-label'>
            <span className={`strength-text ${bucket.className}`}>
              {bucket.label}
            </span>
            <span className='entropy-bits'>
              {analysis.entropyBits.toFixed(1)} bits entropy
            </span>
          </div>
        </div>
      )}

      {/* Analysis Details */}
      {password && (
        <section className='grid-2'>
          <div className='info-panel'>
            <h3>📊 Details</h3>
            <ul className='kv-list'>
              <li><strong>Length</strong><span>{analysis.length} characters</span></li>
              <li><strong>Character sets</strong><span>{analysis.charsets.join(', ') || 'None'}</span></li>
              <li><strong>Entropy</strong><span>{analysis.entropyBits.toFixed(2)} bits</span></li>
              <li><strong>Crack time</strong><span>{crackTime}</span></li>
            </ul>
          </div>
          <div className='info-panel'>
            <h3>🔍 Findings</h3>
            <ul className='findings-list'>
              {analysis.findings.length === 0 && !common && (
                <li className='success'>✅ No obvious risky patterns found.</li>
              )}
              {analysis.findings.map((f, i) => (
                <li key={i} className='warning'>⚠️ {f}</li>
              ))}
              {common && (
                <li className='error'>
                  🚨 Very common password{common.rank ? ` (#${common.rank})` : ''}
                </li>
              )}
            </ul>
          </div>
        </section>
      )}

      {/* Recommendations */}
      {password && analysis.recommendations.length > 0 && (
        <section className='panel'>
          <h3>💡 Recommendations</h3>
          <ul className='recommendations-list'>
            {analysis.recommendations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      {/* HIBP Check */}
      <section className='hibp-section'>
        <h3>🔐 Breach Check</h3>
        <p className='text-muted'>
          Check if this password has been exposed in known data breaches using Have I Been Pwned (HIBP).
        </p>
        <div className='actions mt-md'>
          <button 
            onClick={onCheckHIBP} 
            disabled={!password || hibpStatus === 'checking'}
            className='primary'
            title='Check password against HIBP database'
          >
            {hibpStatus === 'checking' ? (
              <>
                <span className='spinner'></span> Checking...
              </>
            ) : (
              <>🔍 Check Breaches (HIBP)</>
            )}
          </button>
        </div>
        {hibpCount !== null && (
          <div className={`hibp-result ${hibpCount > 0 ? 'breached' : 'safe'}`}>
            {hibpCount > 0
              ? `🚨 This password appears in ${hibpCount} breach${hibpCount > 1 ? 'es' : ''}. Change it immediately!`
              : '✅ Good news! This password was not found in known breaches.'}
          </div>
        )}
        {hibpStatus === 'error' && (
          <div className='hibp-result error'>
            ⚠️ Could not check HIBP. Please check your internet connection.
          </div>
        )}
      </section>
    </div>
  )
}


