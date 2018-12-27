import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,TouchableOpacity
} from 'react-native';
import {
  BarcodePicker,
  Barcode,
  ScanSettings,
  ScanditModule
} from 'scandit-react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp,listenOrientationChange as loc,
  removeOrientationListener as rol} from 'react-native-responsive-screen';

  ScanditModule.setAppKey('AdUc/SH6Pf/NJN3lljyLzyI/AtdVI/XfYl7lWOJu8IeOPMZGyCGGToRhw9hmQsgeTSyUkPpqKIlwLXG+dW/1oLV9j4qFWWKCQwhcC8kvOsvvNR1oyS7ZpZgcaEbmD6UCfC3Kr7wj8PVvIMT/ELsjvWflb9E/VCZwSFggSYkjQhikmfnK1docjHqnJLeAKM4ZmQlmlS7q5fx/TYKlSb7hxZWuDFWjurBBIYXFABDBuLHklDV0Y6aqoPRJ5SWJG7KRCQz81VNxHyVYoLFS++nDAWHrhydn7Zwx32VV9hb287iMqjaYYH1iZihRCUVOFLY1ImqX36E+BNy1jy1QymZRXolrPc7vpgJeQ6817FVjD9l5EL9cdgAzVLuQmqaMwSDEbQp9eA0eoFingolY+EoX9E6OaWqP4RCY7CEtchqjUluQ9ZbylgSToq0xlpq0f4bU9Y9hQkBa6RfcQTfdvpe/MvT2F6DhZOsdYYqQVOHq3FIQxO1c/MpXUGD+yz58xXMtSncq0YXLKpC7qZcFHy/2/MhtqD7Tg4gt5/7bf1K4AVYuJ+ByytVi4YNNthm7NPhBeHZVa72qvLfQIOrnh8SYGCEzhjnngqNvJ5h3wy5L8NQxbaZnWYHkknClL6fCi0+ktlHOLvJzKmAsSOHC52Y+/44CrlleyRxX2uw2vTwVZX5lQ9Wdd6qrhqrNyTP7KEPMG6EELkLsI0avp8dPu++hESqVlCDzcSNUhxF3Rwptn6FgU9urmkQmE0t7jF1NIerWuFbpn0+jHuHekh/VDCHtPjyFvYKXPi1hb/80qw==');

export default class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      scanData: []
    }

  }

  componentWillMount() {
    this.settings = new ScanSettings();
    this.settings.setSymbologyEnabled(Barcode.Symbology.EAN13, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.EAN8, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.UPCA, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.UPCE, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.CODE39, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.ITF, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.QR, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.DATA_MATRIX, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.CODE128, true);
    this.settings.setSymbologyEnabled(Barcode.Symbology.MICROQR, true);
    rol();

    /* Some 1d barcode symbologies allow you to encode variable-length data. By default, the
       Scandit BarcodeScanner SDK only scans barcodes in a certain length range. If your
       application requires scanning of one of these symbologies, and the length is falling
       outside the default range, you may need to adjust the "active symbol counts" for this
       symbology. This is shown in the following few lines of code. */
      this.settings.getSymbologySettings(Barcode.Symbology.CODE39)
      .activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    /* For details on defaults and how to calculate the symbol counts for each symbology, take
       a look at http://docs.scandit.com/stable/c_api/symbologies.html. */
  }

  componentDidMount() {
     loc(this);
    this.scanner.startScanning();
  }

  onScan(session) {
    //Vibration.vibrate();
    alert(session.newlyRecognizedCodes[0].data + " " + session.newlyRecognizedCodes[0].symbology);
    //console.log(session.newlyRecognizedCodes);
    const scanData=session.newlyRecognizedCodes;
    console.log(scanData[0].data);
     let joined = [session.newlyRecognizedCodes[0].data].concat(this.state.scanData);
    this.setState({ scanData: joined });
     console.log(joined);
  }

  _renderItem({ item }) {
    return <Text>{item}</Text>;
  }

  Clear(e) {
    var array = [...this.state.scanData];
    var index = array.indexOf(e.target.value);
    array.shift(index, 1);
    this.setState({ scanData: array });
    console.log(array);
  }

  render() {
    return (
      <View style={{ flex: 1}}>
        <BarcodePicker
          onScan={(session) => { this.onScan(session) }}
          scanSettings= { this.settings }
          ref={(scan) => { this.scanner = scan }}
          style={{ width:wp('100%'),height:hp('50%') }}>
          </BarcodePicker>
        <View style={styles.dataView}>
            <FlatList
              data={this.state.scanData}
              style={{ marginTop: 50, marginLeft: 90 }}
              renderItem={this._renderItem}
              keyExtractor={index => index.toString()}
            />
        </View>

        <View style={[styles.bottomOverlay, styles.overlay]}>
          <TouchableOpacity onPress={this.Clear.bind(this)}>
                    <Text  style={styles.ClearButton}>Clear</Text>
            </TouchableOpacity>
        </View>
   </View>

    );
  }
}

const styles = StyleSheet.create({
  dataView: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    flex: 1,
   // height: 250,
   // width: 350,
    width:wp('80%'),
    height:hp('35%'),
    borderWidth: 3,
    borderColor: "#000",
    backgroundColor: "transparent",
    marginTop: 350,
    marginLeft: 40,
    marginRight: 20
  },
  overlay: {
    position: "absolute",
    padding: 10,
    right: 0,
    left: 0,
    alignItems: "center"
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end"
  },
  ClearButton: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "blue",
    paddingRight: 13,
    paddingLeft:13,
    paddingTop:5,
    paddingBottom:5,
    color:'#fff',
    marginLeft:330,
    borderRadius:5
  },
})
