/* eslint-disable*/
import 'react-native-gesture-handler';
import * as React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useState, useEffect} from 'react';
import {} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';

var db = openDatabase({name: 'TripDatabase.db'});

function List({navigation}) {
  const risksArray = ['Yes', 'No'];
  const [trip_name, set_trip_name] = useState('');
  const [trip_departure, set_trip_departure] = useState('');
  const [trip_destination, set_trip_destination] = useState('');
  const [trip_date, set_trip_date] = useState(new Date());
  const [trip_customerName, set_trip_customerName] = useState('');
  const [trip_risksAssessment, set_trip_risksAssessment] = useState('');
  const [trip_description, set_trip_description] = useState('');
  const [datePicker, setDatePicker] = useState(false);

  function showDatePicker() {
    setDatePicker(true);
  }

  function onDateSelected(event, value) {
    set_trip_date(value);
    setDatePicker(false);
  }

  const insertData = () => {
    if (
      trip_name == '' ||
      trip_departure == '' ||
      trip_destination == '' ||
      trip_date == '' ||
      trip_customerName == '' ||
      trip_risksAssessment == '' ||
      trip_description == ''
    ) {
      Alert.alert('Please Enter All the Required Fields');
    } else {
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO Trip_Table (trip_name, trip_departure, trip_destination, trip_date, trip_customerName, trip_risksAssessment,trip_description) VALUES (?,?,?,?,?,?,?)',
          [
            trip_name,
            trip_departure,
            trip_destination,
            trip_date,
            trip_customerName,
            trip_risksAssessment,
            trip_description,
          ],
          (tx, results) => {
            console.log('hi');
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert('Trip Created Successfully....');
              navigation.navigate('List');
            } else Alert.alert('Created Failed....');
          },
        );
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={text => set_trip_name(text)}
          placeholder="Enter Trip Name"
          value={trip_name}
        />

        <TextInput
          style={styles.textInputStyle}
          onChangeText={text => set_trip_departure(text)}
          placeholder="Enter Trip Departure"
          value={trip_departure}
        />

        <TextInput
          style={styles.textInputStyle}
          onChangeText={text => set_trip_destination(text)}
          placeholder="Enter Trip Destination"
          value={trip_destination}
        />

        <Text style={styles.textStyle}>{trip_date.toDateString()}</Text>

        {datePicker && (
          <DateTimePicker
            value={trip_date}
            mode={'date'}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={true}
            onChange={onDateSelected}
            style={StyleSheet.datePicker}
          />
        )}

        {!datePicker && (
          <View style={{margin: 10, width: '90%'}}>
            <Button
              title="Choosing Trip Date"
              color="#00B8D4"
              onPress={showDatePicker}
            />
          </View>
        )}

        <TextInput
          style={styles.textInputStyle}
          onChangeText={text => set_trip_customerName(text)}
          placeholder="Enter Trip Customer Name"
          value={trip_customerName}
        />

        <SelectDropdown
          buttonStyle={{
            borderWidth: 1,
            borderColor: '#00B8D4',
            borderRadius: 7,
            marginTop: 10,
            width: '90%',
          }}
          defaultButtonText="Risk Assessment"
          buttonTextStyle={{fontSize: 15, color: 'grey'}}
          data={risksArray}
          onSelect={(selectedItem, index) => {
            if (index === 1) set_trip_risksAssessment('no');
            if (index === 0) set_trip_risksAssessment('yes');
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item;
          }}
          value={trip_risksAssessment}
        />

        <TextInput
          style={styles.textInputStyle}
          onChangeText={text => set_trip_description(text)}
          placeholder="Enter Trip Description"
          value={trip_description}
        />

        <TouchableOpacity
          style={[
            styles.touchableOpacity,
            {marginTop: 50, backgroundColor: '#33691E'},
          ]}
          onPress={() => insertData()}>
          <Text style={styles.touchableOpacityText}>Create Trip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginTop: 45,
  },

  textInputStyle: {
    height: 45,
    width: '90%',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#00B8D4',
    borderRadius: 7,
    marginTop: 15,
  },

  textStyle: {
    height: 45,
    width: '90%',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#00B8D4',
    borderRadius: 7,
    marginTop: 15,
    paddingTop: 10,
  },

  touchableOpacity: {
    backgroundColor: '#0091EA',
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },

  touchableOpacityText: {
    color: '#FFFFFF',
    fontSize: 23,
    textAlign: 'center',
    padding: 8,
  },

  itemsStyle: {
    fontSize: 22,
    color: '#000',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default List;
