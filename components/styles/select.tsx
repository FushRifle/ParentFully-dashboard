import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  KeyboardEvent,
} from 'react'
import { Text } from '@nextui-org/react'
import { Box } from './box'

interface SelectOption {
  value: string
  label: ReactNode
}

interface SelectProps {
  value?: string
  onChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  fullWidth?: boolean
  disabled?: boolean
  css?: any
  children?: ReactNode
  'aria-label'?: string
}

/* 👇 allow static Option */
interface SelectComponent extends React.FC<SelectProps> {
  Option: React.FC<{ value?: string; children?: ReactNode }>
}

export const Select: SelectComponent = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  fullWidth = false,
  disabled = false,
  css,
  children,
  'aria-label': ariaLabel = 'Select',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLabel, setSelectedLabel] =
    useState<ReactNode>(placeholder)

  const selectRef = useRef<HTMLDivElement>(null)

  /* Sync label with value */
  useEffect(() => {
    const selected = options.find(o => o.value === value)
    setSelectedLabel(selected?.label ?? placeholder)
  }, [value, options, placeholder])

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (val: string) => {
    onChange?.(val)
    setIsOpen(false)
  }

  const handleTriggerKey = (e: KeyboardEvent) => {
    if (disabled) return

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(o => !o)
    }
    if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <Box
      ref={selectRef}
      css={{
        position: 'relative',
        width: fullWidth ? '100%' : 'auto',
        userSelect: 'none',
        ...css,
      }}
    >
      {/* Trigger */}
      <Box
        role="combobox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleTriggerKey}
        onClick={() => !disabled && setIsOpen(o => !o)}
        css={{
          p: '$4 $6',
          bg: '$accents0',
          borderRadius: '$lg',
          border: '1px solid $border',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',

          '&:hover': !disabled
            ? { bg: '$accents1', borderColor: '$primary' }
            : {},

          '&:focus-visible': {
            outline: '2px solid $primary',
            outlineOffset: '2px',
          },
        }}
      >
        <Text
          size="$sm"
          css={{
            color: value ? '$text' : '$accents6',
          }}
        >
          {selectedLabel}
        </Text>

        {/* Caret */}
        <Box
          css={{
            width: 0,
            height: 0,
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: '4px solid $accents6',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </Box>

      {/* Dropdown */}
      {isOpen && (
        <Box
          role="listbox"
          css={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: '$2',
            bg: '$background',
            borderRadius: '$lg',
            border: '1px solid $border',
            boxShadow: '$lg',
            zIndex: 1000,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {options.map(option => (
            <Box
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              tabIndex={0}
              onClick={() => handleSelect(option.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSelect(option.value)
                }
              }}
              css={{
                p: '$4 $6',
                cursor: 'pointer',
                bg:
                  option.value === value
                    ? '$accents0'
                    : 'transparent',

                '&:hover': {
                  bg: '$accents0',
                },

                '&:focus-visible': {
                  outline: 'none',
                  bg: '$accents0',
                },
              }}
            >
              <Text size="$sm">{option.label}</Text>
            </Box>
          ))}
        </Box>
      )}

      {children}
    </Box>
  )
}

/* Static Option (for API parity) */
Select.Option = ({ children }) => <>{children}</>
