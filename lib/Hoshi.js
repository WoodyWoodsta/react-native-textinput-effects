import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native';

import BaseInput from './BaseInput';

export default class Hoshi extends BaseInput {
  static propTypes = {
    borderColor: PropTypes.string,

    /*
     * this is used to set backgroundColor of label mask.
     * this should be replaced if we can find a better way to mask label animation.
     */
    maskColor: PropTypes.string,
    height: PropTypes.number,
    padding: PropTypes.number,
  };

  static defaultProps = {
    borderColor: 'red',
    height: 48,
  };

  render() {
    const {
      label,
      style: containerStyle,
      inputStyle,
      labelStyle,
      maskColor,
      borderColor,
      underlineWidth = 3,
      height: inputHeight,
      padding = 16,
    } = this.props;

    const styles = getStyles(padding);

    const { width, focusedAnim, value } = this.state;
    const flatStyles = StyleSheet.flatten(containerStyle) || {};
    const labelFontSize = (labelStyle && labelStyle.fontSize) || styles.label.fontSize;
    const containerWidth = flatStyles.width || width;

    return (
      <View
        style={[
          styles.container,
          {
            height: inputHeight + padding,
            width: containerWidth,
          },
          containerStyle,
        ]}
        onLayout={this._onLayout}
      >
        <TextInput
          ref="input"
          {...this.props}
          style={[
            styles.textInput,
            {
              width,
              height: inputHeight,
            },
            inputStyle,
          ]}
          value={value}
          onBlur={this._onBlur}
          onChange={this._onChange}
          onFocus={this._onFocus}
          underlineColorAndroid={'transparent'}
        />
        <TouchableWithoutFeedback onPress={this.focus}>
          <Animated.View
            style={[
              styles.labelContainer,
              {
                opacity: focusedAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0, 1],
                }),
                top: focusedAnim.interpolate({
                  inputRange: [0, 0.5, 0.51, 1],
                  outputRange: [24, 24, 0, 0],
                }),
                left: focusedAnim.interpolate({
                  inputRange: [0, 0.5, 0.51, 1],
                  outputRange: [padding, 2 * padding, 0, padding],
                }),
              },
            ]}
          >
            <Animated.Text style={[
              styles.label,
              labelStyle,
              {
                fontSize: focusedAnim.interpolate({
                  inputRange: [0, 0.5, 0.51, 1],
                  outputRange: [labelFontSize, labelFontSize, labelFontSize * 0.75, labelFontSize * 0.75],
                }),
              },
            ]}>
              {label}
            </Animated.Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <View style={[styles.labelMask, { backgroundColor: maskColor }]} />
        <Animated.View
          style={[
            styles.border,
            {
              width: focusedAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width],
              }),
              backgroundColor: borderColor,
              height: underlineWidth,
            },
          ]}
        />
      </View>
    );
  }
}

const getStyles = (padding: number) => StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderBottomColor: '#b9c1ca',
  },
  labelContainer: {
    position: 'absolute',
  },
  label: {
    fontSize: 16,
    color: '#6a7989',
  },
  textInput: {
    position: 'absolute',
    bottom: 2,
    left: padding,
    padding: 0,
    color: '#6a7989',
    fontSize: 18,
    fontWeight: 'bold',
  },
  labelMask: {
    height: 24,
    width: padding,
  },
  border: {
    position: 'absolute',
    bottom: 0, // TODO: Need to make sure that the border covers the entire container border (currently sits on top)
    left: 0,
    right: 0,
  },
});
