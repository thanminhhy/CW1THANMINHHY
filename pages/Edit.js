/* eslint-disable*/
import 'react-native-gesture-handler';
import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native';
import {useState, useEffect} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';
import moment from 'moment';

var db = openDatabase({name: 'TripDatabase.db'});

function EditRecordScreen({route, navigation}) {
  const risksArray = ['Yes', 'No'];
  const [trip_id, set_trip_id] = useState('');
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

  useEffect(() => {
    set_trip_id(route.params.trip_id);
    set_trip_name(route.params.trip_name);
    set_trip_departure(route.params.trip_departure);
    set_trip_destination(route.params.trip_destination);
    set_trip_date(route.params.trip_date);
    set_trip_customerName(route.params.trip_customerName);
    set_trip_risksAssessment(route.params.trip_risksAssessment);
    set_trip_description(route.params.trip_description);
  }, []);

  const editData = () => {
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
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE Trip_Table set trip_name=?, trip_departure=? , trip_destination=?, trip_date=?, trip_customerName=?, trip_risksAssessment=?, trip_description=? where trip_id=?',
          [
            trip_name,
            trip_departure,
            trip_destination,
            trip_date,
            trip_customerName,
            trip_risksAssessment,
            trip_description,
            trip_id,
          ],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert('Record Updated Successfully...');
              navigation.navigate('List');
            } else Alert.alert('Update Fail...');
          },
        );
      });
    }
  };

  const deleteRecord = () => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Trip_Table where trip_id=?',
        [trip_id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Done',
              'Record Deleted Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('List'),
                },
              ],
              {cancelable: false},
            );
          }
        },
      );
    });
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

        <Text style={styles.textStyle}>
          {moment(new Date(trip_date)).format('ll')}
        </Text>

        {datePicker && (
          <DateTimePicker
            value={new Date(trip_date)}
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
          defaultValueByIndex={trip_risksAssessment === 'no' ? 1 : 0}
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
          style={styles.touchableOpacity}
          onPress={() => editData()}>
          <Text style={styles.touchableOpacityText}>
            Click Here To Edit Record
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.touchableOpacity,
            {marginTop: 20, backgroundColor: '#33691E'},
          ]}
          onPress={deleteRecord}>
          <Text style={styles.touchableOpacityText}>
            {' '}
            Click Here To Delete Current Record{' '}
          </Text>
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
    marginTop: 10,
  },

  textInputStyle: {
    height: 45,
    width: '90%',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#00B8D4',
    borderRadius: 7,
    marginTop: 15,
    marginBottom: 5,
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

export default EditRecordScreen;
