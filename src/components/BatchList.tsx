import { Copy, Download, History, Trash2, X } from 'lucide-react'
import type { Language } from '../types'
import { t } from '../lib/i18n'

interface BatchListProps {
  lang: Language
  passwords: string[]
  onCopy: (password: string) => void
  onCopyAll: () => void
  onDownload: () => void
  onClear: () => void
}

export function BatchList({ lang, passwords, onCopy, onCopyAll, onDownload, onClear }: BatchListProps) {
  if (passwords.length <= 1) return null

  return (
    <div className="batch-section">
      <div className="batch-header">
        <h3>
          {t(lang, 'batchResults')} ({passwords.length})
        </h3>
        <div className="batch-actions">
          <button type="button" className="btn btn-secondary-sm" onClick={onCopyAll} disabled={!passwords.length}>
            <Copy size={12} /> {t(lang, 'copyAll')}
          </button>
          <button type="button" className="btn btn-secondary-sm" onClick={onDownload} disabled={!passwords.length}>
            <Download size={12} /> {t(lang, 'download')}
          </button>
          <button type="button" className="btn btn-secondary-sm" onClick={onClear}>
            <Trash2 size={12} /> {t(lang, 'clear')}
          </button>
        </div>
      </div>
      <div className="generated-list">
        {passwords.map((pw, i) => (
          <div key={`${pw}-${i}`} className="generated-item">
            <span className="generated-password">{pw}</span>
            <button type="button" className="btn btn-secondary-sm" onClick={() => onCopy(pw)}>
              <Copy size={12} /> {t(lang, 'copy')}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

interface HistoryPanelProps {
  lang: Language
  entries: { id: string; value: string }[]
  historyEnabled: boolean
  onCopy: (value: string) => void
  onClear: () => void
  onRemove: (id: string) => void
  onHistoryEnabledChange: (enabled: boolean) => void
}

export function HistoryPanel({
  lang,
  entries,
  historyEnabled,
  onCopy,
  onClear,
  onRemove,
  onHistoryEnabledChange,
}: HistoryPanelProps) {
  return (
    <div className="history-section">
      <div className="history-header">
        <h3>{t(lang, 'history')}</h3>
        {entries.length > 0 && (
          <button type="button" className="btn btn-secondary-sm" onClick={onClear}>
            <Trash2 size={12} />
            {t(lang, 'clearHistory')}
          </button>
        )}
      </div>

      <div className="sound-toggle-wrap history-toggle-wrap">
        <span className={`sound-toggle-label ${historyEnabled ? 'sound-toggle-label--on' : ''}`}>
          <History size={15} aria-hidden="true" />
          <span className="history-toggle-text">
            <span>{historyEnabled ? t(lang, 'saveHistoryOn') : t(lang, 'saveHistoryOff')}</span>
            <span className="history-toggle-desc">{t(lang, 'saveHistoryDesc')}</span>
          </span>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={historyEnabled}
          aria-label={t(lang, 'saveHistory')}
          className={`sound-toggle ${historyEnabled ? 'sound-toggle--on' : ''}`}
          onClick={() => onHistoryEnabledChange(!historyEnabled)}
        >
          <span className="sound-toggle-track" aria-hidden="true">
            <span className="sound-toggle-thumb" />
          </span>
        </button>
      </div>

      {!historyEnabled && (
        <p className="history-disabled-hint">{t(lang, 'historyDisabledHint')}</p>
      )}

      {entries.length > 0 ? (
        <div className="history-list">
          {entries.map((entry) => (
            <div key={entry.id} className="history-item">
              <span className="history-password" title={entry.value}>
                {entry.value}
              </span>
              <div className="history-item-actions">
                <button
                  type="button"
                  className="btn btn-secondary-sm history-action-btn"
                  onClick={() => onCopy(entry.value)}
                  aria-label={t(lang, 'copy')}
                >
                  <Copy size={12} />
                </button>
                <button
                  type="button"
                  className="btn btn-secondary-sm history-action-btn history-action-btn--delete"
                  onClick={() => onRemove(entry.id)}
                  aria-label={t(lang, 'deleteEntry')}
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="history-empty">{t(lang, 'historyEmpty')}</p>
      )}
    </div>
  )
}
