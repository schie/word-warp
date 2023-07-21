import { FC, useCallback } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onDarkModeSettingChange: (isDarkMode: boolean) => void;
}

export const DarkModeToggle: FC<DarkModeToggleProps> = ({
  isDarkMode,
  onDarkModeSettingChange,
}) => {
  const handleToggle = useCallback(() => {
    const toggled = !isDarkMode;
    onDarkModeSettingChange(toggled);
  }, [isDarkMode, onDarkModeSettingChange]);

  return (
    <div className="flex items-center">
      <FaSun className="text-yellow-500" />
      <label className="mx-2">
        <div
          onClick={handleToggle}
          className={`w-12 h-6 bg-gray-300 rounded-full p-1 cursor-pointer transform duration-300 ease-in-out ${
            isDarkMode ? 'bg-gray-700' : ''
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
              isDarkMode ? 'translate-x-6' : ''
            }`}
          />
        </div>
      </label>
      <FaMoon className={`text-gray-700`} />
    </div>
  );
};
