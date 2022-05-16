import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Input from "./Input";
import Button from "../UI/Button";
import { getFormattedDate } from "../../util/date";
import { GlobalStyles } from "../../constants/styles";

const ExpenseForm = ({
  onCancel,
  onSubmit,
  submitButtonLabel,
  defaultValues,
}) => {
  const [inputs, setInputs] = useState({
    amount: {
      value: !!defaultValues ? defaultValues.amount.toString() : "",
      isValid: true,
    },
    date: {
      value: !!defaultValues ? getFormattedDate(defaultValues.date) : "",
      isValid: true,
    },
    description: {
      value: !!defaultValues ? defaultValues.description : "",
      isValid: true,
    },
  });

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setInputs((curInputs) => {
      return {
        ...curInputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  };

  const submitHandler = () => {
    const expenseData = {
      amount: +inputs.amount.value,
      date: new Date(inputs.date.value),
      description: inputs.description.value,
    };

    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const dateIsValid = expenseData.date.toString() !== "Invalid Date";
    const descriptionIsValid = expenseData.description.trim().length > 0;
    if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
      setInputs((curInputs) => {
        return {
          amount: { value: curInputs.amount.value, isValid: amountIsValid },
          date: { value: curInputs.date.value, isValid: dateIsValid },
          description: {
            value: curInputs.description.value,
            isValid: descriptionIsValid,
          },
        };
      });
      return;
    }
    onSubmit(expenseData);
  };
  return (
    <View style={styles.form}>
      <Text style={styles.title}> Your Expense</Text>
      <View style={styles.inputsRow}>
        <Input
          style={styles.rowInput}
          label={"Amount"}
          invalid={!inputs.amount.isValid}
          textInputConfig={{
            value: inputs.amount.value,
            keyboardType: "decimal-pad",
            onChangeText: inputChangeHandler.bind(this, "amount"),
          }}
        />
        <Input
          style={styles.rowInput}
          label={"Date"}
          invalid={!inputs.date.isValid}
          textInputConfig={{
            value: inputs.date.value,
            placeholder: "YYYY-MM-DD",
            maxLength: 10,
            onChangeText: inputChangeHandler.bind(this, "date"),
          }}
        />
      </View>
      <Input
        invalid={!inputs.description.isValid}
        label={"Description"}
        textInputConfig={{
          value: inputs.description.value,
          multiline: true,
          onChangeText: inputChangeHandler.bind(this, "description"),
        }}
      />
      <View style={styles.buttons}>
        <Button style={styles.button} onPress={onCancel} mode="flat">
          Cancel
        </Button>
        <Button style={styles.button} onPress={submitHandler}>
          {submitButtonLabel}
        </Button>
      </View>
    </View>
  );
};

export default ExpenseForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginVertical: 24,
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowInput: {
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error500,
    margin: 8,
  },
});
