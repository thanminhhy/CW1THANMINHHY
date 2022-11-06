/* eslint-disable*/
import 'react-native-gesture-handler';
import * as React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useState, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage';
import {FloatingAction} from 'react-native-floating-action';
import moment from 'moment';

var db = openDatabase({name: 'TripDatabase.db'});

function List({navigation}) {
  const [items, setItems] = useState([]);
  const [empty, setEmpty] = useState([]);

  const isFocused = useIsFocused();

  const actions = [
    {
      text: 'Create',
      icon: require('./images/icons8-add-64.png'),
      name: 'bt_create',
      position: 2,
    },
    {
      text: 'Delete All Trip',
      icon: require('./images/icons8-add-64.png'),
      name: 'bt_delete_all',
      position: 1,
    },
  ];

  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Trip_Table'",
        [],
        function (tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS Trip_Table', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Trip_Table(trip_id INTEGER PRIMARY KEY AUTOINCREMENT, trip_name VARCHAR(30), trip_departure VARCHAR(255), trip_destination VARCHAR(255), trip_date VARCHAR(255), trip_customerName VARCHAR(255), trip_risksAssessment VARCHAR(255), trip_description VARCHAR(255))',
              [],
            );
          }
        },
      );
    });
  }, [isFocused]);

  useEffect(() => {
    getData();
  }, [isFocused]);

  const getData = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Trip_Table', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        setItems(temp);

        if (results.rows.length >= 1) {
          setEmpty(false);
        } else {
          setEmpty(true);
        }
      });
    });
  };

  const deleteAllRecord = () => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM Trip_Table');
    });
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
    setItems([]);
    getData();
  };

  navigateToCreate = () => {
    navigation.navigate('Create');
  };

  const navigateToEditScreen = (
    id,
    name,
    departure,
    destination,
    date,
    customerName,
    risksAssessment,
    description,
  ) => {
    navigation.navigate('Edit', {
      trip_id: id,
      trip_name: name,
      trip_departure: departure,
      trip_destination: destination,
      trip_date: date,
      trip_customerName: customerName,
      trip_risksAssessment: risksAssessment,
      trip_description: description,
    });
  };

  const listViewItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#000',
        }}
      />
    );
  };

  const emptyMSG = status => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <Text style={{fontSize: 25, textAlign: 'center'}}>
          No Trip Available
        </Text>
      </View>
    );
  };

  // const navigateToEditScreen = (id, name, phoneNumber, address) => {
  //   navigation.navigate('EditRecordScreen', {
  //     student_id: id,
  //     student_name: name,
  //     student_phone: phoneNumber,
  //     student_address: address,
  //   });
  // };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        {empty ? (
          emptyMSG(empty)
        ) : (
          <FlatList
            data={items}
            ItemSeparatorComponent={listViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View key={item.trip_id} style={{padding: 20}}>
                <TouchableOpacity
                  onPress={() =>
                    navigateToEditScreen(
                      item.trip_id,
                      item.trip_name,
                      item.trip_departure,
                      item.trip_destination,
                      item.trip_date,
                      item.trip_customerName,
                      item.trip_risksAssessment,
                      item.trip_description,
                    )
                  }>
                  <Text style={styles.itemsStyle}>
                    Trip Name: {item.trip_name}{' '}
                  </Text>
                  <Text style={styles.itemsStyle}>
                    Trip Departure: {item.trip_departure}
                  </Text>
                  <Text style={styles.itemsStyle}>
                    Trip Destination: {item.trip_destination}
                  </Text>
                  <Text style={styles.itemsStyle}>
                    Trip Date: {moment(new Date(item.trip_date)).format('ll')}
                  </Text>
                  <Text style={styles.itemsStyle}>
                    Trip Customer Name: {item.trip_customerName}
                  </Text>
                  <Text style={styles.itemsStyle}>
                    Trip Risk Assessment: {item.trip_risksAssessment}
                  </Text>
                  <Text style={styles.itemsStyle}>
                    Trip Description: {item.trip_description}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
        <FloatingAction
          actions={actions}
          onPressItem={name => {
            {
              if (name == 'bt_create') navigateToCreate();
              if (name == 'bt_delete_all') deleteAllRecord();
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },

  itemsStyle: {
    fontSize: 22,
    color: '#000',
  },
});

export default List;
