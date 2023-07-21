import React, {
  AnchorHTMLAttributes,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface TabProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> {
  index: number;
  selectedIndex: number;
  onSelected: (index: number) => void;
  className?: string;
}

const Tab: FC<TabProps> = ({
  children,
  index,
  selectedIndex,
  onSelected,
  className = '',
  ...rest
}) => {
  const onClickCallback = useCallback(
    () => onSelected(index),
    [index, onSelected]
  );
  const classs = useMemo(
    () =>
      `tab tab-lifted ${className} ${
        index === selectedIndex ? 'tab-active' : ''
      }`,
    [index, selectedIndex]
  );

  return (
    <a className={classs} {...rest} onClick={onClickCallback}>
      {children}
    </a>
  );
};

interface TabsProps {
  className?: string;
  onSelected: (index: number) => void;
  initialIndex?: number;
  options: string[];
}

export const Tabs: FC<TabsProps> = ({
  options,
  className,
  onSelected,
  initialIndex,
}) => {
  const [index, setIndex] = useState(initialIndex || 0);

  useEffect(() => {
    onSelected(index);
  }, [index, onSelected]);

  return (
    <div className={`tabs ${className}`}>
      {options.map((option, idx) => (
        <Tab key={idx} index={idx} selectedIndex={index} onSelected={setIndex}>
          {option}
        </Tab>
      ))}
    </div>
  );
};
