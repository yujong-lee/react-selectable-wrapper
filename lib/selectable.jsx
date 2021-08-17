import React, { useState } from 'react';

export default function Selectable(
  {
    children,
    onClick,
    mode = 'singleChoice',
  },
) {
  const initial = React.Children.map(
    children ?? [],
    (child) => !!child.props.selected,
  );

  const [selectedArray, setSelectedArray] = useState(initial);

  const [selectedIndex, setSelectedIndex] = useState(
    initial.findIndex((value) => value === true),
  );

  return React.Children.map(children, (child, i) => {
    const { selected, handleClick } = {
      checkbox: {
        selected: selectedArray[i],
        handleClick: () => {
          const nextSelctedArray = [
            ...selectedArray.slice(0, i),
            !selectedArray[i],
            ...selectedArray.slice(i + 1),
          ];

          setSelectedArray(nextSelctedArray);

          if (onClick) onClick(nextSelctedArray);
        },
      },

      singleChoice: {
        selected: selectedIndex === i,
        handleClick: () => {
          setSelectedIndex(i);

          if (onClick) onClick(i);
        },
      },
    }[mode];

    return React.cloneElement(child, {
      selected,
      onClick: handleClick,
    });
  });
}
