// @flow

import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';
import { GREY_80 } from 'colors';
import { appName } from 'config';
// import { iconsMap } from 'assets/AppIcons';
import CurrencyBlock from 'blocks/CurrencyBlock';
import { styles } from './';
import type { CurrencyRowItemProps } from './types';

export default class CurrencyRowItem extends PureComponent<CurrencyRowItemProps, {}> {
  render() {
    const { item, selectCurrency, navigation } = this.props;

    return (
      <TouchableOpacity
        onPress={() => {
          selectCurrency();

          navigation.push('CurrencyInfoScreen', {
            activeCurrencyName: item.name,
          });

          // navigator.push({
          //   screen: `${appName}.Currency`,
          //   backButtonHidden: false,
          //   title: item.name.toUpperCase(),
          //   navigatorStyle: {
          //     navBarTranslucent: false,
          //     drawUnderNavBar: true,
          //     navBarTextColor: '#fff',
          //     navBarBackgroundColor: GREY_80,
          //     navBarButtonColor: 'white',
          //     navBarNoBorder: true,
          //     statusBarTextColorScheme: 'light',
          //     screenBackgroundColor: GREY_80,
          //   },
          //   navigatorButtons: {
          //     leftButtons: [
          //       {
          //         id: 'closeCurrency',
          //         title: '',
          //         icon: iconsMap['ios-arrow-round-back'],
          //         buttonFontSize: 14,
          //       },
          //     ],
          //   },
          // });
        }}
        style={styles.item}
      >
        <CurrencyBlock item={item} />
      </TouchableOpacity>
    );
  }
}
