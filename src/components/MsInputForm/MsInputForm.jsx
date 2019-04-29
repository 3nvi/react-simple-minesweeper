/** @jsx jsx */
import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { jsx } from '@emotion/core';
import { Formik, Field, Form, ErrorMessage } from 'formik';

const InputFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Heading = styled.h1`
  font-weight: 300;
  color: #666;
  margin-bottom: 40px;
`;

const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Input = styled(({ form, field, ...rest }) => <input {...field} {...rest} />)`
  padding: 0 10px;
  border-radius: 4px;
  border: 1px solid #e1e1e1;
  width: 100%;
  height: 36px;
  outline: 0;
  font-size: inherit;
  color: #666;

  &:focus {
    border-color: #aaa;
    box-shadow: 0 0 3px 1px rgb(228, 226, 226);
  }
`;

const Label = styled.label`
  font-size: 11px;
  color: #888;
  margin-bottom: 5px;
`;

const SubmitButton = styled.button`
  transition: background-color 0.1s ease-in-out;
  width: 100%;
  height: 36px;
  background-color: #555;
  color: white;
  text-align: center;
  border-radius: 4px;

  &[disabled] {
    opacity: 0.4;
    pointer-events: none;
  }

  &:hover {
    background-color: #333;
  }

  &:active {
    background-color: #111;
  }
`;

const InputError = styled.div`
  color: darkred;
  font-size: 11px;
  margin-top: 5px;
`;

/**
 * The Form that you see when you initially log into the app
 */
function MsInputForm({ createGame }) {
  // we wrap the initialValues in a `useMemo` to benefit from a PureComponent
  // implementation within Formik. Apart from the perf optimization, there is
  // no other reason why we didn't inline them
  const initialValues = useMemo(
    () => ({
      rowCount: '',
      columnCount: '',
      mineCount: '',
    }),
    []
  );

  // again, we wrap validation inside `useCallback` as a performance optimization
  const handleValidation = useCallback(values => {
    let errors = {};

    if (values.rowCount <= 0) {
      errors.rowCount = 'Need to have at least 1 row';
    }

    if (values.columnCount <= 0) {
      errors.columnCount = 'Need to be at least 1 column';
    }

    if (values.mineCount <= 0) {
      errors.mineCount = 'Need to have at least 1 mine in the game';
    } else if (values.mineCount >= values.rowCount * values.columnCount) {
      errors.mineCount = 'Mines need to be less than the total number of cells';
    }

    return errors;
  }, []);

  return (
    <InputFormContainer>
      <Heading>Let's play Minesweeper!</Heading>
      <Formik initialValues={initialValues} onSubmit={createGame} validate={handleValidation}>
        {({ isSubmitting, isValid }) => (
          <Form
            css={{
              width: '260px', // this will be translated into a className
            }}
          >
            <FormControl>
              <Label htmlFor="rowCount">Number of rows:</Label>
              <Field component={Input} type="number" name="rowCount" id="rowCount" />
              <ErrorMessage component={InputError} name="rowCount" />
            </FormControl>
            <FormControl>
              <Label htmlFor="columnCount">Number of columns:</Label>
              <Field component={Input} type="number" name="columnCount" id="columnCount" />
              <ErrorMessage component={InputError} name="columnCount" />
            </FormControl>
            <FormControl>
              <Label htmlFor="mineCount">Number of mines</Label>
              <Field component={Input} type="number" name="mineCount" id="mineCount" />
              <ErrorMessage component={InputError} name="mineCount" />
            </FormControl>
            <SubmitButton type="submit" disabled={isSubmitting || !isValid}>
              Play
            </SubmitButton>
          </Form>
        )}
      </Formik>
    </InputFormContainer>
  );
}

MsInputForm.reduxProps = {
  createGame: PropTypes.func.isRequired,
};

MsInputForm.propTypes = {
  ...MsInputForm.reduxProps,
};

MsInputForm.defaultProps = {};

export default MsInputForm;
