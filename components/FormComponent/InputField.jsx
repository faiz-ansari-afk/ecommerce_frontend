import React, { useEffect } from 'react';

const InputField = React.forwardRef(
  (
    {
      type,
      name,
      children,
      error,
      onchange,
      classes = 'border',
      value,
      ...rest
    },
    ref
  ) => {
    const [active, setActive] = React.useState(false);

    function handleActivation(e) {
      setActive(!!e.target.value);
    }
    useEffect(() => {
      handleActivation({ target: { value } });
    }, []);
    return (
      <div>
        <div className="relative  rounded  border-opacity-25">
          <input
            className={[
              'outline-none w-full rounded  text-sm transition-all duration-200 ease-in-out p-2 py-3',
              `${classes}`,
              active ? 'pt-6' : '',
            ].join(' ')}
            id={name}
            name={name}
            type={type}
            onChange={(e) => {
              handleActivation(e);
              if (onchange) {
                onchange(e);
              }
            }}
            value={value}
            ref={ref}
            {...rest}
          />
          <label
            className={[
              'absolute top-0 left-0 flex items-center text-opacity-50 p-2 px-3 transition-all duration-200 ease-in-out',
              active ? 'text-xs' : 'text-sm',
            ].join(' ')}
            htmlFor={name}
          >
            {children}
          </label>
        </div>
        {error && (
          <div className="text-rose-600 py-1 text-sm px-2">{error}</div>
        )}
      </div>
    );
  }
);
export default InputField;
