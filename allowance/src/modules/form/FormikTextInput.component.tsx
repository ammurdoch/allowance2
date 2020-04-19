import { Icon, Input } from '@ui-kitten/components';
import { FormikProps, FormikValues } from 'formik';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

export interface TextControlProps {
  name: string;
  label?: string;
  inputProps: any;
  icon?: any;
  formikProps: FormikProps<FormikValues>;
  onChange?: (value: any) => void;
  caption?: string;
  placeholder?: string;
}

const AlertIcon = (iconProps: any) => (
  <Icon {...iconProps} name="alert-circle-outline" />
);

const FormikTextControl: FunctionComponent<TextControlProps> = (
  props: TextControlProps,
) => {
  const {
    name,
    label,
    caption,
    placeholder,
    icon,
    inputProps,
    formikProps,
    onChange,
  } = props;
  const {
    setFieldValue,
    setFieldTouched,
    values,
    errors,
    touched,
    submitForm,
  } = formikProps;
  const myError = errors && errors[name];
  const myTouched = touched && touched[name];
  const myHandleChange = useCallback(
    (nextValue: any) => {
      setFieldValue(name, nextValue);
      if (onChange) onChange(nextValue);
    },
    [setFieldValue, name, onChange],
  );

  const myHandleBlur = useCallback(() => {
    setFieldTouched(name, true);
  }, [setFieldTouched, name]);
  let renderIcon;
  if (icon) {
    renderIcon = (iconProps: any) => <Icon {...iconProps} name={icon} />;
  }

  const [myStatus, myCaption, myCaptionIcon] = useMemo(() => {
    if (myError && myTouched) {
      return ['danger', myError, AlertIcon];
    }
    return ['basic', caption, undefined];
  }, [myError, caption, myTouched]);

  return (
    <View style={styles.container}>
      <Input
        value={values[name]}
        label={label}
        placeholder={placeholder}
        status={myStatus}
        caption={myCaption}
        captionIcon={myCaptionIcon}
        accessoryLeft={renderIcon}
        onChangeText={myHandleChange}
        onBlur={myHandleBlur}
        onSubmitEditing={() => submitForm()}
        {...inputProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 8,
  },
});

export default FormikTextControl;
