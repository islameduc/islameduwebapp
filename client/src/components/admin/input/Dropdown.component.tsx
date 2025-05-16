import React, { ChangeEvent, useState } from 'react';
import styles from './dropdown.module.css';

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(options[0].value);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div className={styles.dropdownContainer}>
      <select className={styles.dropdown} value={selectedValue} onChange={handleChange}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
