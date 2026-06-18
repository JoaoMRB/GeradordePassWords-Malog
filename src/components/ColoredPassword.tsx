import { getCharType } from '../lib/password'

interface ColoredPasswordProps {
  password: string
  hidden: boolean
  placeholder: string
}

export function ColoredPassword({ password, hidden, placeholder }: ColoredPasswordProps) {
  if (!password) {
    return <span className="colored-password empty">{placeholder}</span>
  }

  if (hidden) {
    return (
      <span className="colored-password hidden-dots" aria-label="Password hidden">
        {Array.from({ length: Math.min(password.length, 24) }).map((_, i) => (
          <span key={i} className="char-dot" style={{ animationDelay: `${i * 30}ms` }} />
        ))}
        {password.length > 24 && <span className="char-more">+{password.length - 24}</span>}
      </span>
    )
  }

  return (
    <span className="colored-password" aria-label="Generated password">
      {password.split('').map((char, i) => (
        <span
          key={`${char}-${i}`}
          className={`char char--${getCharType(char)}`}
          style={{ animationDelay: `${i * 18}ms` }}
        >
          {char}
        </span>
      ))}
    </span>
  )
}
