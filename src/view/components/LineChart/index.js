import React, {Component} from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import ChartView from 'react-native-highcharts'
import { chartDataSelector, chartActiveFilterSelector, fetchChartData } from 'ducks/currency'
import { connect } from 'react-redux'
import _ from 'lodash'
import LottieView from 'lottie-react-native'
import { GREY_80, GREY_60, GREY_10 } from 'colors'

class Spinner extends Component {
  componentDidMount() {
    this.animation.play();
  }

  render() {
    return (
      <View style={[styles.container, styles.containerLoader]}>
        <View
          style={styles.loader}
        >
          <LottieView
            source={require('../../../assets/loader.json')}
            style={styles.loader}
            ref={animation => {
              this.animation = animation;
            }}
          />
        </View>
      </View>
    )
  }
}


@connect((state) => ({
  data: chartDataSelector(state),
  activeFilter: chartActiveFilterSelector(state)
}), { fetchChartData })
export default class LineChart extends Component {

  state = {
    opacity: 0,
  }

  componentDidMount() {
    this.props.fetchChartData(this.props.coinId, 'All')
  }

  componentWillUpdate(nextProps) {
    if (!_.isEqual(nextProps, this.props)) {
      this.setState({opacity: 0})
    }
  }

  toggleFilter = (filterId) => () => {
    if (filterId !== this.props.activeFilter) this.props.fetchChartData(this.props.coinId, filterId)
  }

  render() {
    const Highcharts = 'Highcharts'

    const { activeFilter } = this.props

    const conf = {
      chart: {
        type: 'area',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        backgroundColor: GREY_80,
      },
      credits: {
        enabled: false
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150,
        labels: {
          style: {
            color: '#689FEB'
          }
        },
        lineColor: GREY_60,
        tickColor: GREY_60,
      },
      yAxis: {
        title: {
          text: ''
        },
        floor: 0,
        gridLineColor: GREY_60,
        plotLines: [{
          value: 0,
          width: 1,
        }],
        labels: {
          style: {
            color: '#689FEB'
          }
        },
        // minorGridLineColor: '#475173',
        // tickColor: '#364061',
      },
      tooltip: {
        backgroundColor: GREY_60,
        borderWidth: 0,
        style: {
          color: '#fff',
          fontSize: 13.5,
          fontFamily: 'Rubik-Medium',
        },
        padding: 10,
        formatter: function () {
          return `<b>$${(this.y >=1) ? Highcharts.numberFormat(this.y, 2) : Highcharts.numberFormat(this.y, 6)}</b>`
        }
      },
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: [0, 0, 0, 300],
            stops: [
              [0, 'rgba(104, 159, 235, 0.35)'],
              [1, 'rgba(54, 64, 97, 0.3)'],
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 2,
          states: {
            hover: {
              lineWidth: 2
            }
          },
          threshold: null
        }
      },
      series: [{
        color: {
          linearGradient: [0, 0, 0, 500],
          stops: [
            [0, '#50B6C4'],
            [1, '#3476AD']
          ]
        },
        // data: (function () {
        //   // generate an array of random data
        //   var data = [],
        //     time = (new Date()).getTime(),
        //     i;
        //
        //   for (i = -19; i <= 0; i += 1) {
        //     data.push({
        //       x: time + i * 1000,
        //       y: Math.random()
        //     });
        //   }
        //   return data;
        // }())

        data: (() => {
          const { data } = this.props
          
          const step = Math.floor(data.length / 150)

          return data.length && this.props.data
            .filter((el, index) => index % step === 0)
            .map(({time, price}) => ({
              x: time,
              y: price,
            }))
        })()
      }]
    };

    const options = {
      global: {
        useUTC: false
      },
      lang: {
        decimalPoint: ',',
        thousandsSep: '.'
      }
    }

    const filters = [
      {
        id: 'All'
      },
      {
        id: '24H'
      },
      {
        id: '1W'
      },
      {
        id: '1M'
      },
      {
        id: '3M'
      },
    ]

    
    return (
      <View>
        <View>
          {this.props.progress ?
            <Spinner/>
            :
            <ChartView
              style={[styles.container, { opacity: this.state.opacity }]}
              config={conf}
              options={options}
              onLoadEnd={() => this.setState({opacity: 1})}
            />}
        </View>
        <View style={styles.filtersContainer}>
          {filters.map(({ id }) => (
            <TouchableOpacity
              style={styles.filtersItem}
              key={id}
              onPress={this.toggleFilter(id)}
            >
              <Text style={[styles.filtersItemText, (activeFilter === id) && styles.filtersItemTextActive]}>{id}</Text>
              {(activeFilter === id) && <View style={styles.activeFilterTick} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({

  container: {
    height: 280,
    marginTop: 15,
    marginBottom: 10,
  },
  containerLoader: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    height: 120,
    width: '100%',
  },
  filtersContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 35,
    paddingLeft: 20,
    paddingRight: 20
  },
  filtersItem : {
    flexDirection: 'column',
    alignItems: 'center',
  },
  activeFilterTick: {
    width: 8,
    height: 1,
    backgroundColor: '#F5FF30',
  },
  filtersItemText: {
    fontSize: 14,
    color: GREY_10,
    fontFamily: 'Rubik-Medium',
    paddingBottom: 10,
  },
  filtersItemTextActive: {
    color: '#fff',
  }
})