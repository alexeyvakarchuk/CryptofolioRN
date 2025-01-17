import React, {Component} from 'react'
import { StyleSheet, View } from 'react-native'
import { GREY_MARKER_BG, GREY_60 } from 'colors'

class CurrenciesLoader extends Component {
  render() {
    return (
      <View style={styles.currencyContainer}>
        <View style={styles.grid}>
          <View style={styles.col}>
            <View style={styles.currencySymbol} />
          </View>
          <View style={[styles.col, styles.col_right]}>
            <View style={styles.currencyPrice} />
            <View style={styles.currencyChange} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  currencyContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 35,
    opacity: .4,
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  col_right: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  currencySymbol: {
    backgroundColor: GREY_60,
    height: 25,
    borderRadius: 2,
    width: 45.5,
  },
  currencyPrice: {
    height: 18,
    width: 70,
    borderRadius: 2,
    backgroundColor: GREY_60,
  },
  currencyChange: {
    width: 25,
    height: 13,
    marginTop: 4,
    borderRadius: 2,
    backgroundColor: GREY_60,
  },
})

CurrenciesLoader.propTypes = {
  // item: PropTypes.shape({
  //   name: PropTypes.string.isRequired
  // }).isRequired
}

export default CurrenciesLoader
