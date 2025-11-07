import { useEffect, useMemo, useState } from 'react'
import { generatePassword, GenerateOptions, generatePassphrases } from '../lib/generator'
import { analyzePassword, strengthLabelFromEntropy } from '../lib/analysis'

export function GeneratePassword() {
  const [method, setMethod] = useState<'random' | 'passphrase'>('random')
  const [count, setCount] = useState(5)
  const [options, setOptions] = useState<GenerateOptions>({
    length: 16,
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: true,
    excludeSimilar: false,
    customChars: '',
  })

  const [generated, setGenerated] = useState<string[]>([])

  const regenerate = () => {
    if (method === 'random') {
      setGenerated(Array.from({ length: Math.min(10, Math.max(1, count)) }, () => generatePassword(options)))
    } else {
      setGenerated(generatePassphrases({ count, words: 4, separator: '-' }))
    }
  }

  useEffect(() => {
    regenerate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method])

  return (
    <div>
      <div className='generation-controls'>
        <div className='panel'>
          <h3>🎲 Generation Method</h3>
          <div className='segmented'>
            <button className={method === 'random' ? 'active' : ''} onClick={() => setMethod('random')}>🔢 Random Password</button>
            <button className={method === 'passphrase' ? 'active' : ''} onClick={() => setMethod('passphrase')}>📝 Passphrase</button>
          </div>
        </div>

        {method === 'random' && (
          <div className='panel'>
            <h3>⚙️ Password Options</h3>
            <div className='slider-container'>
              <div className='slider-label'>
                <span>Password Length</span>
                <span className='slider-value'>{options.length}</span>
              </div>
              <input type='range' min={8} max={128} value={options.length}
                onChange={(e) => setOptions({ ...options, length: Number(e.target.value) })}
                aria-label='Password length' />
              <div className='flex justify-between text-muted' style={{fontSize: '0.75rem', marginTop: '-0.5rem'}}>
                <span>8</span>
                <span>128</span>
              </div>
            </div>
            <div className='checkbox-grid'>
              <label>
                <input type='checkbox' checked={options.lowercase} onChange={e => setOptions({ ...options, lowercase: e.target.checked })} />
                <span>🔤 Lowercase (a-z)</span>
              </label>
              <label>
                <input type='checkbox' checked={options.uppercase} onChange={e => setOptions({ ...options, uppercase: e.target.checked })} />
                <span>🔠 Uppercase (A-Z)</span>
              </label>
              <label>
                <input type='checkbox' checked={options.numbers} onChange={e => setOptions({ ...options, numbers: e.target.checked })} />
                <span>🔢 Numbers (0-9)</span>
              </label>
              <label>
                <input type='checkbox' checked={options.symbols} onChange={e => setOptions({ ...options, symbols: e.target.checked })} />
                <span>🔣 Symbols (!@#$)</span>
              </label>
              <label>
                <input type='checkbox' checked={options.excludeAmbiguous} onChange={e => setOptions({ ...options, excludeAmbiguous: e.target.checked })} />
                <span>❌ Exclude Ambiguous</span>
              </label>
              <label>
                <input type='checkbox' checked={options.excludeSimilar} onChange={e => setOptions({ ...options, excludeSimilar: e.target.checked })} />
                <span>❌ Exclude Similar</span>
              </label>
            </div>
            <div className='mt-lg'>
              <label className='field-label'>Custom Characters (Optional)</label>
              <input type='text' value={options.customChars}
                onChange={(e) => setOptions({ ...options, customChars: e.target.value })} 
                placeholder='Add custom characters here...' />
            </div>
          </div>
        )}

        {method === 'passphrase' && (
          <div className='panel'>
            <h3>📚 Passphrase Settings</h3>
            <p className='text-muted'>Generates memorable passphrases using the EFF short word list (4 words) separated by hyphens.</p>
            <div className='info-panel mt-md'>
              <p><strong>Example:</strong> <code>correct-horse-battery-staple</code></p>
              <p className='text-muted' style={{fontSize: '0.875rem', marginTop: '0.5rem'}}>Passphrases are easier to remember and type while maintaining strong security.</p>
            </div>
          </div>
        )}

        <div className='panel'>
          <div className='slider-container'>
            <div className='slider-label'>
              <span>Number of Passwords</span>
              <span className='slider-value'>{count}</span>
            </div>
            <input type='range' min={1} max={10} value={count} 
              onChange={(e) => setCount(Number(e.target.value))}
              aria-label='Number of passwords to generate' />
            <div className='flex justify-between text-muted' style={{fontSize: '0.75rem', marginTop: '-0.5rem'}}>
              <span>1</span>
              <span>10</span>
            </div>
          </div>
          <div className='actions mt-lg'>
            <button onClick={regenerate} className='primary' title='Generate passwords (Ctrl/Cmd + G)'>
              ⚡ Generate Passwords
            </button>
          </div>
        </div>
      </div>

      {generated.length > 0 && (
        <div className='panel'>
          <h3>✨ Generated Passwords</h3>
          <div className='generated-list'>
            {generated.map((p, i) => {
              const a = analyzePassword(p)
              const s = strengthLabelFromEntropy(a.entropyBits)
              return (
                <div key={i} className='generated-item'>
                  <code>{p}</code>
                  <div className='meta'>
                    <span className={`strength-badge ${s.className}`}>{s.label}</span>
                    <span>{a.entropyBits.toFixed(1)} bits</span>
                  </div>
                  <button onClick={() => navigator.clipboard?.writeText(p)} className='ghost' title='Copy to clipboard'>
                    📋 Copy
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}


