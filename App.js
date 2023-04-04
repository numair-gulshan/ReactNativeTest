import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  FlatList,
  StatusBar,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import FastImage from 'react-native-fast-image';

const App = () => {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleKeywordChange = text => {
    setKeyword(text);

    if (text.length > 3) {
      let result = users.filter(
        el =>
          el.name.first.toLowerCase().includes(text.toLowerCase()) ||
          el.name.last.toLowerCase().includes(text.toLowerCase()),
      );

      setSearchResult(result);
    }
  };

  const fetchUsers = () => {
    try {
      const url = 'https://randomuser.me/api/?results=5000';
      fetch(url)
        .then(res => res.json())
        .then(res => {
          setLoading(false);
          setUsers(res.results);
        })
        .catch(error => {
          setLoading(false);
          console.log('fetch error ', error);
        });
    } catch (error) {
      setLoading(false);
      console.log('fetch users error ', error);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.userCard}>
        <View style={styles.imgContainer}>
          <FastImage source={{uri: item.picture.medium}} style={styles.img} />
        </View>

        <View style={styles.nameContainer}>
          <Text style={{color: '#fff'}}>
            {`${item.name.title} ${item.name.first} ${item.name.last}`}
          </Text>

          <Text style={{color: '#fff'}}>
            {`${item.location.city} ${item.location.state}`}
          </Text>
        </View>
      </View>
    );
  };

  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />

      <View style={styles.searchContainer}>
        <TextInput
          value={keyword}
          placeholder="Search"
          placeholderTextColor="#fff"
          onChangeText={handleKeywordChange}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={keyword.length <= 3 ? users : searchResult}
        keyExtractor={(item, index) => index}
        renderItem={renderItem}
        maxToRenderPerBatch={50}
        initialNumToRender={50}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },

  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  searchContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  searchInput: {
    padding: 10,
    width: '95%',
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: '#fff',
    alignSelf: 'center',
  },

  userCard: {
    flexDirection: 'row',
    backgroundColor: '#444444',
    padding: 10,
    marginVertical: 10,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 15,
    justifyContent: 'space-between',
  },

  imgContainer: {
    width: '15%',
  },

  nameContainer: {
    width: '80%',
    justifyContent: 'center',
  },

  img: {
    width: '100%',
    height: 50,
    borderRadius: 25,
  },
});

export default App;
