import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ViewPropTypes,
  Image,
} from "react-native";
import Icons from "./Icons";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const s = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  inputContainer: {

  },
  inputLabel: {
    fontWeight: "bold",
  },
  input: {
    height: 40,
  },
  icon: {
    width: 42,
    height: 30,
    resizeMode: "contain",
  },
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    placeholders: PropTypes.object,

    labelStyle: Text.propTypes.style,
    inputStyle: Text.propTypes.style,
    inputContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardLabel: PropTypes.string,
    nameLabel: PropTypes.string,
    regionLabel: PropTypes.string,

    requireName: PropTypes.bool,
    requiresPostalCode: PropTypes.bool,
    requiresCVC: PropTypes.bool,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    placeholders: {
      name: "Full Name",
      number: "1234 5678 9123 4567",
      expiry: "MM/YY",
      cvc: "CVC",
      postalCode: "10001",
    },
    inputContainerStyle: {
      borderColor: "white",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    cardLabel: "Card information",
    nameLabel: "Name on card",
    regionLabel: "Country or region",
    requireName: false,
    requiresPostalCode: false,
    additionalInputsProps: {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = newProps => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focus = field => {
    if (!field) return;
    this.refs[field].focus();
  }

  _inputProps = field => {
    const {
      inputStyle, validColor, invalidColor, placeholderColor,
      placeholders, values, status,
      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputProps: additionalInputsProps[field],
    };
  };

  _cardIconToShow = () => {
    const { values: { type } } = this.props;
    if (type) return type;
    return "placeholder";
  }

  _cvcIconToShow = () => {
    const { values: { type } } = this.props;
    if (type === "american-express") return "cvc_amex";
    if (type) return "cvc";
    return "placeholder";
  }

  render() {
    const {
      inputContainerStyle, labelStyle, cardLabel, nameLabel, regionLabel, requiresName, requiresPostalCode, requiresCVC,
    } = this.props;

    return (
      <View style={s.container}>
        <View
          style={{
            width: "100%",
            marginBottom: 8,
          }}>
          <Text style={labelStyle}>
            {cardLabel}
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "white",
              borderRadius: 5,
            }}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                borderBottomWidth: 1,
                borderColor: "white",
                alignItems: "center",
              }}>
              <View style={{ flex: 1 }}>
                <CCInput {...this._inputProps("number")}
                  onSubmitEditing={() => this._focus("expiry")}
                  keyboardType="numeric"
                  containerStyle={[s.inputContainer, inputContainerStyle]} />
              </View>
              <Image style={s.icon} source={Icons[this._cardIconToShow()]} />
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
              }}>
              <View style={{ flex: 1 }}>
                <CCInput {...this._inputProps("expiry")}
                  onSubmitEditing={ () => this._focus("cvc") }
                  keyboardType="numeric"
                  containerStyle={[s.inputContainer, inputContainerStyle, { borderRightWidth: 1 }]} />
              </View>
              { requiresCVC &&
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}>
              <View style={{ flex: 1 }}>
                <CCInput {...this._inputProps("cvc")}
                  onSubmitEditing={ () => this._focus("name") }
                  keyboardType="numeric"
                  containerStyle={[s.inputContainer, inputContainerStyle]} />
              </View>
              <Image style={s.icon} source={Icons[this._cvcIconToShow()]} />
            </View>

              }
            </View>
          </View>
        </View>
        { requiresName &&
          <View
            style={{
              width: "100%",
              marginBottom: 8,
            }}>
            <Text style={labelStyle}>
              {nameLabel}
            </Text>
            <CCInput {...this._inputProps("name")}
              onSubmitEditing={ () => this._focus("postalCode") }
              keyboardType="default"
              containerStyle={[s.inputContainer, inputContainerStyle, { borderWidth: 1, borderRadius: 5 }]} />
          </View> }
        { requiresPostalCode &&
          <View
            style={{
              width: "100%",
            }}>
            <Text style={labelStyle}>
              {regionLabel}
            </Text>
            <CCInput {...this._inputProps("postalCode")}
              keyboardType="default"
              containerStyle={[s.inputContainer, inputContainerStyle, { borderWidth: 1, borderRadius: 5 }]} />
          </View> }
      </View>
    );
  }
}
