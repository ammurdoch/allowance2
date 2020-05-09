import {
  Icon,
  Layout,
  Select,
  SelectItem,
  IndexPath,
} from '@ui-kitten/components';
import { FormikProps, FormikValues } from 'formik';
import React, {
  FunctionComponent,
  ReactElement,
  useCallback,
  useMemo,
} from 'react';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 8,
  },
});

export interface TextControlProps {
  name: string;
  label?: string;
  inputProps: any;
  icon?: any;
  iconPack?: string;
  formikProps: FormikProps<FormikValues>;
  onChange?: (value: any) => void;
  caption?: string;
  placeholder?: string;
  options: {
    value: string;
    label: string;
  }[];
}

const AlertIcon = (iconProps: any): ReactElement => (
  <Icon {...iconProps} name="alert-circle-outline" />
);

const FormikSelectControl: FunctionComponent<TextControlProps> = (
  props: TextControlProps,
) => {
  const {
    name,
    label,
    caption,
    placeholder,
    icon,
    iconPack,
    inputProps,
    formikProps,
    onChange,
    options,
  } = props;
  const { setFieldValue, values, errors, touched } = formikProps;
  const myError = errors && errors[name];
  const myTouched = touched && touched[name];

  const [selectedIndex, setSelectedIndex] = React.useState<any>();

  const myHandleChange = useCallback(
    (index: any) => {
      setFieldValue(name, options[index.row].value);
      setSelectedIndex(index);
      if (onChange) onChange(options[index]);
    },
    [setFieldValue, name, options, onChange],
  );

  React.useEffect(() => {
    if (selectedIndex === undefined) {
      const row = options.findIndex(o => o.value === values[name]);
      if (row >= 0) {
        setSelectedIndex(new IndexPath(row));
      }
    }
  }, [name, options, selectedIndex, values]);

  const displayValue = (): string | undefined => {
    if (selectedIndex) {
      const option = options[selectedIndex.row];
      if (option) {
        return option.label;
      }
    }
    return undefined;
  };

  let renderIcon;
  if (icon) {
    renderIcon = (iconProps: any): ReactElement => (
      <Icon {...iconProps} name={icon} pack={iconPack || 'eva'} />
    );
  }

  const [myStatus, myCaption, myCaptionIcon] = useMemo(() => {
    if (myError && myTouched) {
      return ['danger', myError, AlertIcon];
    }
    return ['basic', caption, undefined];
  }, [myError, caption, myTouched]);

  return (
    <Layout style={styles.container} level="1">
      <Select
        label={label}
        selectedIndex={selectedIndex}
        onSelect={myHandleChange}
        placeholder={placeholder}
        status={myStatus}
        caption={myCaption}
        captionIcon={myCaptionIcon}
        accessoryLeft={renderIcon}
        value={displayValue()}
        {...inputProps}
      >
        {options.map((option, index) => (
          <SelectItem key={index} title={option.label} />
        ))}
      </Select>
    </Layout>
  );
};

export default FormikSelectControl;
