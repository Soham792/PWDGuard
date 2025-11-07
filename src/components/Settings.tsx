import { useState } from 'react'

export function Settings() {
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('dark')
  const [autoClear, setAutoClear] = useState(20)
  const [masterPassword, setMasterPassword] = useState('')
  const [enableHistory, setEnableHistory] = useState(false)
  const [autoCheck, setAutoCheck] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown')

  const testConnection = () => {
    setConnectionStatus('connected')
    setTimeout(() => {
      // Simulate connection test
      alert('Connection test successful!')
    }, 500)
  }

  return (
    <div className='settings'>
      {/* Appearance Settings */}
      <div className='panel settings-section'>
        <h3>🎨 Appearance</h3>
        <div className='settings-row'>
          <div className='settings-label'>
            <span className='settings-label-main'>Theme</span>
            <span className='settings-label-sub'>Choose your preferred color theme</span>
          </div>
          <div className='segmented'>
            <button className={theme === 'system' ? 'active' : ''} onClick={() => setTheme('system')}>💻 System</button>
            <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>☀️ Light</button>
            <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>🌙 Dark</button>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className='panel settings-section'>
        <h3>🔒 Security</h3>
        <div className='settings-row'>
          <div className='settings-label'>
            <span className='settings-label-main'>Master Password</span>
            <span className='settings-label-sub'>Set a master password to encrypt your data</span>
          </div>
          <div style={{flex: 1, maxWidth: '300px'}}>
            <input
              type='password'
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              placeholder='Enter master password...'
              aria-label='Master password'
            />
          </div>
        </div>
        <div className='settings-row'>
          <div className='settings-label'>
            <span className='settings-label-main'>Auto-Check HIBP</span>
            <span className='settings-label-sub'>Automatically check passwords against breach database</span>
          </div>
          <label style={{marginBottom: 0}}>
            <input
              type='checkbox'
              checked={autoCheck}
              onChange={(e) => setAutoCheck(e.target.checked)}
            />
            <span>Enable</span>
          </label>
        </div>
      </div>

      {/* Clipboard Settings */}
      <div className='panel settings-section'>
        <h3>📋 Clipboard</h3>
        <div className='settings-row' style={{display: 'block'}}>
          <div className='settings-label' style={{marginBottom: '1rem'}}>
            <span className='settings-label-main'>Auto-Clear Clipboard</span>
            <span className='settings-label-sub'>Automatically clear copied passwords after specified time</span>
          </div>
          <div className='slider-container'>
            <div className='slider-label'>
              <span>Clear After</span>
              <span className='slider-value'>{autoClear}s</span>
            </div>
            <input 
              type='range' 
              min={0} 
              max={120} 
              value={autoClear} 
              onChange={(e) => setAutoClear(Number(e.target.value))}
              aria-label='Auto-clear clipboard timer'
            />
            <div className='flex justify-between text-muted' style={{fontSize: '0.75rem', marginTop: '-0.5rem'}}>
              <span>Off</span>
              <span>2 minutes</span>
            </div>
          </div>
          <p className='text-muted' style={{marginTop: '0.5rem', fontSize: '0.875rem'}}>
            {autoClear === 0 ? 'Clipboard auto-clear is disabled.' : `Clipboard will be cleared ${autoClear} seconds after copying.`}
          </p>
        </div>
      </div>

      {/* History Settings */}
      <div className='panel settings-section'>
        <h3>📜 Password History</h3>
        <div className='settings-row'>
          <div className='settings-label'>
            <span className='settings-label-main'>Enable History</span>
            <span className='settings-label-sub'>Track analyzed and generated passwords</span>
          </div>
          <label style={{marginBottom: 0}}>
            <input
              type='checkbox'
              checked={enableHistory}
              onChange={(e) => setEnableHistory(e.target.checked)}
            />
            <span>Enable</span>
          </label>
        </div>
        <p className='text-muted' style={{marginTop: '0.75rem', fontSize: '0.875rem'}}>
          When enabled, your password activity will be stored locally with encryption.
        </p>
      </div>

      {/* Database Settings */}
      <div className='panel settings-section'>
        <h3>🗄️ Databases</h3>
        <div className='info-panel'>
          <p><strong>Common Passwords Database</strong></p>
          <p className='text-muted' style={{fontSize: '0.875rem', marginTop: '0.5rem'}}>
            Top 10,000 common passwords are bundled for offline checking.
          </p>
          <div className='settings-row' style={{marginTop: '1rem'}}>
            <span className='text-muted'>Last Updated:</span>
            <span><strong>Built-in</strong></span>
          </div>
        </div>
      </div>

      {/* Browser Extension Integration */}
      <div className='panel settings-section'>
        <h3>🌐 Browser Extension</h3>
        <div className='settings-row'>
          <div className='settings-label'>
            <span className='settings-label-main'>Connection Status</span>
            <span className='settings-label-sub'>Test connection with browser extension</span>
          </div>
          <div className='flex items-center gap-md'>
            <span className={`status-indicator ${connectionStatus}`}>
              {connectionStatus === 'unknown' ? 'Not Tested' : 
               connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
            <button onClick={testConnection} className='ghost'>
              🔌 Test Connection
            </button>
          </div>
        </div>
      </div>

      {/* Default Generation Settings */}
      <div className='panel settings-section'>
        <h3>⚙️ Default Password Settings</h3>
        <div className='info-panel'>
          <p><strong>Default Generation Options</strong></p>
          <ul className='kv-list' style={{marginTop: '1rem'}}>
            <li><strong>Length</strong><span>16 characters</span></li>
            <li><strong>Character Types</strong><span>All enabled</span></li>
            <li><strong>Exclude Ambiguous</strong><span>Yes</span></li>
          </ul>
        </div>
      </div>

      {/* About Section */}
      <div className='panel settings-section'>
        <h3>ℹ️ About PwdGuard</h3>
        <div className='info-panel'>
          <div className='settings-row'>
            <span><strong>Version</strong></span>
            <span>2.2.0</span>
          </div>
          <div className='settings-row'>
            <span><strong>License</strong></span>
            <span>MIT</span>
          </div>
          <div style={{marginTop: '1rem'}}>
            <p className='text-muted' style={{fontSize: '0.875rem', lineHeight: 1.6}}>
              PwdGuard is a modern password manager built with security and usability in mind. 
              Analyze password strength, generate secure passwords, and check for breaches.
            </p>
          </div>
          <div className='actions' style={{marginTop: '1rem'}}>
            <button className='ghost'>📚 Documentation</button>
            <button className='ghost'>🐛 Report Issue</button>
            <button className='ghost'>⭐ Star on GitHub</button>
          </div>
        </div>
      </div>
    </div>
  )
}


