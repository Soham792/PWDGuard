import { useState } from 'react'

// Placeholder UI; storage will be wired with encryption later
export function PasswordHistory() {
  const [items] = useState<{ value: string; createdAt: string; entropyBits: number; note?: string; strength?: string }[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showPassword, setShowPassword] = useState<Record<number, boolean>>({})

  const togglePasswordVisibility = (index: number) => {
    setShowPassword(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const maskPassword = (password: string) => {
    return '•'.repeat(password.length)
  }

  const filteredItems = items.filter(item => 
    item.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.value.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* Search Bar */}
      <div className='search-bar'>
        <span className='search-icon'>🔍</span>
        <input
          type='text'
          placeholder='Search password history...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label='Search passwords'
        />
      </div>

      {/* Filter Options */}
      <div className='panel'>
        <div className='flex justify-between items-center'>
          <h3>📊 Filters</h3>
          <div className='actions'>
            <button className='ghost' disabled>🗂️ All</button>
            <button className='ghost' disabled>💪 Strong</button>
            <button className='ghost' disabled>⚠️ Weak</button>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className='history-container'>
        {filteredItems.length === 0 ? (
          <div className='empty-state'>
            <div className='empty-state-icon'>🔐</div>
            <h3>No Password History Yet</h3>
            <p className='empty-state-text'>
              {searchQuery 
                ? 'No passwords match your search criteria.'
                : 'Your password history will appear here once you analyze or generate passwords.'}
            </p>
            <p className='text-muted' style={{marginTop: '1rem', fontSize: '0.875rem'}}>
              Enable history tracking in Settings to start recording your password activity.
            </p>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div key={index} className='history-card'>
              <div className='history-card-header'>
                <div className='flex items-center gap-md' style={{flex: 1}}>
                  <code className='history-card-password'>
                    {showPassword[index] ? item.value : maskPassword(item.value)}
                  </code>
                  <button 
                    className='ghost'
                    onClick={() => togglePasswordVisibility(index)}
                    title={showPassword[index] ? 'Hide password' : 'Show password'}
                  >
                    {showPassword[index] ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className='actions'>
                  <button className='ghost' onClick={() => navigator.clipboard?.writeText(item.value)} title='Copy password'>
                    📋 Copy
                  </button>
                </div>
              </div>
              <div className='history-card-meta'>
                <span>
                  <span className={`strength-badge ${item.strength || 'good'}`}>
                    {item.strength?.toUpperCase() || 'GOOD'}
                  </span>
                </span>
                <span>🔢 {item.entropyBits.toFixed(1)} bits</span>
                <span>📅 {item.createdAt}</span>
                {item.note && <span>📝 {item.note}</span>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Buttons */}
      {items.length > 0 && (
        <div className='panel mt-lg'>
          <div className='actions'>
            <button className='ghost'>📤 Export History</button>
            <button className='danger'>🗑️ Clear All History</button>
          </div>
        </div>
      )}
    </div>
  )
}


