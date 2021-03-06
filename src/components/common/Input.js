// input component for input type text, number or date

import React from 'react';
import PropTypes from 'prop-types';

const Input = props => {
  const {
    title,
    name,
    type,
    value,
    onChange,
    placeholder,
    required,
    min,
    max
  } = props;
  return (
    <div className="form-input">
      <div className="input-label">
        <label className={required ? 'required' : null}>{title}</label>
      </div>
      <div className="div-input">
        <label>
          <input
            name={name}
            type={type}
            value={value}
            aria-label={placeholder}
            onChange={onChange}
            required={required}
            min={min}
            max={max}
          />
        </label>
      </div>
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'number', 'date']).isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default Input;
