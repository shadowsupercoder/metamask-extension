import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  AlignItems,
  BlockSize,
  BackgroundColor,
  BorderColor,
  BorderRadius,
  BorderStyle,
  Display,
  FlexDirection,
  FlexWrap,
  TextVariant,
} from '../../../../../helpers/constants/design-system';
import {
  Box,
  Icon,
  IconName,
  IconSize,
  Text,
} from '../../../../component-library';

export const DropdownTab = ({
  activeClassName,
  className,
  'data-testid': dataTestId,
  isActive,
  onClick,
  onChange,
  tabIndex,
  options,
  selectedOption,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const selectOption = useCallback(
    (event, option) => {
      event.stopPropagation();
      onChange(option.value);
      setIsOpen(false);
    },
    [onChange],
  );

  const openDropdown = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const onTabClick = (event) => {
    event.preventDefault();
    onClick(tabIndex);
  };

  const selectedOptionName = options.find(
    (option) => option.value === selectedOption,
  )?.name;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, isOpen]);

  return (
    <Box
      as="li"
      className={classnames('tab', className, {
        'tab--active': isActive,
        [activeClassName]: activeClassName && isActive,
      })}
      data-testid={dataTestId}
      onClick={onTabClick}
      dataTestId={dataTestId}
      flexDirection={FlexDirection.Row}
      flexWrap={FlexWrap.NoWrap}
      height={BlockSize.Full}
      style={{ cursor: 'pointer', overflow: 'hidden' }}
      title={selectedOptionName}
    >
      <Box display={Display.Flex} alignItems={AlignItems.flexStart} padding={2}>
        <Text
          variant={TextVariant.inherit}
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {selectedOptionName}
        </Text>
        <Box
          display={Display.Flex}
          alignItems={AlignItems.flexStart}
          paddingLeft={1}
          paddingRight={1}
          onClick={openDropdown}
        >
          <Icon name={IconName.ArrowDown} size={IconSize.Sm} />
        </Box>
      </Box>
      {isOpen && (
        <Box
          backgroundColor={BackgroundColor.backgroundDefault}
          borderStyle={BorderStyle.solid}
          borderColor={BorderColor.borderDefault}
          borderRadius={BorderRadius.SM}
          paddingLeft={2}
          paddingRight={2}
          display={Display.Flex}
          flexDirection={FlexDirection.Column}
          flexWrap={FlexWrap.NoWrap}
          style={{ position: 'absolute', maxWidth: '170px' }}
          ref={dropdownRef}
        >
          {options.map((option, i) => (
            <Text
              key={i}
              marginTop={1}
              marginBottom={1}
              variant={TextVariant.bodySm}
              onClick={(event) => selectOption(event, option)}
              style={{
                cursor: 'pointer',
                textTransform: 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {option.name}
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );
};

DropdownTab.propTypes = {
  activeClassName: PropTypes.string,
  className: PropTypes.string,
  'data-testid': PropTypes.string,
  isActive: PropTypes.bool, // required, but added using React.cloneElement
  options: PropTypes.arrayOf(
    PropTypes.exact({
      name: PropTypes.string,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selectedOption: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number, // required, but added using React.cloneElement
};

DropdownTab.defaultProps = {
  activeClassName: undefined,
  className: undefined,
  onChange: undefined,
  onClick: undefined,
  selectedOption: undefined,
};
