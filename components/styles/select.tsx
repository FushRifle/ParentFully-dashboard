import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  KeyboardEvent,
  useMemo,
  useId,
  useCallback,
} from 'react';
import { Text } from '@nextui-org/react';
import { Box } from './box';

interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

interface SelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  css?: any;
  'aria-label'?: string;
}

interface SelectComponent extends React.FC<SelectProps> { }

export const Select: SelectComponent = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  fullWidth = false,
  disabled = false,
  css,
  'aria-label': ariaLabel = 'Select',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;

  const typeaheadRef = useRef<{ buffer: string; timer: ReturnType<typeof setTimeout> | null }>({
    buffer: '',
    timer: null,
  });

  const selectedIndex = useMemo(
    () => options.findIndex((o) => o.value === value),
    [value, options],
  );

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? placeholder,
    [value, options, placeholder],
  );

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // When opening, highlight the currently selected option (or first enabled)
  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
      return;
    }
    if (selectedIndex >= 0 && !options[selectedIndex]?.disabled) {
      setHighlightedIndex(selectedIndex);
    } else {
      const first = options.findIndex((o) => !o.disabled);
      setHighlightedIndex(first);
    }
  }, [isOpen, selectedIndex, options]);

  // Keep the highlighted option scrolled into view
  useEffect(() => {
    if (!isOpen || highlightedIndex < 0 || !listRef.current) return;
    const node = listRef.current.querySelector<HTMLElement>(
      `[data-index="${highlightedIndex}"]`,
    );
    node?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex, isOpen]);

  const moveHighlight = useCallback(
    (direction: 1 | -1) => {
      setHighlightedIndex((prev) => {
        if (!options.length) return -1;
        let next = prev;
        for (let i = 0; i < options.length; i++) {
          next = (next + direction + options.length) % options.length;
          if (!options[next]?.disabled) return next;
        }
        return prev;
      });
    },
    [options],
  );

  const handleSelect = useCallback(
    (index: number) => {
      const option = options[index];
      if (disabled || !option || option.disabled) return;
      onChange?.(option.value);
      setIsOpen(false);
    },
    [disabled, onChange, options],
  );

  const handleTypeahead = useCallback(
    (key: string) => {
      const t = typeaheadRef.current;
      if (t.timer) clearTimeout(t.timer);
      t.buffer += key.toLowerCase();
      t.timer = setTimeout(() => {
        t.buffer = '';
      }, 500);

      const match = options.findIndex(
        (o) =>
          !o.disabled &&
          typeof o.label === 'string' &&
          o.label.toLowerCase().startsWith(t.buffer),
      );
      if (match >= 0) setHighlightedIndex(match);
    },
    [options],
  );

  const handleTriggerKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleSelect(highlightedIndex);
        } else {
          setIsOpen((prev) => !prev);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        else moveHighlight(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) setIsOpen(true);
        else moveHighlight(-1);
        break;
      case 'Home':
        if (!isOpen) return;
        e.preventDefault();
        setHighlightedIndex(options.findIndex((o) => !o.disabled));
        break;
      case 'End':
        if (!isOpen) return;
        e.preventDefault();
        for (let i = options.length - 1; i >= 0; i--) {
          if (!options[i]?.disabled) {
            setHighlightedIndex(i);
            break;
          }
        }
        break;
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          handleTypeahead(e.key);
        }
    }
  };

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
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        aria-activedescendant={
          isOpen && highlightedIndex >= 0
            ? `${baseId}-option-${highlightedIndex}`
            : undefined
        }
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleTriggerKey}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        css={{
          py: '$3',
          pl: '$4',
          pr: '$6',
          bg: isOpen ? '$accents1' : '$accents0',
          borderRadius: '$lg',
          border: '1px solid',
          borderColor: isOpen ? '$primary' : '$border',
          boxShadow: isOpen ? '0 0 0 3px $primaryLight' : 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          display: 'flex',
          alignItems: 'center',
          gap: '$2',
          minHeight: '40px',
          transition:
            'background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',

          '&:hover': !disabled
            ? { bg: '$accents1', borderColor: '$primary' }
            : {},
          '&:focus-visible': {
            outline: 'none',
            borderColor: '$primary',
            boxShadow: '0 0 0 3px $primaryLight',
          },
        }}
      >
        <Text
          size="$sm"
          css={{
            color: value ? '$text' : '$accents6',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            minWidth: 0,
            lineHeight: 1.2,
          }}
        >
          {selectedLabel}
        </Text>

        {/* Caret */}
        <Box
          aria-hidden="true"
          css={{
            flexShrink: 0,
            width: '14px',
            height: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: '$accents7',
            mr: '$2',

            '&::before': {
              content: '""',
              display: 'block',
              width: '6px',
              height: '6px',
              borderRight: '1.5px solid currentColor',
              borderBottom: '1.5px solid currentColor',
              transform: 'translateY(-2px) rotate(45deg)',
              borderRadius: '1px',
            },
          }}
        />
      </Box>

      {/* Dropdown */}
      {isOpen && (
        <Box
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          css={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: '$2',
            bg: '$background',
            borderRadius: '$lg',
            border: '1px solid $border',
            boxShadow:
              '0 10px 30px -10px rgba(0,0,0,0.25), 0 4px 12px -4px rgba(0,0,0,0.12)',
            zIndex: 1000,
            maxHeight: 240,
            overflowY: 'auto',
            p: '$2',
            animation: 'selectFadeIn 0.14s ease-out',

            '@keyframes selectFadeIn': {
              from: { opacity: 0, transform: 'translateY(-4px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          {options.length === 0 && (
            <Box css={{ p: '$4 $6' }}>
              <Text size="$sm" css={{ color: '$accents6' }}>
                No options
              </Text>
            </Box>
          )}

          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;
            return (
              <Box
                key={option.value}
                id={`${baseId}-option-${index}`}
                data-index={index}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                tabIndex={-1}
                onMouseEnter={() =>
                  !option.disabled && setHighlightedIndex(index)
                }
                onClick={() => handleSelect(index)}
                css={{
                  p: '$4 $6',
                  borderRadius: '$md',
                  cursor: option.disabled ? 'not-allowed' : 'pointer',
                  opacity: option.disabled ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '$4',
                  bg: isSelected
                    ? '$primaryLight'
                    : isHighlighted
                      ? '$accents1'
                      : 'transparent',
                  color: isSelected ? '$primary' : '$text',
                  fontWeight: isSelected ? '$semibold' : '$normal',
                  transition: 'background 0.12s ease, color 0.12s ease',
                }}
              >
                <Text
                  size="$sm"
                  css={{
                    color: 'inherit',
                    fontWeight: 'inherit',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {option.label}
                </Text>

                {isSelected && (
                  <Box
                    aria-hidden="true"
                    css={{
                      flexShrink: 0,
                      width: '6px',
                      height: '10px',
                      borderRight: '2px solid $primary',
                      borderBottom: '2px solid $primary',
                      transform: 'rotate(45deg) translateY(-2px)',
                      borderRadius: '1px',
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
